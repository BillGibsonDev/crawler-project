import { test, expect } from "@jest/globals";
import {  normalizeURL, getURLsFromHTML } from "./crawl.js";

test('normalized url without http/s', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toBe(expected)
})

test('normalize url trailing slash', () => {
    const input = 'http://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toBe(expected)
})

test('normalize url capitals', () => {
    const input = 'http://BLOG.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toBe(expected)
})

// get URLs
test('getURLsFromHTML', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="http://blog.boot.dev/path/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["http://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative URLs converted to absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "http://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["http://blog.boot.dev/path"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML invalid', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="invalid">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "http://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML multiple a tags', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="http://blog.boot.dev/path/">
                Boot.dev Blog
            </a>
            <a href="http://blog.boot.dev/path">
                Boot.dev Blog
            </a>
            <a href="http://blog.boot.dev/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["http://blog.boot.dev/path/", "http://blog.boot.dev/path", "http://blog.boot.dev/"]
    expect(actual).toEqual(expected)
})

