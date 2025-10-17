/**
 * Takes the intended "pretty" title of a desired note in Obsidian and converts it to a conforming filename following naming conventions.
 * @example 'My Project - Really Cool Idea!' → 'my-project_really-cool-idea'
 * @param str The "pretty" title of a note.
 * @returns The true filename conforming to defined naming conventions.
 */
function my_function(str) {
    return str
        .replace(/\s*-+\s*/g, '_')                 // Step 1: pre-existing hyphen notation → underscore
        .replace(/[\s+]+/g, '-')                   // Step 2: spaces → hyphens
        .replace(/[^a-zA-Z0-9_\-]/g, '')           // Step 3: remove other special characters
        .toLowerCase();                            // Step 4: ensure lowercase
}
module.exports = my_function;