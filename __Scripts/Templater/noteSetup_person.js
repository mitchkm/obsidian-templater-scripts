/**
 * Person note setup
 * 1. Prompts for a title if none present.
 * 2. Converts title to name convention conforming filename.
 * 3. Renames file.
 * 4. Returns basic note info + person note info.
 * @param tp - Templater reference.
 * @param affiliation - the preson's affiliation (family, friend, acquaintance, stranger)
 * @returns Returns basic information regarding note. Object: {title, filename, frontmatter}
 */
async function my_function (tp, affiliation) {
    const {title, filename, frontmatter} = await tp.user.noteSetup_default(tp);

    frontmatter['tags'].push("note/person/" + affiliation);
    frontmatter['first-name'] = "";
    frontmatter['middle-name'] = "";
    frontmatter['last-name'] = "";
    frontmatter['nicknames'] = [];
    frontmatter['birthday'] = "";
    frontmatter['partner'] = "";

    return {
        title,
        filename,
        frontmatter,
    };
}
module.exports = my_function;