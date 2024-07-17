import { JSDOM } from 'jsdom';

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
        let link = links[i].href
        if(link.startsWith('/')){
            link = `${baseURL}${link}`
        }
        urls.push(link)
    }
    return urls
}
export { getURLsFromHTML };