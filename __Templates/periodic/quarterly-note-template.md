<%*
const p = tp.user.periodicNoteHelper();
const file = tp.file.find_tfile(tp.file.path(true));

// Get yearly note name
const quarterDate = moment(tp.file.title, p.FILE_FORMAT_QUARTER);
const noteNames = p.getPeriodicNoteFilenamesFromDate(quarterDate);

// Create yearly note if not present
const folder = tp.file.folder(true);
const yearTemplate = tp.file.find_tfile('yearly-note-template');
await tp.user.createOrFindNote(tp, noteNames.year, folder, yearTemplate);

// Build frontmatter
let frontmatter = {};
frontmatter['created'] = tp.file.creation_date("YYYY-MM-DD HH:mm");
frontmatter['tags'] = ['note/periodic/quarterly'];
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter, file);
});

// Generate necessary text for note
const linkText = p.getPeriodicNoteLinkTextFromDate(quarterDate);
const navText = `[[${linkText.year}]]`;
const prev = quarterDate.clone().subtract(1, 'quarters').format(p.LINK_FORMAT_QUARTER);
const next = quarterDate.clone().add(1, 'quarters').format(p.LINK_FORMAT_QUARTER);
const monthsInQuarter = p.getMonthsInQuarterLinkText(quarterDate);
const selectorText = monthsInQuarter.map(text => `[[${text}]]`).join(' - ');
-%>
> <% navText %>
> 
> <% `< [[${prev}]] | [[${next}]] >` %>
> <% selectorText %>
# <% quarterDate.format('YYYY [Q]Q') %>