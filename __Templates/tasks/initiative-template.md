<%*
// Default setup
const {title, filename, frontmatter} = await tp.user.noteSetup_default(tp);

// Additional frontmatter
frontmatter['tags'].push("note/initiative");
frontmatter['status'] = "inactive";

// Assign frontmatter after execution
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
});
-%>
# <% title %>
## Projects