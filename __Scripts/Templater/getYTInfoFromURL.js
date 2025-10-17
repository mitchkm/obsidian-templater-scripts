async function my_function (tp) {
    // Source: https://github.com/SilentVoid13/Templater/discussions/432#discussioncomment-5386148
    const url = await tp.system.prompt("Enter YouTube Url");
    try {
        let page = await tp.obsidian.request({url});
        let p = new DOMParser();
        let doc = p.parseFromString(page, "text/html");
        let $ = (s) => doc.querySelector(s);

        let canonical = $("link[rel='canonical']").href.split('&')[0];
        let title = $("meta[name='title']").content;
        let description = $("meta[name='description']").content;
        let keywords = $("meta[name='keywords']").content;
        let shortlinkUrl = $("link[rel='shortlinkUrl']").href.split('?')[0];
        let imageSrc = $("link[rel='image_src']").href;

        let ogSiteName = $("meta[property='og:site_name']").content;
        let ogUrl = $("meta[property='og:url']").content.split('&')[0];
        let ogTitle = $("meta[property='og:title']").content;
        let ogImage = $("meta[property='og:image']").content;
        let ogDescription = $("meta[property='og:description']").content;

        let duration = $("meta[itemprop='duration']").content.slice(2, -1);
        let authorUrl = $("span[itemprop='author'] > link[itemprop='url']").href;
        let authorName = $("span[itemprop='author'] > link[itemprop='name']").getAttribute("content"); // Dot notation doesn't work here
        let thumbnailUrl = $("link[itemprop='thumbnailUrl']").href;
        let datePublished = $("meta[itemprop='datePublished']").content;
        let uploadDate = $("meta[itemprop='uploadDate']").content;
        let genre = $("meta[itemprop='genre']").content;

        const timeStr = (time) => time.toString().padStart(2, '0');
        let [minutes, seconds] = duration.split("M");
        let hours = Math.floor(Number(minutes) / 60);
        minutes = (Number(minutes) % 60);
        duration = `${timeStr(minutes)}:${timeStr(seconds)}`;
        if (hours > 0) {duration = `${timeStr(hours)}:` + duration}

        return {
            canonical,
            title,
            url,
            description,
            keywords,
            shortlinkUrl,
            imageSrc,
    
            ogSiteName,
            ogUrl,
            ogTitle,
            ogImage,
            ogDescription,
    
            duration,
            channelUrl: authorUrl,
            channel: authorName,
            thumbnailUrl,
            datePublished,
            uploadDate,
            genre,
        };
    } catch(err) { console.warn(err); }

    return null;
}
module.exports = my_function;