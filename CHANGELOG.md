# Changelog
## [Unreleased] - 2024-01-20
### Added
- Implemented SQLite database for persistent storage
- Added foreign key relationships between days, sleep_times, and activities tables
- Created DaySelector component for date navigation
- Added CHANGELOG.md file for tracking changes
### Changed
- Refactored state management to use single source of truth
- Updated activity tracking to use database storage
### Fixed
- Resolved undefined activities error with null checking
- Fixed date formatting issues in database queries