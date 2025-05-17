async function my_function(tp, tag) {
    const description = await tp.system.prompt(`Describe the ${tag}...`);

    const settings = (await tp.user.queryNotes("#setting")).array();
    const setting_names = settings.map(setting_note => setting_note.file.name)
    const selected_setting = await tp.user.promptWithSuggestions(tp, setting_names, "Choose a Setting");
    const setting_links = tp.user.noteToLink(settings);

    const notes_in_setting = (await tp.user.queryNotes()).where(note => {
        if (note.setting) {
            const setting_names = note.setting.map(link => link.fileName());
            console.log(setting_names);
            return setting_names.contains(selected_setting[0]);
        }
        return false;
    }).array();

    const note_names = notes_in_setting.map(p => p.file.name)
    const connections_names = await tp.user.promptWithSuggestions(tp, note_names, "Choose connections...", true);
    const connections = connections_names.map(c => `[[${c}]]`)
    
    let frontmatter = {};
    frontmatter['created on'] = tp.date.now("YYYY-MM-DDTHH:mm:ss");
    frontmatter['tags'] = [tag];
    frontmatter['setting'] = setting_links ?? [];
    frontmatter['description'] = description ?? "";
    frontmatter['connections'] = connections ?? [];

    return frontmatter;
}
module.exports = my_function;