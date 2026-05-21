<%*
const currentFile = this.app.workspace.getActiveFile();

// Update frontmatter
this.app.fileManager.processFrontMatter(currentFile, frontmatter => { 
	frontmatter['last-semantic-change'] = tp.date.now();
});
%>