# HoMM3-Inspired Battle Game Domain Blueprint

- **Artifact ID**: CORE-HOMM3-BATTLE-02-DOMAIN
- **Version**: 1
- **Status**: ready
- **Core Version**: 1
- **Last Updated**: 2026-06-27
- **Source References**: requirements/homm3-battle-only/requirements.md

## Purpose

This artifact defines the shared language and durable rules for the battle-only tactical game domain. Future requirements, designs, implementation tasks, tests, and validation should use these concepts and rules unless a later accepted change updates the core blueprint.

The domain blueprint exists to prevent future work from silently inventing unsupported product behavior. It separates established context, project decisions, reversible assumptions, and unresolved questions so AI agents do not treat guesses as requirements.

## Established context

- The product is a browser-based, turn-based tactical battle game inspired by the battle experience of Heroes of Might and Magic III.
- The product focuses only on individual battles between two prepared armies.
- A player prepares two armies, controls one army, and fights against a computer-controlled opponent.
- Battles take place on a hex-based battlefield.
- Armies use human, non-magical units such as militia, pikemen, swordsmen, archers, crossbowmen, and cavalry.
- Different unit types have different statistics and tactical strengths.
- Units can move, attack in melee, attack at range where appropriate, wait, defend, and use simple physical abilities.
- Positioning, turn order, obstacles, retaliation, damage, and casualties affect battle outcomes.
- The interface must show the battlefield, armies, current turn, available actions, important unit information, and battle results.
- Battles run locally in the browser.
- The same setup and random seed should reproduce the same battle behavior for testing and debugging.

## Out-of-scope domain concepts

- Campaigns, world maps, adventure maps, scenario progression, and strategic exploration are not part of the domain.
- Town management, economy management, resource production, and recruitment infrastructure are not part of the domain.
- Heroes, hero progression, hero skills, artifacts, magic, spells, supernatural units, and fantasy creature rosters are not part of the domain.
- Multiplayer, matchmaking, accounts, backend services, online persistence, chat, and remote saves are not part of the domain.
- Copied artwork, copied text, protected Heroes of Might and Magic unit identities, exact cloned mechanics, and compatibility with Heroes of Might and Magic III are not part of the domain.

## Core concepts

| Concept | Meaning | Why it matters |
|:---|:---|:---|
| Battle | One self-contained tactical encounter between two armies on a hex battlefield. | This is the top-level playable unit; the product does not model a larger campaign lifecycle. |
| Army | A group of unit stacks assigned to one side before battle starts. | Army composition defines the matchup and must be reproducible. |
| Side | One participant in a battle. | Sides separate ownership, victory conditions, and control. |
| Controller | The actor that chooses actions for a side: the human player or local computer opponent. | Control authority must be explicit so future work does not invent multiplayer or backend control. |
| Unit type | A reusable definition for a category of human, non-magical combatant. | Unit types define statistics, allowed attacks, movement, and tactical role. |
| Unit stack | A battlefield group of one unit type that acts as a single tactical piece. | Runtime combat state belongs to stacks, not to abstract unit types. |
| Battlefield | The hex grid and its battle-specific contents. | Movement, positioning, obstacles, targeting, and occupancy depend on it. |
| Hex | One addressable battlefield cell. | Legal movement, placement, attack range, and occupancy are resolved through hexes. |
| Obstacle | A battlefield feature that constrains movement, targeting, or positioning. | Obstacles make positioning meaningful and must be handled by movement and attack rules. |
| Turn order | The sequence that determines which unit stack can act next. | Turn order affects timing, wait behavior, defend behavior, and tactical initiative. |
| Action | A legal choice made for the active unit stack. | Actions are the visible decisions available to the player and AI. |
| Retaliation | A counterattack triggered by eligible melee combat. | Retaliation changes attack risk and casualty outcomes. |
| Damage | Harm applied to a unit stack after combat resolution. | Damage drives casualties and defeat. |
| Casualty | A reduction in the living members represented by a unit stack. | Casualties change combat strength and determine when stacks are defeated. |
| Random seed | A reproducibility input used by random-dependent battle logic. | Seeded behavior supports repeatable testing and debugging. |

## Core rules and constraints

