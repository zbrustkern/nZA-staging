# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
