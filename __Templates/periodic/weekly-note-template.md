<%*
const p = tp.user.periodicNoteHelper();
const file = tp.file.find_tfile(tp.file.path(true));

// Get monthly, quarterly, and yearly note names
const weekDate = moment(tp.file.title, p.FILE_FORMAT_WEEK);
const noteNames = p.getPeriodicNoteFilenamesFromDate(weekDate);

// Create monthly, quarterly, and yearly notes if not present
const folder = tp.file.folder(true);
const monthTemplate = tp.file.find_tfile('monthly-note-template');
await tp.user.createOrFindNote(tp, noteNames.month, folder, monthTemplate);

// Build frontmatter
let frontmatter = {};
frontmatter['created'] = tp.file.creation_date("YYYY-MM-DD HH:mm");
frontmatter['tags'] = ['note/periodic/weekly'];
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter, file);
});

// Generate necessary text for note
weekDate.startOf('week');
const linkText = p.getPeriodicNoteLinkTextFromDate(weekDate);
const navText = [
`[[${linkText.year}]]`,
`[[${linkText.quarter}]]`,
`[[${linkText.month}]]`,
].join(' / ');
// Handle edge case of starting between years, quarters, and/or months
const endOfWeek = weekDate.clone().endOf('week');
const eowLinkText = p.getPeriodicNoteLinkTextFromDate(endOfWeek);
let eowNav = [];
if (weekDate.year() != endOfWeek.year()) {
	eowNav.push(`[[${eowLinkText.year}]]`);
}
if (weekDate.quarter() != endOfWeek.quarter()) {
	eowNav.push(`[[${eowLinkText.quarter}]]`);
}
if (weekDate.month() != endOfWeek.month()) {
	eowNav.push(`[[${eowLinkText.month}]]`);
}
eowNavText = eowNav.join(' / ');
console.log(eowNavText);

const prev = weekDate.clone().subtract(1, 'weeks').format(p.LINK_FORMAT_WEEK);
const next = weekDate.clone().add(1, 'weeks').format(p.LINK_FORMAT_WEEK);
const daysInWeek = p.getDaysInWeekLinkText(weekDate);
const selectorText = daysInWeek.map(text => `[[${text}]]`).join(' - ');
-%>
> <% navText + (eowNavText ? ` - ${eowNavText}` : '') %>
> 
> <% `< [[${prev}]] | [[${next}]] >` %>
> <% selectorText %>
# <% weekDate.format('YYYY [Week] W') %>