# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.0] - 2026-06-07

### Added
- **Adversarial QA Pipeline**: Generative functions (\`generate_remedial_level\` and \`generate_remedial_unit\`) now utilize an internal self-evaluating QA loop before serving AI content. The QA agent aggressively enforces content/test parity, exact-match naming uniqueness, and randomized exercise styles.
- **Multiple Choice Exercises**: Introduced a new pedagogical testing format: \`multiple_choice\`. The frontend will automatically route the UI rendering based on the data schema.
- **Graceful Loading UX**: Overhauled the frontend loading states to directly communicate to the user when a completely new bespoke lesson is being generated.

### Fixed
- **Curriculum Alignment**: Rewrote \`UNIT_2_ADVANCED_SCHEMAS\` lesson text to comprehensively define Highly Normalized vs Denormalized datasets, fixing a previously disjointed exercise.

## [0.9.3] - 2026-06-07

### Fixed
- **Legacy State Migration**: Added a self-healing mechanism to \`UnitViewer.tsx\` hydration to automatically upgrade user state profiles that completed units prior to the \`v0.9.1\` update, guaranteeing Unit 2 accurately unlocks for early testers.
- **Mobile UI**: Fixed a responsive CSS bug that hid the Telemetry Dashboard button on smaller browser windows.

## [0.9.2] - 2026-06-07

### Fixed
- **TypeScript Build Error**: Resolved a strict compilation error caught in the CI/CD pipeline caused by a missing \`Progress\` import and an unused \`updateDoc\` variable. 
- **DevOps**: Installed \`husky\` to enforce a pre-commit hook that automatically runs \`npm run build\` locally, preventing CI/CD failures from being pushed to production.

## [0.9.1] - 2026-06-07

### Fixed
- **Dashboard Unlock UX**: Fixed an issue where completing a unit caused a hard reload without unlocking subsequent units. The application now properly tracks \`completedUnitIds\` in Firestore and seamlessly unlocks the next chronological unit on the dashboard.
- **Syllabus Expansion**: Added \`UNIT_2_ADVANCED_SCHEMAS\` to allow testing of the progression flow.

## [0.9.0] - 2026-06-07

### Added
- **Persistent User State**: Students' active lesson, unit, and exact failure thresholds are now continuously synchronized with Firestore (\`users/{uid}\`), allowing them to resume exactly where they left off across sessions.
- **Telemetry Dashboard**: Added a real-time administrative dashboard tracking global conceptual bottlenecks by aggregating failure events into a Firestore \`telemetry_failures\` collection.

## [0.8.2] - 2026-06-07

### Added
- **Meta Development Log**: Published \`META_DEVELOPMENT.md\` to formalize the high-level software engineering paradigms and roadmap strategies for the platform.

## [0.8.1] - 2026-06-07

### Changed
- **Rebranding**: Updated app title and headers from "DataEng Academy" to "notZekeAcademy".
- **Dynamic Dashboard**: Refactored the dashboard UI to dynamically render the \`Track > Course > Unit\` curriculum structure directly from the syllabus configuration.

## [0.8.0] - 2026-06-07

### Added
- **Multi-Tiered Evaluation**: Built multi-level state tracking (Exercise vs Unit) to record student failures over time.
- **Hierarchical AI Intervention**:
  - *Exercise Failure (1 fail)*: Triggers Socratic hint generation.
  - *Lesson Failure (3 fails)*: Triggers generation of a completely novel remedial lesson.
  - *Unit Failure (5 cumulative fails)*: Triggers generation of a macro-level unit review lesson.
- **Backend Remediation Endpoint**: Implemented `generate_remedial_unit` Cloud Function to handle unit-level pedagogical breakdowns.

## [0.7.0] - 2026-06-07

### Added
- **Syllabus Hierarchy Architecture**: Overhauled curriculum schema from flat levels to a nested `Track > Course > Unit > Lesson > Exercise` structure.
- **Workflow & Versioning**: Established `CHANGELOG.md` rule and GitHub Actions release workflow.
- **Pedagogy Flow**: Integrated pedagogical HTML sections natively into the interactive levels.
- **Next Lesson UI Flow**: Replaced isolated sandbox states with continuous lesson navigation within a Unit.

### Changed
- `LevelConfig` interface refactored into distinct `Lesson` and `Unit` types.
- `Level1.tsx` refactored into `UnitViewer.tsx` to handle array iteration of lessons within a unit.
- Package version bumped to `0.7.0` to reflect Beta staging status.

### Removed
- The isolated "sandbox" routing in favor of linear `Unit` progression.