1. `RULE-HOMM3-BATTLE-001` - A battle has exactly two opposing sides.
2. `RULE-HOMM3-BATTLE-002` - Each side has exactly one army during a battle.
3. `RULE-HOMM3-BATTLE-003` - Each side has exactly one controller during a battle: human player or local computer opponent.
4. `RULE-HOMM3-BATTLE-004` - A unit stack belongs to exactly one side.
5. `RULE-HOMM3-BATTLE-005` - A hex cannot contain more than one unit stack at the same time.
6. `RULE-HOMM3-BATTLE-006` - A unit stack can perform only actions legal for its unit type, current state, battlefield position, and battle phase.
7. `RULE-HOMM3-BATTLE-007` - Ranged attacks are legal only for unit types and battlefield conditions that allow ranged combat.
8. `RULE-HOMM3-BATTLE-008` - Melee attacks can trigger retaliation only when the defender is eligible under the active combat rules.
9. `RULE-HOMM3-BATTLE-009` - Damage and casualties cannot reduce a unit stack below zero living members.
10. `RULE-HOMM3-BATTLE-010` - A defeated unit stack cannot act, occupy a hex, retaliate, defend, wait, or be selected as the active unit.
11. `RULE-HOMM3-BATTLE-011` - A battle ends when one side has no remaining non-defeated unit stacks.
12. `RULE-HOMM3-BATTLE-012` - Given the same battle setup, rules version, and random seed, battle behavior must be reproducible.
13. `RULE-HOMM3-BATTLE-013` - Domain content must remain original, human, and non-magical unless a later accepted product decision changes the scope boundary.

## States and lifecycles

### Battle

```text
configured -> deploying -> active -> resolved
```

- `configured`: Armies, battlefield configuration, and random seed are selected, but battle play has not started.
- `deploying`: Initial unit positions are being established if deployment is modeled separately.
- `active`: Unit stacks are taking turns and resolving actions.
- `resolved`: A final battle result has been produced.

### Unit stack

```text
ready -> active -> acted
ready -> waiting -> active -> acted
ready -> defending -> ready
ready|active|waiting|defending|acted -> defeated
```

- `ready`: Eligible to receive a future turn.
- `active`: Currently selected to act.
- `waiting`: Delayed action state if waiting is available.
- `defending`: Defensive state selected for the current turn or round.
- `acted`: Completed its action for the current turn-order cycle.
- `defeated`: No living members remain.

## Ownership and authority

- The human player has authority to prepare both armies before battle, within the allowed roster and setup rules.
- The human player has action-selection authority for the player-controlled side during battle.
- The local computer opponent has action-selection authority for the opposing side during battle.
- The battle rules have authority to validate actions, apply movement, resolve attacks, apply retaliation, calculate damage, apply casualties, and determine battle end.
- The battle owns all runtime combat state, including current turn, battlefield occupancy, stack state, random state, and final result.
- Unit type definitions own static combat characteristics; unit stacks own battle-specific state such as position, living count, current status, and retaliation eligibility.
- The battlefield owns hex layout, obstacle placement, and occupancy constraints.
- No backend, account, remote service, multiplayer participant, campaign system, hero system, or economy system has domain authority in the current product boundary.

## Domain events

Externally required domain events are not established yet because the product runs locally without backend services, accounts, multiplayer, or online persistence.

The following internal events are useful candidate events for implementation, testing, and debugging, but they are not yet external contracts:

- `BattleStarted`
- `TurnStarted`
- `ActionSelected`
- `UnitMoved`
- `AttackResolved`
- `RetaliationResolved`
- `CasualtiesApplied`
- `UnitDefeated`
- `BattleResolved`

## Decisions

1. Domain terminology will describe an original game rather than an exact Heroes of Might and Magic III clone.
2. Battle-only scope is a governing domain boundary. Campaign, town, hero, magic, artifact, multiplayer, backend, account, and online-persistence concepts must not be introduced without an accepted product change.
3. Deterministic setup and seeded randomness are core domain concerns because reproducibility is required for testing and debugging.
4. Runtime battle state belongs to the battle, not to pre-battle setup artifacts.

## Assumptions

1. Non-blocking: The listed unit examples are candidate roster types, not a final exhaustive roster. This is safe because the initial release plan can select a smaller or adjusted original roster before implementation.
2. Non-blocking: "Simple physical abilities" means mundane battlefield actions, not magic, supernatural effects, or hero powers. This is safe because it preserves the explicit non-magical boundary.
3. Non-blocking: A fixed random seed is sufficient for reproducibility when combined with the same rules version and battle setup. This must be revisited during technical design if any browser behavior or timing dependency affects deterministic outcomes.
4. Non-blocking: The initial battle can use a constrained setup flow before supporting deeper customization. This must be revisited during initial release planning.

## Open questions

1. Non-blocking: What exact unit statistics, stack sizes, movement values, attack values, defense values, health values, range limits, and initiative values should the initial roster use?
2. Non-blocking: What battlefield dimensions and obstacle placement rules should the initial release support?
3. Non-blocking: What original damage formula and retaliation limits should be selected?
4. Non-blocking: What level of tactical quality is required for the initial computer opponent?
5. Non-blocking: Should deployment be an explicit player-controlled phase, or should initial unit placement be selected during army preparation?
