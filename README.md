# DiffLens

A browser-based, line-by-line text and code comparison tool.

This learning project rebuilds the unified diff feature familiar
from GitHub. It is not affiliated with GitHub.

## Project status

Initial working implementation.
Formal test results and the detailed reference comparison are pending.

## Purpose

Compare two pasted versions without creating a repository,
making a commit, uploading a file or sending the text to a server.

## Run locally

Download or clone the repository and open index.html in a browser.

No dependencies or build step are required.
JavaScript must be enabled.

Alternatively, if Python 3 is installed, run:

python3 -m http.server 8000

Then visit http://localhost:8000.

## Usage

1. Paste text into Original and Updated, or press Load example.
2. Press Compare versions.
3. Read additions, removals and unchanged lines.
4. Use Next change and Previous change to focus changed lines.
5. Enable Show changed lines only to hide unchanged context.

Editing or swapping the inputs invalidates the previous result.
Compare again to generate an updated result.

Load example replaces both inputs.

## Keyboard operation

- Tab and Shift+Tab navigate native controls.
- Enter or Space activates buttons.
- Space toggles the changed-lines checkbox.
- Textareas retain normal keyboard editing.
- Tab leaves a textarea instead of inserting indentation.
- Change navigation focuses the selected result line.
- From a focused result line, Tab returns to Next change.
- Shift+Tab returns to Previous change.
- Tab again continues through the page normally.
- Focus indicators remain visible.

## Comparison behavior

The algorithm uses the Longest Common Subsequence of complete lines.

- Exact line matches are unchanged.
- Other lines are added or removed.
- A replacement appears as removal plus addition.
- Spaces and blank lines are significant.
- CRLF, CR and LF line endings are normalized.
- A final newline is significant.
- An empty document has zero lines.
- One empty input represents adding or deleting an entire document.
- Two empty inputs produce a validation message.

Inputs are limited to 500 lines and 50,000 characters per version.
Oversized inputs are rejected without deleting their content.

## Privacy

Comparison runs in this browser tab.
The application makes no network requests and does not execute input.

Text is rendered using textContent.
Inputs are not stored by the application and should not be relied
on to survive a refresh or closing the tab.

## Scope

Included:
- Two text inputs.
- Unified line-by-line comparison.
- Original and updated line numbers.
- Addition and removal counts.
- Changed-lines filtering.
- Keyboard change navigation.
- Input validation.
- Responsive layout.

Deliberately excluded:
- Character-level diff highlighting.
- Syntax highlighting.
- Repository and commit integration.
- Pull requests, reviews and comments.
- File uploads and multi-file comparison.
- User accounts and cloud storage.

These features are excluded to keep the project focused on one
complete interaction: comparing two versions of text.

## Intended improvement

Provide a direct paste-and-compare workflow for temporary code
snippets without requiring repository or commit setup.

A detailed comparison with the reference feature will be added
after checking the original workflow.

## Verification still to perform

- Known addition, deletion and replacement examples.
- Repeated lines.
- Empty and identical input.
- Whitespace and final-newline differences.
- Input limits.
- Keyboard navigation.
- Narrow-screen layout.
- Text containing HTML-like characters.