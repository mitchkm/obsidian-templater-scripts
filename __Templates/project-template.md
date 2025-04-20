<%*
// Default setup
const {title, filename, frontmatter} = await tp.user.noteSetup_default(tp);

// Additional frontmatter
frontmatter['completion-date'] = "";
frontmatter['status'] = "not-started";
frontmatter['tags'] = [
	"note/project"
];

// Assign frontmatter after execution
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
});
-%>
# <% title %>
\<describe the desired outcome> <% tp.file.cursor() %>
## Tasks