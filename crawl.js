import { JSDOM } from 'jsdom';

async function crawlPage(baseURL, currentURL, pages){

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname){
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)

    if(pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`)

    try {
        const response = await fetch(currentURL)
        if(response.status > 399){
            console.log(`error fetching: ${response.status} on page ${currentURL}`)
            return pages
        }

        const contentType = response.headers.get('content-type')
        if(!contentType.includes("text/html")){
            console.log(`error fetching: response not text/html`)
            return pages
        }

        const htmlBody = await response.text()
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for ( const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages)
        }

    } catch(err){
        console.log(`error fetching: ${err.message} on page ${currentURL}`)
    }
    return pages
}
export { crawlPage };

function normalizeURL(urlString){
    try {
        const urlObj = new URL(urlString)
        const hostPath = `${urlObj.hostname}${urlObj.pathname}`
        if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
            return hostPath.slice(0, -1)
        } 
        return hostPath
    } catch (error) {
        console.log(error.message)
    }
}
export { normalizeURL };

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')
    for (let i = 0; i < links.length; i++){
        if(links[i].href.startsWith('/')){
            try {
                const urlObj = new URL(`${baseURL}${links[i].href}`)
                urls.push(urlObj.href)
            } catch(err){
                console.log(`error with relative url: ${err.message}`)
            }
        } else {
            try {
                const urlObj = new URL(`${links[i].href}`)
                urls.push(urlObj.href)
            } catch(err){
                console.log(`error with absolute url: ${err.message}`)
            }
        }
    }
    return urls
}
export { getURLsFromHTML };