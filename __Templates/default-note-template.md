<%*
// Default setup
const {title, filename, frontmatter} = await tp.user.noteSetup_default(tp);

frontmatter['tags'] = [];

// Assign frontmatter after execution
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
});
-%>
# <%* tR += title %>
<% tp.file.cursor() %>