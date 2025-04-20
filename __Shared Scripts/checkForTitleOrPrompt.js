/**
 * If File is untitled prompt the User to for a Title.
 */
async function my_function (tp) {
    // If File is untitled prompt the User to set a Title (Source: https://github.com/SilentVoid13/Templater/discussions/259)
    let title = tp.file.title
    if (title.startsWith("Untitled")) {
        title = await tp.system.prompt("Title") ?? "Untitled";
    }
    return title;
}
module.exports = my_function;