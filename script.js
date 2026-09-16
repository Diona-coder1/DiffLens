"use strict";

const original = document.querySelector("#original");
const updated = document.querySelector("#updated");
const form = document.querySelector("#compare-form");
const notice = document.querySelector("#notice");
const panel = document.querySelector("#result-panel");
const summary = document.querySelector("#summary");
const diffList = document.querySelector("#diff-lines");
const changesOnly = document.querySelector("#changes-only");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
const navigationStatus = document.querySelector("#navigation-status");

const MAX_LINES = 500;
const MAX_CHARACTERS = 50000;

let changedElements = [];
let changeIndex = -1;

function setNotice(message, type = "") {
notice.className = `notice ${type}`;
notice.textContent = message;
}

function splitLines(text) {
// Treat CRLF, CR and LF as equivalent line endings.
const normalized = text.replace(/\r\n?/g, "\n");

// An empty document has zero lines.
// A trailing newline creates a final empty line.
return normalized === "" ? [] : normalized.split("\n");
}

/*
* Longest Common Subsequence:
* finds the lines that both versions share in the same order.
* Everything else becomes an addition or removal.
*
* The input limit keeps the matrix at most 501 × 501 cells.
*/
function compareLines(before, after) {
const rows = before.length;
const columns = after.length;

const matrix = Array.from(
{ length: rows + 1 },
() => new Uint16Array(columns + 1)
);

for (let i = rows - 1; i >= 0; i--) {
for (let j = columns - 1; j >= 0; j--) {
matrix[i][j] = before[i] === after[j]
? matrix[i + 1][j + 1] + 1
: Math.max(matrix[i + 1][j], matrix[i][j + 1]);
}
}

const operations = [];
let i = 0;
let j = 0;

while (i < rows || j < columns) {
if (i < rows && j < columns && before[i] === after[j]) {
operations.push({
type: "unchanged",
text: before[i],
oldLine: i + 1,
newLine: j + 1
});
i++;
j++;
} else if (
i < rows &&
(j === columns || matrix[i + 1][j] >= matrix[i][j + 1])
) {
operations.push({
type: "removed",
text: before[i],
oldLine: i + 1,
newLine: null
});
i++;
} else {
operations.push({
type: "added",
text: after[j],
oldLine: null,
newLine: j + 1
});
j++;
}
}

return operations;
}

function makeSpan(className, text, decorative = false) {
const element = document.createElement("span");
element.className = className;
element.textContent = text;

if (decorative) {
element.setAttribute("aria-hidden", "true");
}

return element;
}

function renderDiff(operations) {
const fragment = document.createDocumentFragment();
changedElements = [];
changeIndex = -1;

operations.forEach((operation) => {
const row = document.createElement("li");
row.className = `diff-line ${operation.type}`;
row.dataset.type = operation.type;

const oldNumber = makeSpan(
"line-number",
operation.oldLine ?? "—",
true
);

const newNumber = makeSpan(
"line-number",
operation.newLine ?? "—",
true
);

const symbol = operation.type === "added"
? "+"
: operation.type === "removed" ? "−" : "";

const marker = makeSpan("line-symbol", symbol, true);

let accessibleLabel;

if (operation.type === "added") {
accessibleLabel = `Added, new line ${operation.newLine}: `;
} else if (operation.type === "removed") {
accessibleLabel = `Removed, old line ${operation.oldLine}: `;
} else {
accessibleLabel =
`Unchanged, old line ${operation.oldLine}, ` +
`new line ${operation.newLine}: `;
}

const label = makeSpan("sr-only", accessibleLabel);
const code = document.createElement("code");

// Never interpret user input as HTML.
code.textContent = operation.text === "" ? "[blank line]" : operation.text;

if (operation.text === "") {
code.classList.add("blank-line");
}

row.append(oldNumber, newNumber, marker, label, code);

if (operation.type !== "unchanged") {
row.tabIndex = -1;
changedElements.push(row);
}

fragment.append(row);
});

diffList.replaceChildren(fragment);

const hasChanges = changedElements.length > 0;
previousButton.disabled = !hasChanges;
nextButton.disabled = !hasChanges;
changesOnly.disabled = !hasChanges;
changesOnly.checked = false;

navigationStatus.textContent = hasChanges
? `${changedElements.length} changed lines. Use Next or Previous to navigate.`
: "No changed lines to navigate.";
}

