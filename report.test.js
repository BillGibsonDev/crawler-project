import { test, expect } from "@jest/globals";
import { sortPages } from "./report.js";

test('sort pages', () => {
    const input = {
        'https://wagslane.dev/path': 1,
        'https://wagslane.dev': 3
    }
    const actual = sortPages(input)
    const expected = [
        ['https://wagslane.dev', 3],
        ['https://wagslane.dev/path', 1]
    ]
    expect(actual).toEqual(expected)
})

test('sort pages 5 pages', () => {
    const input = {
        'https://wagslane.dev/path': 1,
        'https://wagslane.dev': 3,
        'https://wagslane.dev/path2': 2,
        'https://wagslane.dev/path4': 4,
        'https://wagslane.dev/path5': 7
    }
    const actual = sortPages(input)
    const expected = [
        ['https://wagslane.dev/path5', 7],
        ['https://wagslane.dev/path4', 4],
        ['https://wagslane.dev', 3],
        ['https://wagslane.dev/path2', 2],
        ['https://wagslane.dev/path', 1]
    ]
    expect(actual).toEqual(expected)
})