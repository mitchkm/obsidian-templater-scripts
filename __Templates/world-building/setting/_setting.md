<%*
let title = await tp.user.checkForTitleOrPrompt(tp);
await tp.file.rename(title);
const description = await tp.system.prompt("Describe the setting...");

let frontmatter = {};
frontmatter['created on'] = tp.date.now("YYYY-MM-DDTHH:mm:ss");
frontmatter['tags'] = ['setting']
frontmatter['description'] = description;

tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
	tp.file.move(`/Settings/${title}`);
});
-%>
# Description
# Entries
## Locations
```dataview
list
from #location
where typeof(setting) = "array" AND contains(setting, [[<% title %>]])
```
## Characters
```dataview
list
from #character 
where typeof(setting) = "array" AND contains(setting, [[<% title %>]])
```
## Factions
```dataview
list
from #faction
where typeof(setting) = "array" AND contains(setting, [[<% title %>]])
```
## Items
```dataview
list
from #item 
where typeof(setting) = "array" AND contains(setting, [[<% title %>]])
```
## Other
```dataview
list
from #entry 
where typeof(setting) = "array" AND contains(setting, [[<% title %>]])
```