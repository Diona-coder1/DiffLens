# DiffLens — Decision Record

This document reviews three significant design decisions in DiffLens:
the comparison algorithm, browser-based processing, and the result format.

The initial implementation was generated with AI assistance.
The alternatives below were examined during this documentation review;
they are not presented as a record of an earlier independent evaluation.

## 1. Use line-based Longest Common Subsequence comparison

### Decision

Keep the current Longest Common Subsequence (LCS) algorithm, which
compares complete lines using a dynamic-programming matrix.

Each input is limited to 500 lines and 50,000 JavaScript string
code units.

### Alternatives reviewed

- Compare lines at matching positions. This would be simpler, but
inserting one line could make many later lines appear different.
- Use an existing diff library. This could provide more advanced
comparison behavior, but would introduce a dependency whose
behavior and integration would need to be understood.

### Reason for retaining this choice

LCS identifies shared lines even when additions or removals shift
their positions. The implementation is small enough to inspect
and explain for this learning project.

### Costs and limitations

The matrix requires O(n × m) space and the algorithm performs
O(n × m) matrix updates for n original and m updated lines.

The input limits restrict the tool to relatively small comparisons.
Users must split larger documents into smaller sections, potentially
losing context across those sections.

Repeated lines can produce multiple valid alignments. DiffLens
does not promise the same output as GitHub.

### Cost of changing this decision

Replacing the algorithm would require checking line numbers,
summary counts, repeated-line alignment, and the order of operations
used by rendering and change navigation.

## 2. Process comparisons synchronously in the browser

### Decision

Keep comparison and rendering in browser JavaScript, without a
comparison API or backend.

Comparison currently runs synchronously on the main thread.

### Alternatives reviewed

- Move comparison into a Web Worker to separate computation from
interface interactions.
- Use a backend API to perform comparisons.

### Reason for retaining this choice

Browser processing supports a simple static deployment and local
use without a build step or server installation.

The application does not need to upload the compared text to a
comparison service.

### Costs and limitations

Synchronous computation shares the main thread with the interface.
While it runs, it can delay other interface work.

Input limits reduce the amount of computation but do not establish
a measured responsiveness guarantee across devices.

The current application also has no persistence mechanism, so
users must keep their own copy before refreshing or closing it.
Browser storage could be added separately; this is not an
unavoidable limitation of browser-based processing.

### Cost of changing this decision

A Web Worker would require asynchronous communication, a pending
state, and handling inputs that change while a comparison is running.

A backend would additionally require hosting, request-error
handling, and decisions about how submitted text is handled.

## 3. Display a unified diff of complete lines

### Decision

Keep one ordered result containing unchanged, removed, and added
lines. Represent an edited line as a removal followed by an addition.

### Alternatives reviewed

- A side-by-side view with aligned original and updated lines.
- Word-level or character-level highlighting inside changed lines.

### Reason for retaining this choice

A unified view provides one reading sequence and fits the project's
focused paste-and-compare workflow.

Complete-line operations also provide a straightforward basis for
counts, filtering, line numbers, and change navigation.

### Observed drawback during review

A manual check compared:

Original:
const price = 10;

Updated:
const price = 100;

DiffLens displayed one removed line and one added line.
This matches the implementation, but does not identify the extra
zero inside the line.

This review exposed a drawback of the chosen representation:
a reader must inspect the two lines to locate a small internal edit.
That can become awkward with longer lines.

### Costs and limitations

The result shows which lines changed, but not precisely which
characters changed.

A replacement contributes to both the removed and added counts.
These counts describe line operations, not the number of individual
edits the user made.

### Cost of changing this decision

Character-level highlighting would require another comparison
stage and a method for pairing removed and added lines.

A side-by-side view would require alignment and layout changes.
Either extension would also need updated accessibility labels,
navigation checks, and documentation.

## Review outcome

The current implementation is retained for the project's scope.

The review identified character-level highlighting as a possible
future improvement for small edits within long lines. It has not
been implemented.

Setup, usage, input limits, and the verification record are
documented in README.md.