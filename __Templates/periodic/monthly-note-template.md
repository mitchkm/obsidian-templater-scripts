<%*
const p = tp.user.periodicNoteHelper();
const file = tp.file.find_tfile(tp.file.path(true));

// Get quarterly, and yearly note names
const monthDate = moment(tp.file.title, p.FILE_FORMAT_MONTH);
const noteNames = p.getPeriodicNoteFilenamesFromDate(monthDate);

// Create quarterly, and yearly notes if not present
const folder = tp.file.folder(true);
const quarterTemplate = tp.file.find_tfile('quarterly-note-template');
await tp.user.createOrFindNote(tp, noteNames.quarter, folder, quarterTemplate);

// Build frontmatter
let frontmatter = {};
frontmatter['created'] = tp.file.creation_date("YYYY-MM-DD HH:mm");
frontmatter['tags'] = ['note/periodic/monthly'];
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter, file);
});

// Generate necessary text for note
const linkText = p.getPeriodicNoteLinkTextFromDate(monthDate);
const navText = [
`[[${linkText.year}]]`,
`[[${linkText.quarter}]]`,
].join(' / ');
const prev = monthDate.clone().subtract(1, 'months').format(p.LINK_FORMAT_MONTH);
const next = monthDate.clone().add(1, 'months').format(p.LINK_FORMAT_MONTH);
const weeksInMonth = p.getWeeksInMonthLinkText(monthDate);
const selectorText = weeksInMonth.map(text => `[[${text}]]`).join(' - ');
-%>
> <% navText %>
> 
> <% `< [[${prev}]] | [[${next}]] >` %>
> <% selectorText %>
# <% monthDate.format('YYYY MMMM') %>