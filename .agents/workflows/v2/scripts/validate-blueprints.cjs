#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CORE_FILES = ["product.md", "domain.md", "architecture.md", "quality.md", "ux-system.md", "engineering.md", "repository-map.md"];
const PROFILES = new Set(["unclassified", "patch", "feature", "initiative"]);
const STATES = new Set(["ingested", "clarified", "specified", "planned", "implementing", "verifying", "accepted", "blocked", "rejected", "stale"]);
const ACTIVE_SEQUENCE = new Map([["ingested", 0], ["clarified", 1], ["specified", 2], ["planned", 3], ["implementing", 4], ["verifying", 5], ["accepted", 6]]);
const ID_PATTERN = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/;
const PLACEHOLDER_PATTERN = /\b(?:TBD|TODO|FIXME)\b|\{(?:CHANGE-ID|project-slug)\}/i;

class ValidationResult {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }
  error(message) { this.errors.push(message); }
  warn(message) { this.warnings.push(message); }
}

function isFile(filePath) {
  try { return fs.statSync(filePath).isFile(); } catch { return false; }
}

function isDirectory(directoryPath) {
  try { return fs.statSync(directoryPath).isDirectory(); } catch { return false; }
}

function loadJson(filePath, result) {
  if (!isFile(filePath)) {
    result.error(`Missing required JSON file: ${filePath}`);
    return null;
  }
  try {
    const value = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (value === null || Array.isArray(value) || typeof value !== "object") {
      result.error(`Expected a JSON object in ${filePath}`);
      return null;
    }
    return value;
  } catch (error) {
    result.error(`Cannot read valid JSON from ${filePath}: ${error.message}`);
    return null;
  }
}

function requireFields(value, fields, filePath, result) {
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(value, field)) result.error(`Missing field '${field}' in ${filePath}`);
  }
}

function validateTraceability(root, result) {
  const filePath = path.join(root, "traceability.json");
  const data = loadJson(filePath, result);
  if (!data) return { nodes: new Map(), edges: [] };
  requireFields(data, ["schema_version", "nodes", "edges"], filePath, result);
  if (data.schema_version !== 2) result.error(`${filePath}: schema_version must be 2`);
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    result.error(`${filePath}: nodes and edges must be arrays`);
    return { nodes: new Map(), edges: [] };
  }

  const nodes = new Map();
  data.nodes.forEach((node, index) => {
    if (node === null || Array.isArray(node) || typeof node !== "object") {
      result.error(`${filePath}: node ${index} must be an object`);
      return;
    }
    requireFields(node, ["id", "type", "title", "status", "source"], filePath, result);
    if (typeof node.id !== "string" || !ID_PATTERN.test(node.id)) {
      result.error(`${filePath}: invalid node ID at index ${index}: ${JSON.stringify(node.id)}`);
      return;
    }
    if (nodes.has(node.id)) result.error(`${filePath}: duplicate node ID ${node.id}`);
    else nodes.set(node.id, node);
  });

  const validEdges = [];
  const seenEdges = new Set();
  data.edges.forEach((edge, index) => {
    if (edge === null || Array.isArray(edge) || typeof edge !== "object") {
      result.error(`${filePath}: edge ${index} must be an object`);
      return;
    }
    requireFields(edge, ["from", "to", "type"], filePath, result);
    if (!nodes.has(edge.from)) result.error(`${filePath}: edge ${index} has unknown source ${JSON.stringify(edge.from)}`);
    if (!nodes.has(edge.to)) result.error(`${filePath}: edge ${index} has unknown target ${JSON.stringify(edge.to)}`);
    const key = JSON.stringify([edge.from, edge.to, edge.type]);
    if (seenEdges.has(key)) result.warn(`${filePath}: duplicate edge ${key}`);
    else { seenEdges.add(key); validEdges.push(edge); }
  });
  return { nodes, edges: validEdges };
}

function requiredChangeFiles(profile, state) {
  const required = new Set(["request.md", "status.json"]);
  const rank = ACTIVE_SEQUENCE.get(state);
  if (rank === undefined) return required;
  if (rank >= 2) {
    required.add("classification.md");
    required.add("impact-analysis.md");
    if (profile === "feature" || profile === "initiative") {
      required.add("specification.md");
      required.add("technical-design.md");
      required.add("test-plan.md");
    }
  }
  if (rank >= 3) required.add("implementation-plan.md");
  if (rank >= 4) required.add("execution-log.md");
  if (rank >= 6) required.add("validation-report.md");
  return required;
}

