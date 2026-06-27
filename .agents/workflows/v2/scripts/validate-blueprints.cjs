#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const MANIFEST_FILE = "00-manifest.json";
const TRACEABILITY_FILE = "99-traceability.json";
const STATUS_FILE = "00-status.json";
const CORE_DIRECTORY = "01-core";
const CHANGES_DIRECTORY = "02-changes";
const DECISIONS_DIRECTORY = "08-decisions";
const PRODUCT_FILE = "01-product.md";
const DOMAIN_FILE = "02-domain.md";
const CORE_FILES = ["01-product.md", "02-domain.md", "03-architecture.md", "04-quality.md", "05-ux-system.md", "06-engineering.md", "07-repository-map.md"];
const PRODUCT_SECTIONS = ["Purpose", "Target users", "Outcomes", "Product epics", "Scope boundaries", "Product dependencies", "Product risks"];
const DOMAIN_SECTIONS = ["Purpose", "Core concepts and entities", "Out-of-scope domain concepts", "Relationships", "States and transitions", "Domain events", "Core rules and constraints", "Ownership, authority, and boundaries", "Assumptions and open questions", "Generation stop conditions"];
const PRODUCT_FORBIDDEN_SECTIONS = ["Facts", "Decisions", "Open questions"];
const PROFILES = new Set(["unclassified", "patch", "feature", "initiative"]);
const STATES = new Set(["ingested", "clarified", "specified", "planned", "implementing", "verifying", "accepted", "blocked", "rejected", "stale"]);
const ACTIVE_SEQUENCE = new Map([["ingested", 0], ["clarified", 1], ["specified", 2], ["planned", 3], ["implementing", 4], ["verifying", 5], ["accepted", 6]]);
const ID_PATTERN = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/;
const RISK_LEVELS = new Map([["low", 1], ["medium", 2], ["high", 3]]);
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function headingIndex(content, heading) {
  const match = new RegExp(`^## ${escapeRegex(heading)}\\s*$`, "im").exec(content);
  return match ? match.index : -1;
}

function sectionContent(content, heading) {
  const startMatch = new RegExp(`^## ${escapeRegex(heading)}\\s*$`, "im").exec(content);
  if (!startMatch) return null;
  const bodyStart = startMatch.index + startMatch[0].length;
  const remainder = content.slice(bodyStart);
  const nextHeading = /^##\s+/m.exec(remainder);
  return remainder.slice(0, nextHeading ? nextHeading.index : undefined).trim();
}

function validateNumberedProductEntries(content, heading, prefix, filePath, result, allowNone = false) {
  const section = sectionContent(content, heading);
  if (section === null) return;
  if (allowNone && /^None\.?$/i.test(section)) return;

  const entries = numberedEntries(section);
  if (entries.length === 0) {
    result.error(`${filePath}: '${heading}' must contain a numbered list with stable ${prefix}-* IDs`);
    return;
  }

  const ids = new Set();
  entries.forEach((entry, index) => {
    const number = Number(entry[1]);
    if (number !== index + 1) result.error(`${filePath}: '${heading}' numbering must be sequential from 1`);
    const idMatch = new RegExp(`\\b(${prefix}-[A-Z0-9]+(?:-[A-Z0-9]+)*)\\b`).exec(entry[2]);
    if (!idMatch) {
      result.error(`${filePath}: '${heading}' item ${number} is missing a stable ${prefix}-* ID`);
    } else if (ids.has(idMatch[1])) {
      result.error(`${filePath}: '${heading}' contains duplicate ID ${idMatch[1]}`);
    } else {
      ids.add(idMatch[1]);
    }
  });
}

function numberedEntries(section) {
  const starts = [...section.matchAll(/^(\d+)\.\s+/gm)];
  return starts.map((match, index) => {
    const bodyStart = match.index + match[0].length;
    const bodyEnd = starts[index + 1]?.index ?? section.length;
    return [section.slice(match.index, bodyEnd), match[1], section.slice(bodyStart, bodyEnd).trim()];
  });
}

