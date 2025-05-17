function my_function (notes) {
    if (Array.isArray(notes)) {
        return notes.map(note => `[[${note.file.name}]]`)
    }
    return `[[${notes.file.name}]]`
}
module.exports = my_function;