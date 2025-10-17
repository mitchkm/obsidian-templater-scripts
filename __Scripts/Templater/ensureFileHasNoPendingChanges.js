/**
 * Ensures file has no pending modifications.
 * @param tp - Templater reference.
 * @param [inFile] - Optional tFile handle, else grabs current active file.
 */
async function my_function(tp, inFile = null) {
    const file = inFile ?? tp.file.find_tfile(tp.file.path(true));
    let cachedRead = "";
    let editorGetValue = "";
    let iterationCount = 1;
    do {
        cachedRead = await tp.app.vault.cachedRead(file);
        editorGetValue = tp.app.workspace.activeEditor.editor.getValue();
        await sleep(50);
    } while (iterationCount++ < 75 && cachedRead.length !== editorGetValue.length);
}
module.exports = my_function;