function validatePurpose(content, filePath, result) {
  const section = sectionContent(content, "Purpose");
  if (section === null) return;
  const problem = /\*\*Problem being solved\*\*:\s*(.+?)(?=\n\s*\n|\*\*Product purpose\*\*:|$)/is.exec(section)?.[1]?.trim();
  const purpose = /\*\*Product purpose\*\*:\s*(.+)$/is.exec(section)?.[1]?.trim();
  if (!problem) result.error(`${filePath}: 'Purpose' must explain the main problem under '**Problem being solved**:'`);
  if (!purpose) result.error(`${filePath}: 'Purpose' must explain the product response and intended value under '**Product purpose**:'`);
}

function validateTargetUsers(content, filePath, result) {
  const section = sectionContent(content, "Target users");
  if (section === null) return;
  const lines = section.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const headerIndex = lines.findIndex((line) => /^\|\s*Persona\s*\|\s*Description\s*\|\s*Key needs\s*\|\s*Pain points\s*\|$/i.test(line));
  if (headerIndex < 0) {
    result.error(`${filePath}: 'Target users' must contain a table with columns Persona, Description, Key needs, and Pain points`);
    return;
  }
  const separator = lines[headerIndex + 1] ?? "";
  if (!/^\|\s*:?-{3,}:?\s*\|\s*:?-{3,}:?\s*\|\s*:?-{3,}:?\s*\|\s*:?-{3,}:?\s*\|$/.test(separator)) {
    result.error(`${filePath}: 'Target users' table is missing a valid four-column separator row`);
    return;
  }
  const rows = lines.slice(headerIndex + 2).filter((line) => /^\|.*\|$/.test(line));
  if (rows.length === 0) result.error(`${filePath}: 'Target users' table must contain at least one persona`);
  for (const [index, row] of rows.entries()) {
    const cells = row.slice(1, -1).split("|").map((cell) => cell.trim());
    if (cells.length !== 4 || cells.some((cell) => cell.length === 0)) {
      result.error(`${filePath}: target-user row ${index + 1} must provide all four fields`);
    }
  }
}

function parseMarkdownTable(section, expectedHeaders) {
  const lines = section.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const headerIndex = lines.findIndex((line) => {
    if (!/^\|.*\|$/.test(line)) return false;
    const cells = line.slice(1, -1).split("|").map((cell) => cell.trim().toLowerCase());
    return cells.length === expectedHeaders.length && cells.every((cell, index) => cell === expectedHeaders[index].toLowerCase());
  });
  if (headerIndex < 0) return { headerFound: false, separatorValid: false, rows: [] };

  const separator = lines[headerIndex + 1] ?? "";
  const separatorValid = new RegExp(`^\\|${expectedHeaders.map(() => "\\s*:?-{3,}:?\\s*\\|").join("")}$`).test(separator);
  const rows = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!/^\|.*\|$/.test(line)) continue;
    const cells = line.slice(1, -1).split("|").map((cell) => cell.trim());
    if (cells.length === expectedHeaders.length) rows.push(cells);
  }
  return { headerFound: true, separatorValid, rows };
}

function validateProductEpics(content, filePath, result) {
  const section = sectionContent(content, "Product epics");
  if (section === null) return;
  const entries = numberedEntries(section);
  validateNumberedProductEntries(content, "Product epics", "EPIC", filePath, result);
  for (const entry of entries) {
    if (!/\*\*Description\*\*:/i.test(entry[2])) {
      result.error(`${filePath}: product epic item ${entry[1]} is missing a '**Description**:' field`);
    }
    if (!/\*\*Sample user stories\*\*:/i.test(entry[2])) {
      result.error(`${filePath}: product epic item ${entry[1]} is missing a '**Sample user stories**:' field`);
    } else if (!/\bSample:(?:\*{1,2})?\s+/i.test(entry[2])) {
      result.error(`${filePath}: product epic item ${entry[1]} must include at least one story explicitly prefixed 'Sample:'`);
    }
  }
}

