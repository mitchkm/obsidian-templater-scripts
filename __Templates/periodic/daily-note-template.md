<%*
const p = tp.user.periodicNoteHelper();
const file = tp.file.find_tfile(tp.file.path(true));

// Get weekly, monthly, quarterly, and yearly note names
const dayDate = moment(tp.file.title, p.FILE_FORMAT_DAY);
const noteNames = p.getPeriodicNoteFilenamesFromDate(dayDate);

// Create weekly, monthly, quarterly, and yearly notes if not present
const folder = tp.file.folder(true);
const weekTemplate = tp.file.find_tfile('weekly-note-template');
await tp.user.createOrFindNote(tp, noteNames.week, folder, weekTemplate);

// Build frontmatter
let frontmatter = {};
frontmatter['created'] = tp.file.creation_date("YYYY-MM-DD HH:mm");
frontmatter['tags'] = ['note/periodic/daily'];
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter, file);
});

// Generate necessary text for note
const linkText = p.getPeriodicNoteLinkTextFromDate(dayDate);
const navText = [
`[[${linkText.year}]]`,
`[[${linkText.quarter}]]`,
`[[${linkText.month}]]`,
`[[${linkText.week}]]`,
].join(' / ');
const prev = dayDate.clone().subtract(1, 'days').format(p.LINK_FORMAT_DAY);
const next = dayDate.clone().add(1, 'days').format(p.LINK_FORMAT_DAY);
const lastYearDay = dayDate.clone().subtract(1, 'years').format(p.LINK_FORMAT_DAY);
-%>
> <% navText %>
> 
> <% `< [[${prev}]] | [[${next}]] >` %>
> 
# <% dayDate.format('dddd, MMMM Do YYYY') %>
last year today: <% `[[${lastYearDay}]]` %>