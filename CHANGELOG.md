# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
