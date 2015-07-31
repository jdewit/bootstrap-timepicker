# Changelog
All notable changes will be documented in this file.
This project does not currently conform to Semantic Versioning.

## [Unreleased][unreleased]

## [0.5] - 2015-07-31
### Changed
- Bootstrap 3 support. No more Bootstrap 2 support.
- setTime sets time better
- more tests, and they exercise Bootstrap 3 support!
- snapToStep is a new option, off by default, which snaps times
  to the nearest step or overflows to 0 if it would otherwise snap to 60 or more.
- explicitMode is a new option, off by default, which lets you leave out
  colons when typing times.
- shift+tab now correctly moves the cursor to the previously highlighted unit, and
  blurs the timepicker when expected.
- We have cut out significant amounts of old cruft from the repository.
- Minified/Uglified code is no longer kept in the repo. Please download a release tarball
  or zip file to get the compiled and minified CSS and Javascript files.
