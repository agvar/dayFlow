# Changelog
## [Unreleased]
### Added
- Added loading indicator for database operations
- Implemented error handling components for better user feedback

### Changed
- Improved database initialization process
- Enhanced state management for better data consistency
- Implemented debounce utility for optimizing performance-critical operations

### Fixed
- Resolved blank screen issue by using current date instead of memoized value

## [1.0.0] - 2024-01-20
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
- Fixed null values in database query for activity hours.