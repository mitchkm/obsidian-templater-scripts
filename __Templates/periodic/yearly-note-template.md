<%*
const p = tp.user.periodicNoteHelper();
const file = tp.file.find_tfile(tp.file.path(true));
const yearDate = moment(tp.file.title, p.FILE_FORMAT_YEAR);

// Build frontmatter
let frontmatter = {};
frontmatter['created'] = tp.file.creation_date("YYYY-MM-DD HH:mm");
frontmatter['tags'] = ['note/periodic/yearly'];
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
});

// Generate necessary text for note
const prev = yearDate.clone().subtract(1, 'years').format(p.LINK_FORMAT_YEAR);
const next = yearDate.clone().add(1, 'years').format(p.LINK_FORMAT_YEAR);
const quartersInYear = p.getQuartersInYearLinkText(yearDate);
const selectorText = quartersInYear.map(text => `[[${text}]]`).join(' - ');
-%>
> 
> 
> <% `< [[${prev}]] | [[${next}]] >` %>
> <% selectorText %>
# <% yearDate.format('YYYY') %>