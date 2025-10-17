<%*
const url = await tp.system.prompt("Enter Mod Url");
let result = await tp.user.getMCModInfoFromURL(tp, url);
let inTitle;
if (result.success) {
	inTitle = result.modInfo.title;
} else { // fallback on basic title prompting if get from url fails
	inTitle = await tp.user.checkForTitleOrPrompt(tp);
}

const modInfo = result.modInfo;
const {title, filename, frontmatter} = await tp.user.noteSetup_default(tp, inTitle);

frontmatter['tags'].push("minecraft/mod");
frontmatter['owner'] = modInfo.owner;
frontmatter['description'] = modInfo.description;
frontmatter['type'] = "";
frontmatter['client'] = modInfo.client_side;
frontmatter['server'] = modInfo.server_side;
frontmatter['url'] = modInfo.url;
frontmatter['included-in'] = "";

// Assign frontmatter after execution
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
});
-%>
# <%* tR += title %>