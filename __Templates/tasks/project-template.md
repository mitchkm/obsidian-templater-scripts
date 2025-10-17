<%*
// Default setup
const {title, filename, frontmatter} = await tp.user.noteSetup_default(tp);
const file = tp.file.find_tfile(tp.file.path(true));

// Auto populate initiative if creating project while on an initiative note
const activeFile = tp.app.workspace.getActiveFile();
const activeFileIsInitiative = tp.app.metadataCache.getFileCache(activeFile)?.frontmatter?.tags?.includes("note/initiative");

// Additional frontmatter
frontmatter['tags'].push("note/project");
frontmatter['tags'].push("ephemeral");
frontmatter['initiative'] = activeFileIsInitiative ? `[[${activeFile.basename}]]` : "";
frontmatter['status'] = "dormant";
frontmatter['completion-date'] = "";

// Assign frontmatter after execution
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
	await tp.file.move(`/projects/${filename}`);
});
-%>
# <% title %>
\<describe the desired outcome><% tp.file.cursor() %>
## Tasks