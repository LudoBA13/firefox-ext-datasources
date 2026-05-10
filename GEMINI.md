# Project: firefox-ext-datasources

This browser extension gathers data from various sources (CSV/Excel) and synchronizes them with Google Sheets.

## Workflow
1.  **Research:** Analyze the target website's data export mechanism.
2.  **Implementation:** Create content scripts and background services to intercept or trigger exports.
3.  **Storage:** Use `chrome.storage` for local caching and the Google Sheets API for synchronization.
4.  **Validation:** Verify data integrity through automated tests.

## Coding Conventions
- **Language:** JavaScript.
- **Styling:** Allman style, tabs for indentation.
- **Quotes:** Single quotes for string literals (no escape sequences).
- **Declaration:** `const` or `let`.
