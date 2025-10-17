/**
 * Fetches Minecraft mod information from Modrinth or CurseForge URLs using their respective APIs
 * @async
 * @param {object} tp - Obsidian Templater plugin object
 * @param {string} url - URL of the Minecraft mod (from either Modrinth or CurseForge)
 * @returns {Promise<{success: boolean, modInfo: {
 *   url: string,
 *   owner: string,
 *   title: string,
 *   description: string,
 *   server_side: boolean,
 *   client_side: boolean
 * }}>} Object containing success status and mod information
 * @example
 * const result = await my_function(tp, "https://modrinth.com/mod/sodium");
 */
async function my_function (tp, url) {
    let result = {success: false, modInfo: {}};
    const modInfoDefaults = {
        url: "",
        owner: "",
        title: "",
        description: "",
        server_side: true,
        client_side: true,
    };
    let metaInfo;
    try {
        let parsedModName;
        if (url.includes("modrinth")) {
            parsedModName = url.replace("https://modrinth.com/mod/", "").trim();
            
        }
        else if (url.includes("curseforge")) {
            parsedModName = url.replace("https://www.curseforge.com/minecraft/mc-mods/", "").trim();
        }

        // Make sure parsedModName exists, then try Modrinth api first for information.
        if (parsedModName) {
            try {
                const response = await tp.obsidian.requestUrl(`https://api.modrinth.com/v2/project/${parsedModName}`);
                const response2 = await tp.obsidian.requestUrl(`https://api.modrinth.com/v2/project/${parsedModName}/members`);
                metaInfo = await response.json;
                let owners = response2.json.filter(m => m.role == "Owner");            
                result.modInfo = {
                    url: url,
                    owner: owners[0].user.username,
                    title: metaInfo.title.trim(),
                    description: metaInfo.description,
                    server_side: metaInfo.server_side == "required",
                    client_side: metaInfo.client_side == "required",
                };
                result.success = true && result.modInfo.title;
            } catch(err) { console.warn("Modrinth API " + err); }

            // If Modrinth api doesn't hit, try cursforge api.
            if (!result.success) {
                const response = await tp.obsidian.requestUrl({url: `https://api.curseforge.com/v1/mods/search?gameId=432&slug=${parsedModName}`, headers: {'x-api-key': 'CURSEFORGE_API_KEY'}});
                metaInfo = await response.json.data[0];
                result.modInfo = {
                    url: url,
                    owner: metaInfo.authors[0].name,
                    title: metaInfo.name.trim(),
                    description: metaInfo.summary,
                    server_side: true, // assume needed; meta data not present
                    client_side: true, // assume needed; meta data not present
                };
                result.success = true && result.modInfo.title;
            }
        }
    } catch(err) {
       result.success = false;
       console.warn(err);
    }

    // console.log(result);
    if (!result.success) { result.modInfo = modInfoDefaults; };
    return result;
}
module.exports = my_function;