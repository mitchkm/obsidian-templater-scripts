<%*
// Prompt new title
const oldTitle = tp.frontmatter.title;
const newTitle = await tp.system.prompt("New note title", oldTitle, true);

// Rename the file
await tp.file.rename(tp.user.convertPrettyTitleToFilename(newTitle));

// Grab file ref
const file = this.app.workspace.getActiveFile();

// Update H1 heading
await this.app.vault.modify(file, tp.file.content.replace(/^# .*/m, `# ${newTitle}`));

// Replace old title aliase if present; add new title
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
%>