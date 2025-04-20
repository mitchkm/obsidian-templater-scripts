async function my_function (tp, filename, folder, template) {
    let filePath = folder ? `${folder}\\${filename}` : filename;
    const exists = await tp.file.exists(`${filePath}.md`);
    if (!exists) {
        await tp.file.create_new(template, filename, false, folder);
    }
    return tp.file.find_tfile(filePath);
}
module.exports = my_function;