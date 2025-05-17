<%*
const title = await tp.user.checkForTitleOrPrompt(tp);
await tp.file.rename(title); 

let frontmatter = await tp.user.generateEntryFrontmatter(tp, 'character');
frontmatter['allies'] = [];
frontmatter['enemies'] = [];

tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
	tp.file.move(`/Characters/${title}`);
});
-%>