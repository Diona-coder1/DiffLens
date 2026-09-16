# DiffLens

A lightweight, browser-based tool for comparing two versions of
text or code, line by line.

Built with HTML, CSS and JavaScript by Diona Gerxhaliu.

## Live demonstration

https://diona-coder1.github.io/DiffLens/

## Repository

https://github.com/Diona-coder1/DiffLens

## Project purpose

DiffLens rebuilds one feature familiar from GitHub:
a unified, line-by-line view of changes.

It helps users identify additions, removals and unchanged lines
between two pasted versions without setting up a repository
or creating commits.

This is an independent learning project, not an official GitHub product.

## Quick start

### Use the live version

Open the live demonstration link above.

### Run locally

1. Download and extract the repository, or clone it:

git clone https://github.com/Diona-coder1/DiffLens.git

2. Open the project folder.
3. Open index.html in a browser with JavaScript enabled.

No dependencies, package installation or build step are required.

Alternatively, with Python 3 installed, run from the project folder:

python3 -m http.server 8000

Then open:

http://localhost:8000

## How to use

1. Paste text into Original and Updated.
2. Alternatively, press Load example to fill both inputs.
3. Press Compare versions.
4. Read the line-by-line result and summary counts.
5. Use Next change and Previous change to navigate changed lines.
6. Enable Show changed lines only to hide unchanged context.
7. Use Swap versions to reverse the comparison direction.

Load example replaces both inputs.

Editing or swapping inputs hides the previous result so it cannot
be mistaken for a comparison of the updated input.
Press Compare versions again to generate a fresh result.

## Features

- Unified line-by-line comparison.
- Added, removed and unchanged line counts.
- Original and updated line numbers.
- Addition and removal symbols alongside background colors.
- Changed-lines-only filtering.
- Previous and next change navigation with wraparound.
- Keyboard-operable native controls.
- Visible keyboard focus.
- Responsive editor and result layouts.
- Input validation with actionable messages.
- Local processing without uploading the compared text.

## Comparison with the original feature

### Reference

The reference feature is GitHub's unified diff view, where changes
between versions are presented using added, removed and unchanged
lines.

DiffLens rebuilds the core reading interaction rather than GitHub's
repository, pull request or review system.

### Shared behavior

- Added and removed lines are visually distinguished.
- Unchanged lines provide context.
- Line numbers connect changes to the original and updated versions.
- A replacement is represented as removed and added content.

### Improvement for the selected use case

DiffLens provides a direct paste-and-compare workflow for temporary
snippets.

A user can compare two pieces of text without committing them,
uploading files or preparing a repository comparison.
This reduces setup for quick checks during learning and debugging.

This is a workflow improvement for ad hoc snippet comparison,
not a claim that DiffLens replaces GitHub's full diff capabilities.

### Deliberate omissions

| Omitted capability | Reason |
| --- | --- |
| Repository and commit integration | The project focuses on pasted text. |
| Pull requests, comments and reviews | Collaboration is outside the selected feature. |
| Multiple files and directory comparisons | One pair of inputs keeps the interaction focused. |
| Character-level highlighting | The comparison operates on complete lines. |
| Syntax highlighting | The same interface supports code and plain text. |
| Split diff view | A unified view keeps one reading sequence on narrow screens. |
| File uploads | Pasting avoids additional file-handling complexity. |
| Accounts and cloud storage | No account or server is needed for local comparison. |
| Exporting patches | The result is intended for inspection, not applying patches. |

Diff output may differ from GitHub when several equally valid
line alignments exist, particularly with repeated lines.
DiffLens does not attempt to reproduce GitHub's exact algorithm.

## Algorithm and comparison rules

DiffLens uses the Longest Common Subsequence algorithm on complete lines.

A dynamic-programming matrix identifies matching lines in the same
relative order. The result is then constructed from unchanged,
removed and added lines.

For n original lines and m updated lines:

- Time complexity: O(n × m).
- Matrix space complexity: O(n × m).

Each input is limited to 500 lines and 50,000 JavaScript string
code units. The interface describes the latter as characters.
Some Unicode symbols occupy more than one code unit.

The line limit keeps the matrix at most 501 × 501 cells.

### Text behavior

- Spaces, indentation and blank lines are significant.
- CRLF, CR and LF line endings are normalized.
- A trailing newline is significant.
- An empty document has zero lines.
- A blank line is displayed as an italic “[blank line]” marker.
- An edited line appears as a removal plus an addition.
- One empty input represents adding or deleting an entire document.
- Two empty inputs produce a validation message.
- No case folding or whitespace-ignore mode is applied.

## Keyboard operation and accessibility