function validateProductRisks(content, filePath, result) {
  const section = sectionContent(content, "Product risks");
  if (section === null) return;

  const expectedHeaders = ["Risk ID", "Risk", "Probability", "Impact", "Rationale", "Product impact", "Watch/response"];
  const table = parseMarkdownTable(section, expectedHeaders);
  if (!table.headerFound) {
    result.error(`${filePath}: 'Product risks' must contain a table with columns ${expectedHeaders.join(", ")}`);
    return;
  }
  if (!table.separatorValid) {
    result.error(`${filePath}: 'Product risks' table is missing a valid seven-column separator row`);
    return;
  }
  if (table.rows.length === 0) {
    result.error(`${filePath}: 'Product risks' table must contain at least one risk row`);
    return;
  }

  const ids = new Set();
  let previousImpact = Infinity;
  let previousProbability = Infinity;
  for (const [index, row] of table.rows.entries()) {
    const [riskId, risk, probability, impact, rationale, productImpact, watchResponse] = row;
    if (!/^RISK-[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(riskId)) {
      result.error(`${filePath}: product risk row ${index + 1} has invalid RISK-* ID '${riskId}'`);
    } else if (ids.has(riskId)) {
      result.error(`${filePath}: product risks contain duplicate ID ${riskId}`);
    } else {
      ids.add(riskId);
    }
    for (const [columnName, value] of [["Risk", risk], ["Rationale", rationale], ["Product impact", productImpact], ["Watch/response", watchResponse]]) {
      if (!value) result.error(`${filePath}: product risk row ${index + 1} must provide '${columnName}'`);
    }
    const probabilityValue = RISK_LEVELS.get(probability.toLowerCase());
    const impactValue = RISK_LEVELS.get(impact.toLowerCase());
    if (!probabilityValue) result.error(`${filePath}: product risk row ${index + 1} probability must be Low, Medium, or High`);
    if (!impactValue) result.error(`${filePath}: product risk row ${index + 1} impact must be Low, Medium, or High`);
    if (probabilityValue && impactValue) {
      if (impactValue > previousImpact || (impactValue === previousImpact && probabilityValue > previousProbability)) {
        result.error(`${filePath}: product risks must be ordered by higher impact first, then higher probability`);
      }
      previousImpact = impactValue;
      previousProbability = probabilityValue;
    }
  }
}

function validateProductArtifact(coreDir, result) {
  const filePath = path.join(coreDir, PRODUCT_FILE);
  if (!isFile(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");

  let previousIndex = -1;
  for (const heading of PRODUCT_SECTIONS) {
    const index = headingIndex(content, heading);
    if (index < 0) {
      result.error(`${filePath}: missing required section '## ${heading}'`);
    } else if (index < previousIndex) {
      result.error(`${filePath}: section '## ${heading}' is out of contract order`);
    } else {
      previousIndex = index;
    }
  }
  for (const heading of PRODUCT_FORBIDDEN_SECTIONS) {
    if (headingIndex(content, heading) >= 0) result.error(`${filePath}: product artifacts must not contain a '## ${heading}' reasoning-log section`);
  }

  validatePurpose(content, filePath, result);
  validateTargetUsers(content, filePath, result);
  validateProductEpics(content, filePath, result);
  validateNumberedProductEntries(content, "Scope boundaries", "BOUNDARY", filePath, result);
  validateNumberedProductEntries(content, "Product dependencies", "DEPENDENCY", filePath, result, true);
  validateProductRisks(content, filePath, result);

  const assumptions = sectionContent(content, "Unresolved assumptions");
  if (assumptions !== null) {
    validateNumberedProductEntries(content, "Unresolved assumptions", "ASSUMPTION", filePath, result);
    const entries = numberedEntries(assumptions);
    for (const entry of entries) {
      if (!/\b(?:blocking|non-blocking)\b/i.test(entry[2])) {
        result.error(`${filePath}: unresolved assumption item ${entry[1]} must be classified as blocking or non-blocking`);
      }
    }
    const status = /^-\s+\*\*Status\*\*:\s*(\S+)/im.exec(content)?.[1]?.toLowerCase();
    if (status === "ready" && entries.some((entry) => /\bblocking\b/i.test(entry[2]) && !/\bnon-blocking\b/i.test(entry[2]))) {
      result.error(`${filePath}: status cannot be ready while a blocking product assumption remains`);
    }
  }
}

function validateRequiredTable(content, heading, headers, filePath, result) {
  const section = sectionContent(content, heading);
  if (section === null) return { rows: [] };
  const table = parseMarkdownTable(section, headers);
  if (!table.headerFound) {
    result.error(`${filePath}: '${heading}' must contain a table with columns ${headers.join(", ")}`);
    return { rows: [] };
  }
  if (!table.separatorValid) {
    result.error(`${filePath}: '${heading}' table is missing a valid ${headers.length}-column separator row`);
  }
  if (table.rows.length === 0) {
    result.error(`${filePath}: '${heading}' table must contain at least one row`);
  }
  return table;
}

function validateDomainArtifact(coreDir, result) {
  const filePath = path.join(coreDir, DOMAIN_FILE);
  if (!isFile(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");

  let previousIndex = -1;
  for (const heading of DOMAIN_SECTIONS) {
    const index = headingIndex(content, heading);
    if (index < 0) {
      result.error(`${filePath}: missing required section '## ${heading}'`);
    } else if (index < previousIndex) {
      result.error(`${filePath}: section '## ${heading}' is out of contract order`);
    } else {
      previousIndex = index;
    }
  }

  validateRequiredTable(content, "Core concepts and entities", ["Concept", "Type", "Meaning", "Why it matters"], filePath, result);

  const relationships = validateRequiredTable(content, "Relationships", ["Relationship ID", "From", "Relationship", "To", "Cardinality", "Meaning"], filePath, result);
  const relationshipIds = new Set();
  for (const [index, row] of relationships.rows.entries()) {
    const relationshipId = row[0];
    if (!/^REL-[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(relationshipId)) {
      result.error(`${filePath}: relationship row ${index + 1} has invalid REL-* ID '${relationshipId}'`);
    } else if (relationshipIds.has(relationshipId)) {
      result.error(`${filePath}: relationships contain duplicate ID ${relationshipId}`);
    } else {
      relationshipIds.add(relationshipId);
    }
  }

  validateRequiredTable(content, "Domain events", ["Event", "Source", "When it occurs", "Meaning", "External contract"], filePath, result);

  const rules = validateRequiredTable(content, "Core rules and constraints", ["Rule ID", "Applies to", "Rule", "Rationale"], filePath, result);
  const ruleIds = new Set();
  for (const [index, row] of rules.rows.entries()) {
    const [ruleId, appliesTo, rule, rationale] = row;
    if (!/^RULE-[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(ruleId)) {
      result.error(`${filePath}: rule row ${index + 1} has invalid RULE-* ID '${ruleId}'`);
    } else if (ruleIds.has(ruleId)) {
      result.error(`${filePath}: rules contain duplicate ID ${ruleId}`);
    } else {
      ruleIds.add(ruleId);
    }
    if (!appliesTo || !rule || !rationale) result.error(`${filePath}: rule row ${index + 1} must provide Applies to, Rule, and Rationale`);
  }

  const uncertainties = validateRequiredTable(content, "Assumptions and open questions", ["ID", "Type", "Importance", "Applies to", "Current position", "Why it matters", "Resolution path"], filePath, result);
  const uncertaintyIds = new Set();
  for (const [index, row] of uncertainties.rows.entries()) {
    const [id, type, importance] = row;
    if (!/^(ASSUMPTION|QUESTION)-[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(id)) {
      result.error(`${filePath}: uncertainty row ${index + 1} has invalid ASSUMPTION-* or QUESTION-* ID '${id}'`);
    } else if (uncertaintyIds.has(id)) {
      result.error(`${filePath}: assumptions and open questions contain duplicate ID ${id}`);
    } else {
      uncertaintyIds.add(id);
    }
    if (!/^(Assumption|Question)$/i.test(type)) result.error(`${filePath}: uncertainty row ${index + 1} Type must be Assumption or Question`);
    if (!/^(Blocking|High|Medium|Low)$/i.test(importance)) result.error(`${filePath}: uncertainty row ${index + 1} Importance must be Blocking, High, Medium, or Low`);
  }

  const stopConditions = validateRequiredTable(content, "Generation stop conditions", ["Condition", "Status", "Why it stops generation", "Current assessment"], filePath, result);
  const hasBlockedStop = stopConditions.rows.some((row, index) => {
    const status = row[1];
    if (!/^(Clear|Blocked)$/i.test(status)) {
      result.error(`${filePath}: generation stop condition row ${index + 1} Status must be Clear or Blocked`);
      return false;
    }
    return /^Blocked$/i.test(status);
  });
  const artifactStatus = /^-\s+\*\*Status\*\*:\s*(\S+)/im.exec(content)?.[1]?.toLowerCase();
  if (hasBlockedStop && artifactStatus !== "blocked") {
    result.error(`${filePath}: artifact status must be blocked when any generation stop condition is Blocked`);
  }
}

function validateTraceability(root, result) {
  const filePath = path.join(root, TRACEABILITY_FILE);
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
  const required = new Set(["01-request.md", STATUS_FILE]);
  const rank = ACTIVE_SEQUENCE.get(state);
  if (rank === undefined) return required;
  if (rank >= 2) {
    required.add("02-classification.md");
    required.add("03-impact-analysis.md");
    if (profile === "feature" || profile === "initiative") {
      required.add("04-specification.md");
      required.add("05-technical-design.md");
      required.add("06-test-plan.md");
    }
  }
  if (rank >= 3) required.add("07-implementation-plan.md");
  if (rank >= 4) required.add("09-execution-log.md");
  if (rank >= 6) required.add("10-validation-report.md");
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
  const statusPath = path.join(changeDir, STATUS_FILE);
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
  const sourcePrefix = `${CHANGES_DIRECTORY}/${directoryName}/01-request.md`;
  const requirements = [...nodes.entries()]
    .filter(([, node]) => node.type === "requirement" && String(node.source ?? "").replaceAll("\\", "/").startsWith(sourcePrefix))
    .map(([nodeId]) => nodeId);
  if (requirements.length === 0) result.error(`${changeDir}: accepted change has no requirement nodes sourced from 01-request.md`);
  for (const requirementId of requirements) {
    if (!requirementReachesEvidence(requirementId, nodes, edges)) result.error(`${changeDir}: accepted requirement ${requirementId} has no traceability path to evidence`);
  }
}

function validateBlueprint(root, selectedChange = null) {
  const result = new ValidationResult();
  if (!isDirectory(root)) { result.error(`Blueprint directory does not exist: ${root}`); return result; }
  const manifestPath = path.join(root, MANIFEST_FILE);
  const manifest = loadJson(manifestPath, result);
  if (!manifest) return result;
  requireFields(manifest, ["schema_version", "project_slug", "core_version", "lifecycle_status", "updated_at"], manifestPath, result);
  if (manifest.schema_version !== 2) result.error(`${manifestPath}: schema_version must be 2`);
  if (!Number.isInteger(manifest.core_version) || manifest.core_version < 1) result.error(`${manifestPath}: core_version must be a positive integer`);

  const coreDir = path.join(root, CORE_DIRECTORY);
  for (const filename of CORE_FILES) if (!isFile(path.join(coreDir, filename))) result.error(`Missing core artifact: ${path.join(coreDir, filename)}`);
  validateProductArtifact(coreDir, result);
  validateDomainArtifact(coreDir, result);
  if (!isDirectory(path.join(coreDir, DECISIONS_DIRECTORY))) result.error(`Missing ADR directory: ${path.join(coreDir, DECISIONS_DIRECTORY)}`);
  const { nodes, edges } = validateTraceability(root, result);
  const changesDir = path.join(root, CHANGES_DIRECTORY);
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
    const coreDir = path.join(root, CORE_DIRECTORY);
    const changeDir = path.join(root, CHANGES_DIRECTORY, "CHANGE-DEMO-001");
    fs.mkdirSync(path.join(coreDir, DECISIONS_DIRECTORY), { recursive: true });
    fs.mkdirSync(changeDir, { recursive: true });
    const productContent = `# Product

- **Artifact ID**: CORE-PRODUCT-DEMO
- **Version**: 1
- **Status**: ready
- **Core Version**: 1
- **Last Updated**: 2026-01-01
- **Source References**: demo

## Purpose

**Problem being solved**: Workflow authors need a deterministic way to detect structurally incomplete blueprints before they are used.

**Product purpose**: Demonstrate that the validator accepts a complete product artifact and rejects contract violations.

## Target users

| Persona | Description | Key needs | Pain points |
|:---|:---|:---|:---|
| Workflow author | Maintains blueprint workflows and contracts. | Fast structural feedback. | Manual review misses inconsistent artifact structures. |

## Outcomes

- A valid blueprint passes structural validation.

## Product epics

1. **EPIC-DEMO-001 — Validate a blueprint**
   - **Description**: A workflow author runs validation against a blueprint and receives a deterministic structural result.
   - **Sample user stories**:
     - **Sample:** As a workflow author, I want invalid product structures reported, so that I can correct them before handoff.

## Scope boundaries

1. **BOUNDARY-DEMO-001**: The demonstration does not validate an application implementation.

## Product dependencies

1. **DEPENDENCY-DEMO-001**: No external product dependencies are established for this structural validation demo.

## Product risks

| Risk ID | Risk | Probability | Impact | Rationale | Product impact | Watch/response |
|:---|:---|:---|:---|:---|:---|:---|
| RISK-DEMO-001 | Invalid fixture coverage | Low | Medium | The validator relies on representative fixtures to exercise structural rules. | Validator regressions could pass unnoticed. | Add fixture cases when product artifact contracts change. |
`;
    const domainContent = `# Domain

- **Artifact ID**: CORE-DOMAIN-DEMO
- **Version**: 1
- **Status**: ready
- **Core Version**: 1
- **Last Updated**: 2026-01-01
- **Source References**: demo

## Purpose

This artifact demonstrates the domain structure expected by the validator.

## Core concepts and entities

| Concept | Type | Meaning | Why it matters |
|:---|:---|:---|:---|
| Blueprint | Entity | A package of lifecycle artifacts. | It is the thing being validated. |
| Workflow author | Actor | A maintainer of workflow artifacts. | This actor interprets validation output. |

## Out-of-scope domain concepts

- Runtime application behavior is not a domain concept for this validator fixture.

## Relationships

| Relationship ID | From | Relationship | To | Cardinality | Meaning |
|:---|:---|:---|:---|:---|:---|
| REL-DEMO-001 | Workflow author | validates | Blueprint | many-to-many | Authors can validate multiple blueprints, and blueprints can be validated by multiple authors. |

## States and transitions

### Blueprint validation

\`\`\`text
unchecked -> valid
unchecked -> invalid
\`\`\`

- \`unchecked\`: Validation has not run.
- \`valid\`: Required structural checks passed.
- \`invalid\`: Required structural checks failed.

## Domain events

| Event | Source | When it occurs | Meaning | External contract |
|:---|:---|:---|:---|:---|
| BlueprintValidated | Validator | A validation run completes. | The blueprint has a structural result. | No |

## Core rules and constraints

| Rule ID | Applies to | Rule | Rationale |
|:---|:---|:---|:---|
| RULE-DEMO-001 | Blueprint | A blueprint must contain required core files. | Missing core files make downstream interpretation unreliable. |

## Ownership, authority, and boundaries

- The validator has authority to report structural errors.
- The workflow author has authority to revise artifacts.

## Assumptions and open questions

| ID | Type | Importance | Applies to | Current position | Why it matters | Resolution path |
|:---|:---|:---|:---|:---|:---|:---|
| ASSUMPTION-DEMO-001 | Assumption | Low | Blueprint | The fixture is intentionally small. | It keeps the self-test focused. | Revise when validator coverage expands. |
| QUESTION-DEMO-001 | Question | Low | Validator | No open blocking question is present. | Demonstrates the unified uncertainty table. | Replace if a real fixture question appears. |

## Generation stop conditions

| Condition | Status | Why it stops generation | Current assessment |
|:---|:---|:---|:---|
| Missing domain authority model | Clear | Authority gaps can invalidate domain rules. | The fixture has a minimal authority model. |
`;
    fs.writeFileSync(path.join(coreDir, PRODUCT_FILE), productContent, "utf8");
    fs.writeFileSync(path.join(coreDir, DOMAIN_FILE), domainContent, "utf8");
    for (const filename of CORE_FILES.filter((name) => name !== PRODUCT_FILE && name !== DOMAIN_FILE)) fs.writeFileSync(path.join(coreDir, filename), `# ${filename}\n`, "utf8");
    writeJson(path.join(root, MANIFEST_FILE), { schema_version: 2, project_slug: "demo", core_version: 1, lifecycle_status: "active", updated_at: "2026-01-01" });
    for (const filename of ["01-request.md", "02-classification.md", "03-impact-analysis.md", "07-implementation-plan.md", "09-execution-log.md", "10-validation-report.md"]) {
      fs.writeFileSync(path.join(changeDir, filename), `# ${filename}\n`, "utf8");
    }
    writeJson(path.join(changeDir, STATUS_FILE), { schema_version: 2, change_id: "CHANGE-DEMO-001", profile: "patch", state: "accepted", core_version: 1, updated_at: "2026-01-01", blocking_decisions: [] });
    const nodes = [
      ["REQ-DEMO-001", "requirement", "02-changes/CHANGE-DEMO-001/01-request.md"],
      ["TASK-DEMO-001", "task", "02-changes/CHANGE-DEMO-001/07-implementation-plan.md"],
      ["CODE-DEMO-001", "code", "src/demo.js"],
      ["TEST-DEMO-001", "test", "tests/demo.test.js"],
      ["EVIDENCE-DEMO-001", "evidence", "02-changes/CHANGE-DEMO-001/10-validation-report.md"],
    ].map(([id, type, source]) => ({ id, type, title: id, status: "active", source }));
    const edges = [
      ["REQ-DEMO-001", "TASK-DEMO-001", "implemented_by"],
      ["TASK-DEMO-001", "CODE-DEMO-001", "produces"],
      ["CODE-DEMO-001", "TEST-DEMO-001", "verified_by"],
      ["TEST-DEMO-001", "EVIDENCE-DEMO-001", "produces"],
    ].map(([from, to, type]) => ({ from, to, type }));
    writeJson(path.join(root, TRACEABILITY_FILE), { schema_version: 2, nodes, edges });

    const valid = validateBlueprint(root);
    if (valid.errors.length > 0) {
      console.error("Self-test expected valid blueprint but found:");
      valid.errors.forEach((error) => console.error(`  ERROR: ${error}`));
      return false;
    }
    fs.writeFileSync(path.join(coreDir, PRODUCT_FILE), productContent.replace("| Persona | Description | Key needs | Pain points |", "| User | Description | Needs | Problems |"), "utf8");
    if (!validateBlueprint(root).errors.some((error) => error.includes("table with columns Persona"))) {
      console.error("Self-test expected target-user table detection");
      return false;
    }
    fs.writeFileSync(path.join(coreDir, PRODUCT_FILE), productContent.replace("**Sample:**", ""), "utf8");
    if (!validateBlueprint(root).errors.some((error) => error.includes("explicitly prefixed 'Sample:'"))) {
      console.error("Self-test expected sample-story label detection");
      return false;
    }
    fs.writeFileSync(path.join(coreDir, PRODUCT_FILE), `${productContent}\n## Facts\n\nUnexpected reasoning log.\n`, "utf8");
    if (!validateBlueprint(root).errors.some((error) => error.includes("must not contain a '## Facts'"))) {
      console.error("Self-test expected forbidden product-section detection");
      return false;
    }
    fs.writeFileSync(path.join(coreDir, PRODUCT_FILE), productContent.replace("| RISK-DEMO-001 | Invalid fixture coverage | Low | Medium |", "| RISK-DEMO-001 | Invalid fixture coverage | Certain | Medium |"), "utf8");
    if (!validateBlueprint(root).errors.some((error) => error.includes("probability must be Low, Medium, or High"))) {
      console.error("Self-test expected product-risk probability detection");
      return false;
    }
    fs.writeFileSync(path.join(coreDir, PRODUCT_FILE), productContent, "utf8");
    fs.writeFileSync(path.join(coreDir, DOMAIN_FILE), domainContent.replace("| Concept | Type | Meaning | Why it matters |", "| Concept | Meaning | Why it matters |"), "utf8");
    if (!validateBlueprint(root).errors.some((error) => error.includes("'Core concepts and entities' must contain a table"))) {
      console.error("Self-test expected domain concept table detection");
      return false;
    }
    fs.writeFileSync(path.join(coreDir, DOMAIN_FILE), domainContent.replace("| Missing domain authority model | Clear |", "| Missing domain authority model | Blocked |"), "utf8");
    if (!validateBlueprint(root).errors.some((error) => error.includes("artifact status must be blocked"))) {
      console.error("Self-test expected blocked stop-condition status detection");
      return false;
    }
    fs.writeFileSync(path.join(coreDir, DOMAIN_FILE), domainContent, "utf8");
    const traceabilityPath = path.join(root, TRACEABILITY_FILE);
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
