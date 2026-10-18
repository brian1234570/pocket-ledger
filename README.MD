# pocket ledger: STUDENT FINANCE TRACKER

A responsive, accessible finance tracker for students, built with plain HTML, CSS and JavaScript (no frameworks).

**Theme:** Student Finance Tracker
**Live site:**https://brian1234570.github.io/pocket-ledger/
**Demo video:** (https://youtu.be/RdTyjvFpDIY?si=AddoEHMsP2FeJB-w)
**Contact:**[GitHub](https://github.com/brian1234570) · b.ntwali@alustudent.com

## Features
Dashboard: record count, total spent, top category, last -7-days bar chart

Spending cap with live messages (polite when under, assertive when over)

Records table with sorting (date, description, amount) and live regex search with  `<mark>` highlighting

Add/Edit form with inline regex validation errors
Delete with confirmation

Settings: spending cap and manual EUR and RWF rates (totals shown in all three)

Auto-save to localstorage, json export, and json import with validation

Responsive layout (mobile-first, breakpoints at 768px and 1024px) with a fade-in transition on sections

## Regex catalog 
| Field | Pattern | Example |
|---|---|---|
| Description | `^\S(?:.*\S)?$` | "Lunch" passes, " Lunch" fails |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | "12.50" passes, "012" fails |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | "2025-09-29" passes, "2025-13-01" fails |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | "Food" passes, "Food2" fails |
| Duplicate word (advanced, back-reference) | `\b(\w+)\s+\1\b` | "the the" is rejected |

Search accepts any regex (for example `(coffee\|tea)` or `\.\d{2}\b`). Invalid patterns show a message instead of crashing, because the pattern is compiled inside a try/catch.

## Keyboard map
 Key | Action |
|---|---|
| Tab / Shift+Tab | Move between links, fields and buttons |
| Tab (first press) | Reveals the "Skip to content" link |
| Enter | Follow a nav link, submit a form, press a button |
| Space | Toggle the "Ignore case" checkbox |
| Arrow keys | Change the sort option when the dropdown is focused |

## Accessibility notes
Landmarks: header, nav, main, section and footer, with a proper heading order
Skip-to-content link and visible focus outlines
Every input has a label, and errors use `aria-invalid` and `aria-describedby`
Status message use `role="status"` and `role="alert"` live regions
Animation is disables for users who prefer  reduced motion
Table has a caption and column headers with `scope`

## Run locally
Open the folder in vs code and use the live server extension (right-click `index.html`, then Open with Live Server). Opening the file directly will not work, because ES modules and `fetch` need a server.

## Testing
Manual checks:
Add a transaction, refresh, and confirm it persists
Enter "the the" as a description and confirm the duplicate-word error
Search `(coffee|tea)` and confirm highlighting, then type `(` and confirm "Invalid pattern"
Export json, delete everything, then import it back
Import a malformed file and confirm the error message 

## known liminations
Edit loads the row into the form (not inline in the table)
No `tests.html` yet