- A skip link moves to the main content.
- Inputs have explicit labels and shared instructions.
- Tab and Shift+Tab move between native controls.
- Enter or Space activates buttons.
- Space toggles the changed-lines checkbox.
- Tab leaves textareas instead of inserting indentation.
- Previous and Next focus the selected changed line.
- From a focused changed line, Tab returns to Next change.
- Shift+Tab returns to Previous change.
- Pressing Tab again continues through the page.
- Navigation wraps between the first and last changed lines.
- Controls and focused result lines have visible focus indicators.
- Status messages use role="status".
- Screen-reader text identifies change types and line numbers.
- Plus/minus symbols supplement color.
- Navigation and filtering controls are disabled for identical versions.

Screen-reader behavior has not yet been independently verified.
This project does not claim a formal accessibility certification.

## Responsive design

The editors appear side by side on wider screens and stack
vertically on narrow screens.

Result lines wrap long text instead of requiring a wide code panel.
Controls can wrap onto additional rows.

The layout is designed for narrow screens, but an exact 320px
viewport check remains pending.

## Validation and failure handling

### Both inputs are empty

The page explains that at least one input needs text and suggests
loading the example. Focus moves to Original.

### One input is empty

This is a valid comparison, not an error.
All lines on the other side become additions or removals.

### Inputs are identical

The page reports that no changes were found.
Change navigation and filtering are disabled.

### Input exceeds a limit

The page identifies the oversized input, explains the limit and
suggests comparing a smaller section. Input content is retained.

### Unexpected comparison failure

The page displays an error message and suggests a smaller comparison.
The input fields are retained.

The oversized-input and unexpected-failure paths are implemented
but have not been manually verified.

## Privacy and safe rendering

The application code makes no network requests for comparison
and does not execute input text.

User-provided text is inserted with textContent rather than
interpreted as HTML.

DiffLens does not implement local storage, cookies or cloud saving
for input content. Users should keep their own copy before
refreshing or closing the page.

The hosted page itself is served by GitHub Pages.
Local comparison does not mean that the hosting service receives
no normal page-request metadata.

## Verification record

The following checks were performed manually in Safari on macOS.

| Check | Expected behavior | Result |
| --- | --- | --- |
| Built-in example | 3 added, 2 removed, 3 unchanged | Passed |
| Changed-lines filter | Only five changed rows remain | Passed |
| Previous/Next navigation | Focus moves between changed rows | Passed |
| Tab from a changed row | Focus returns to Next change | Passed |
| Identical “hello” inputs | No changes reported | Passed |
| Both inputs empty | Validation message appears | Passed |
| Empty Original, Updated contains “hello” | 1 added, 0 removed, 0 unchanged | Passed |
| Repeated lines: A/B/A versus A/A/B | 1 added, 1 removed, 2 unchanged | Passed |
| Swap versions | Previous result is hidden until comparison runs again | Passed |
| Published demonstration | Example loads and comparison works online | Passed |

These checks were performed by the developer during guided manual
testing. They are not an automated test suite or a complete audit.

### Remaining checks

- Exactly 500 lines and input exceeding 500 lines.
- Character-count boundary and oversized character input.
- Windows versus Unix line endings.
- Trailing-newline and whitespace-only changes.
- Long individual lines and exact 320px layout.
- Screen-reader announcements.
- HTML-like input displayed as plain text.
- Unexpected-failure handling.
- Additional browsers and mobile devices.

These checks are listed as pending rather than claimed as passed.

## Reproducing key checks

### Built-in example

Press Load example, then Compare versions.

Expected:

3 added · 2 removed · 3 unchanged

### Identical text

Set both inputs to:

hello

Expected: an identical-versions message and no changed lines.

### Empty input

Clear both inputs and compare.

Expected: an explanatory validation message.

Then leave Original empty and enter hello in Updated.

Expected:

1 added · 0 removed · 0 unchanged

### Repeated lines

Original:

A
B
A

Updated:

A
A
B

Expected:

1 added · 1 removed · 2 unchanged

## Project structure

index.html Semantic interface and controls
style.css Layout, responsive styles and focus indicators
script.js Comparison algorithm, validation and interactions
README.md Setup, scope, reference comparison and verification
.nojekyll Static-site configuration for GitHub Pages

## Deployment and development history

The application is hosted with GitHub Pages using the main branch
and repository root.

The commit history records the work as it was saved, including the
initial implementation, static-site configuration and documentation
updates. It does not represent every individual edit made during
development.

## Development assistance

AI assistance was used to generate the initial implementation,
explain the algorithm and guide setup and testing.

The developer assembled the project, ran the documented manual
checks and published the demonstration.

## Known limitations

- Comparison is line-based, not character-based.
- Large inputs beyond the documented limits are rejected.
- Processing is synchronous within the input limits.
- Repeated lines can produce alternative valid alignments.
- Input content is not persistently saved.
- Manual verification is incomplete as documented above.