function requirementReachesEvidence(requirementId, nodes, edges) {
  const adjacency = new Map();
  for (const edge of edges) {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
    adjacency.get(edge.from).push(edge.to);
  }
  const queue = [requirementId];
  const visited = new Set(queue);
  while (queue.length > 0) {
    const current = queue.shift();
    if (current !== requirementId && nodes.get(current)?.type === "evidence") return true;
    for (const target of adjacency.get(current) ?? []) {
      if (!visited.has(target)) { visited.add(target); queue.push(target); }
    }
  }
  return false;
}

function validateChange(changeDir, manifest, nodes, edges, result) {
  const statusPath = path.join(changeDir, "status.json");
  const status = loadJson(statusPath, result);
  if (!status) return;
  requireFields(status, ["schema_version", "change_id", "profile", "state", "core_version", "updated_at", "blocking_decisions"], statusPath, result);
  if (status.schema_version !== 2) result.error(`${statusPath}: schema_version must be 2`);
  const directoryName = path.basename(changeDir);
  if (status.change_id !== directoryName) result.error(`${statusPath}: change_id must match directory name ${directoryName}`);
  if (typeof status.change_id !== "string" || !ID_PATTERN.test(status.change_id)) result.error(`${statusPath}: invalid change_id ${JSON.stringify(status.change_id)}`);
  if (!PROFILES.has(status.profile)) result.error(`${statusPath}: invalid profile ${JSON.stringify(status.profile)}`);
  if (!STATES.has(status.state)) result.error(`${statusPath}: invalid state ${JSON.stringify(status.state)}`);
  if (["specified", "planned", "implementing", "verifying", "accepted"].includes(status.state) && status.profile === "unclassified") {
    result.error(`${statusPath}: profile cannot be unclassified in state ${status.state}`);
  }

  if (Number.isInteger(manifest.core_version) && Number.isInteger(status.core_version)) {
    if (status.core_version > manifest.core_version) result.error(`${statusPath}: core_version ${status.core_version} is newer than manifest ${manifest.core_version}`);
    else if (status.core_version < manifest.core_version && !["stale", "accepted", "rejected"].includes(status.state)) result.warn(`${statusPath}: change uses older core version ${status.core_version}; assess staleness`);
  }
  for (const filename of [...requiredChangeFiles(status.profile, status.state)].sort()) {
    if (!isFile(path.join(changeDir, filename))) result.error(`${changeDir}: state ${status.state} with profile ${status.profile} requires ${filename}`);
  }
  if (status.state !== "accepted") return;

  for (const filename of fs.readdirSync(changeDir).filter((name) => name.endsWith(".md"))) {
    const filePath = path.join(changeDir, filename);
    if (PLACEHOLDER_PATTERN.test(fs.readFileSync(filePath, "utf8"))) result.warn(`${filePath}: accepted artifact contains a placeholder marker`);
  }
  const sourcePrefix = `changes/${directoryName}/request.md`;
  const requirements = [...nodes.entries()]
    .filter(([, node]) => node.type === "requirement" && String(node.source ?? "").replaceAll("\\", "/").startsWith(sourcePrefix))
    .map(([nodeId]) => nodeId);
  if (requirements.length === 0) result.error(`${changeDir}: accepted change has no requirement nodes sourced from request.md`);
  for (const requirementId of requirements) {
    if (!requirementReachesEvidence(requirementId, nodes, edges)) result.error(`${changeDir}: accepted requirement ${requirementId} has no traceability path to evidence`);
  }
}

