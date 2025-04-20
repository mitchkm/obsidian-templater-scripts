/**
 * Adds provided frontmatter to file's existing frontmatter.
 * @param tp - Templater reference.
 * @param frontmatter - Desired frontmatter key/value pairs to add.
 * @param fileOverride - Optional tFile handle.
 */
async function my_function (tp, frontmatter, fileOverride) {
    const file = fileOverride ?? tp.file.find_tfile(tp.file.path(true));
    await app.fileManager.processFrontMatter(file, fm => { 
      deepMerge(fm, frontmatter, true);
    });
}

// Deep merge objects
function deepMerge(obj1, obj2, unionArrays = false) {
  for (let key in obj2) {
    if (!obj2.hasOwnProperty(key)) {
      continue;
    }

    if (unionArrays && Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      obj1[key] = Array.from(new Set([...obj1[key], ...obj2[key]]));
    } else if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
      obj1[key] = deepMerge(obj1[key], obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
}

module.exports = my_function;