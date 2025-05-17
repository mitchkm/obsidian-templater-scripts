const GLOBAL_IGNORE_QUERY = '(-"__Templates" or -"__Scripts")'

async function my_function (queryString, noGlobalAppend) {
    let dv = app.plugins.plugins.dataview.api;
    let query = queryString ?? "";
    if (!noGlobalAppend) {
        query += queryString ? ` and ${GLOBAL_IGNORE_QUERY}` : GLOBAL_IGNORE_QUERY;
    }
    return await dv.pages(query);
}
module.exports = my_function;