function invalidateComparison(message = "Inputs changed. Compare again to update the result.") {
panel.hidden = true;
diffList.replaceChildren();
changedElements = [];
changeIndex = -1;

original.removeAttribute("aria-invalid");
updated.removeAttribute("aria-invalid");

setNotice(message);
}

function validateInput(input, label) {
if (input.value.length > MAX_CHARACTERS) {
input.setAttribute("aria-invalid", "true");
setNotice(
`${label} exceeds ${MAX_CHARACTERS.toLocaleString()} characters. ` +
"Compare a smaller section; your text has not been removed.",
"error"
);
input.focus();
return null;
}

const lines = splitLines(input.value);

if (lines.length > MAX_LINES) {
input.setAttribute("aria-invalid", "true");
setNotice(
`${label} has ${lines.length} lines. The limit is ${MAX_LINES}. ` +
"Compare a smaller section; your text has not been removed.",
"error"
);
input.focus();
return null;
}

return lines;
}

form.addEventListener("submit", (event) => {
event.preventDefault();

original.removeAttribute("aria-invalid");
updated.removeAttribute("aria-invalid");
panel.hidden = true;

if (original.value === "" && updated.value === "") {
setNotice(
"Both versions are empty. Paste text into at least one field or load the example.",
"error"
);
original.setAttribute("aria-invalid", "true");
original.focus();
return;
}

const before = validateInput(original, "Original");
if (before === null) return;

const after = validateInput(updated, "Updated");
if (after === null) return;

try {
const operations = compareLines(before, after);

let added = 0;
let removed = 0;
let unchanged = 0;

operations.forEach((operation) => {
if (operation.type === "added") added++;
else if (operation.type === "removed") removed++;
else unchanged++;
});

renderDiff(operations);

summary.textContent =
`${added} added · ${removed} removed · ${unchanged} unchanged`;

panel.hidden = false;

if (added === 0 && removed === 0) {
setNotice(
"The versions are identical after normalizing line endings. No changes found.",
"success"
);
} else {
setNotice(
`Comparison complete: ${added} added and ${removed} removed lines.`,
"success"
);
}
} catch (error) {
console.error("Comparison failed:", error);

setNotice(
"The comparison could not be completed. Your inputs are still here. " +
"Try comparing a smaller section.",
"error"
);
}
});

original.addEventListener("input", () => invalidateComparison());
updated.addEventListener("input", () => invalidateComparison());

document.querySelector("#swap").addEventListener("click", () => {
const previousOriginal = original.value;
original.value = updated.value;
updated.value = previousOriginal;

invalidateComparison("Versions swapped. Press Compare versions to see the result.");
});

document.querySelector("#example").addEventListener("click", () => {
original.value = [
"function greet(name) {",
' return "Hello, " + name;',
"}",
"",
'console.log(greet("Diona"));'
].join("\n");

updated.value = [
'function greet(name = "friend") {',
" return `Hello, ${name}!`;",
"}",
"",
'console.log(greet("Diona"));',
"console.log(greet());"
].join("\n");

invalidateComparison("Example loaded. Press Compare versions.");
});

changesOnly.addEventListener("change", () => {
diffList.querySelectorAll('[data-type="unchanged"]').forEach((row) => {
row.hidden = changesOnly.checked;
});

setNotice(
changesOnly.checked
? "Showing changed lines only. Original line numbers are preserved."
: "Showing all lines, including unchanged context."
);
});

function navigateChange(direction) {
if (changedElements.length === 0) return;

if (changeIndex === -1) {
changeIndex = direction > 0 ? 0 : changedElements.length - 1;
} else {
changeIndex =
(changeIndex + direction + changedElements.length) %
changedElements.length;
}

const target = changedElements[changeIndex];

target.focus({ preventScroll: true });
target.scrollIntoView({ block: "center", behavior: "auto" });

navigationStatus.textContent =
`Change ${changeIndex + 1} of ${changedElements.length}. ` +
"Navigation wraps at the first and last change.";
}

previousButton.addEventListener("click", () => navigateChange(-1));
nextButton.addEventListener("click", () => navigateChange(1));

// Return keyboard users to the change controls after inspecting a line.
diffList.addEventListener("keydown", (event) => {
if (event.key !== "Tab") return;

if (changedElements.includes(document.activeElement)) {
event.preventDefault();
(event.shiftKey ? previousButton : nextButton).focus();
}
});