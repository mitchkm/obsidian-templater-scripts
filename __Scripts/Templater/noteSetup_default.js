/**
 * Basic setup of a note.
 * 1. Prompts for a title if none present.
 * 2. Converts title to name convention conforming filename.
 * 3. Renames file.
 * 4. Returns basic note information including expectected frontmatter based on title.
 * @param tp - Templater reference.
 * @param [inTitle] Pass in a title to bypass prompting for one.
 * @returns Returns basic information regarding note. Object: {title, filename, frontmatter}
 */
async function my_function (tp, inTitle) {
    let title = inTitle ?? await tp.user.checkForTitleOrPrompt(tp);
    const filename = tp.user.convertPrettyTitleToFilename(title);

    await tp.file.rename(filename);

    let frontmatter = {};
    frontmatter['title'] = title;
    frontmatter['aliases'] = [title];
    frontmatter['created'] = tp.file.creation_date("YYYY-MM-DD HH:mm");
    frontmatter['tags'] = [];

    return {
        title,
        filename,
        frontmatter,
    };
}
module.exports = my_function;