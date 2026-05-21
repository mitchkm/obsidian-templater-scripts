class DVHelper {
    static JSON_CODEBLOCK_REGEX = /```json[^\S\n]*(?<label>[\S]*?)[\s]*\n(?<json>[\s\S]*?)\n```/g;

    /**
     * Parse a JSON codeblock from a page's content by its label.
     *
     * Loads the page file content, searches for fenced JSON codeblocks of the
     * form ```json <label>\n<json>\n```, and returns the parsed JSON for the
     * first codeblock whose label matches the provided label.
     *
     * @param {object} page - The page descriptor provided by DataView.
     * @param {string?} label - The label string to match against the codeblock's
     *   first line immediately following the opening ```json.
     * @returns {Promise<any|null>} Parsed JSON object if a matching codeblock was
     *   found and successfully parsed; otherwise null.
     */
    async parseJsonCodeblock(page, label) {
        if (label == undefined) {
            label = "";
        }

        // load file
        const content = await DataviewAPI.io.load(page.file.path);

        // find all json codeblocks  
        const matches = [...content.matchAll(DVHelper.JSON_CODEBLOCK_REGEX)];
        let json = null;
        for (let match of matches) {
            if (match?.groups?.label === label) {
                try {
                    json = JSON.parse(match.groups.json);
                }
                catch (e) { 
                    console.error(page.title, e);
                    console.log(match.groups.json);
                }

                if (json) {
                    console.log(page.title, label, match?.groups?.label, json);
                    break;
                }
            }
        }

        return json;
    }
}