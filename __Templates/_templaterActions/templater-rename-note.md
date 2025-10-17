<%*
// Prompt new title
const oldTitle = tp.frontmatter.title;
const newTitle = await tp.system.prompt("New note title", oldTitle, true);

// Rename the file
const filename = tp.user.convertPrettyTitleToFilename(newTitle);
await tp.file.rename(filename);

// Grab file ref
const currentFile = this.app.workspace.getActiveFile();
const file = tp.file.find_tfile(filename);

// Ensure we are operating over the same file, else don't do anything
if (currentFile == file) {
	// Update H1 heading
	await this.app.vault.modify(file, 
	tp.file.content.replace(/^# .*/m, `# ${newTitle}`));
	
	// Replace old title alias if present; add new title
	const aliases = tp.frontmatter['aliases'] ?? [];
	const index = aliases.indexOf(oldTitle);
	if (index !== -1) {
		aliases[index] = newTitle;
	} else { aliases.push(newTitle); }
	
	// Update frontmatter
	this.app.fileManager.processFrontMatter(file, frontmatter => { 
			frontmatter.title = newTitle;
			frontmatter.aliases = aliases;
		});
}
%>