function validateBlueprint(root, selectedChange = null) {
  const result = new ValidationResult();
  if (!isDirectory(root)) { result.error(`Blueprint directory does not exist: ${root}`); return result; }
  const manifestPath = path.join(root, "manifest.json");
  const manifest = loadJson(manifestPath, result);
  if (!manifest) return result;
  requireFields(manifest, ["schema_version", "project_slug", "core_version", "lifecycle_status", "updated_at"], manifestPath, result);
  if (manifest.schema_version !== 2) result.error(`${manifestPath}: schema_version must be 2`);
  if (!Number.isInteger(manifest.core_version) || manifest.core_version < 1) result.error(`${manifestPath}: core_version must be a positive integer`);

  const coreDir = path.join(root, "core");
  for (const filename of CORE_FILES) if (!isFile(path.join(coreDir, filename))) result.error(`Missing core artifact: ${path.join(coreDir, filename)}`);
  if (!isDirectory(path.join(coreDir, "decisions"))) result.error(`Missing ADR directory: ${path.join(coreDir, "decisions")}`);
  const { nodes, edges } = validateTraceability(root, result);
  const changesDir = path.join(root, "changes");
  let candidates = [];
  if (selectedChange) {
    const selectedDir = path.join(changesDir, selectedChange);
    if (!isDirectory(selectedDir)) result.error(`Selected change directory does not exist: ${selectedDir}`);
    else candidates = [selectedDir];
  } else if (isDirectory(changesDir)) {
    candidates = fs.readdirSync(changesDir).map((entry) => path.join(changesDir, entry)).filter(isDirectory).sort();
  }
  for (const changeDir of candidates) validateChange(changeDir, manifest, nodes, edges, result);
  return result;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function selfTest() {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "blueprint-v2-validator-"));
  try {
    const root = path.join(temporaryRoot, "blueprint");
    const coreDir = path.join(root, "core");
    const changeDir = path.join(root, "changes", "CHANGE-DEMO-001");
    fs.mkdirSync(path.join(coreDir, "decisions"), { recursive: true });
    fs.mkdirSync(changeDir, { recursive: true });
    for (const filename of CORE_FILES) fs.writeFileSync(path.join(coreDir, filename), `# ${filename}\n`, "utf8");
    writeJson(path.join(root, "manifest.json"), { schema_version: 2, project_slug: "demo", core_version: 1, lifecycle_status: "active", updated_at: "2026-01-01" });
    for (const filename of ["request.md", "classification.md", "impact-analysis.md", "implementation-plan.md", "execution-log.md", "validation-report.md"]) {
      fs.writeFileSync(path.join(changeDir, filename), `# ${filename}\n`, "utf8");
    }
    writeJson(path.join(changeDir, "status.json"), { schema_version: 2, change_id: "CHANGE-DEMO-001", profile: "patch", state: "accepted", core_version: 1, updated_at: "2026-01-01", blocking_decisions: [] });
    const nodes = [
      ["REQ-DEMO-001", "requirement", "changes/CHANGE-DEMO-001/request.md"],
      ["TASK-DEMO-001", "task", "changes/CHANGE-DEMO-001/implementation-plan.md"],
      ["CODE-DEMO-001", "code", "src/demo.js"],
      ["TEST-DEMO-001", "test", "tests/demo.test.js"],
      ["EVIDENCE-DEMO-001", "evidence", "changes/CHANGE-DEMO-001/validation-report.md"],
    ].map(([id, type, source]) => ({ id, type, title: id, status: "active", source }));
    const edges = [
      ["REQ-DEMO-001", "TASK-DEMO-001", "implemented_by"],
      ["TASK-DEMO-001", "CODE-DEMO-001", "produces"],
      ["CODE-DEMO-001", "TEST-DEMO-001", "verified_by"],
      ["TEST-DEMO-001", "EVIDENCE-DEMO-001", "produces"],
    ].map(([from, to, type]) => ({ from, to, type }));
    writeJson(path.join(root, "traceability.json"), { schema_version: 2, nodes, edges });

    const valid = validateBlueprint(root);
    if (valid.errors.length > 0) {
      console.error("Self-test expected valid blueprint but found:");
      valid.errors.forEach((error) => console.error(`  ERROR: ${error}`));
      return false;
    }
    const traceabilityPath = path.join(root, "traceability.json");
    const traceability = JSON.parse(fs.readFileSync(traceabilityPath, "utf8"));
    traceability.nodes.push({ ...traceability.nodes[0] });
    writeJson(traceabilityPath, traceability);
    if (!validateBlueprint(root).errors.some((error) => error.includes("duplicate node ID"))) {
      console.error("Self-test expected duplicate-node detection");
      return false;
    }
    console.log("Self-test passed");
    return true;
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function printResult(result) {
  result.errors.forEach((error) => console.log(`ERROR: ${error}`));
  result.warnings.forEach((warning) => console.log(`WARNING: ${warning}`));
  console.log(`Validation complete: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`);
}

function usage() {
  console.log("Usage: node validate-blueprints.cjs <blueprintDir> [--change CHANGE-ID]");
  console.log("       node validate-blueprints.cjs --self-test");
}

function main(args) {
  if (args.includes("--self-test")) return selfTest() ? 0 : 1;
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) { usage(); return args.length === 0 ? 1 : 0; }
  const changeIndex = args.indexOf("--change");
  const selectedChange = changeIndex >= 0 ? args[changeIndex + 1] : null;
  if (changeIndex >= 0 && !selectedChange) { console.error("ERROR: --change requires a change ID"); return 1; }
  const result = validateBlueprint(path.resolve(args[0]), selectedChange);
  printResult(result);
  return result.errors.length > 0 ? 1 : 0;
}

process.exitCode = main(process.argv.slice(2));
