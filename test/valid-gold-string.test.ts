import { describe, expect, test } from '@jest/globals';
import { Gold } from '../src/gold';

const withNegs = (arr: string[]) => [...arr, ...arr.map(v => `-${v}`)];

describe("Valid Gold-String Match", () => {

    const explicitCopper = {
        allow: withNegs([
            "29475839c",
            "29475839.9999876234c",
            "29,475,839c",
            "29,475,839.9999876234c",
            "29_475_839c",
            "29_475_839.9999876234c",
        ]),
        disallow: withNegs([
            "",
            "1222",
            "1222g",
            "1222k",
            "1222m",
            "1222b",
            "1222.122",
            "1222.234g",
            "1222.324k",
            "1222.234m",
            "1222.24b",
            "923s",
            "923s 234c",
            "10g 29,475,839c",
            "1s 29,475,839.9999876234c",
            "1c 29,475,839.9999876234c",
        ])
    }

    describe("Explicit Copper", () => {

        describe("Allow", () => {
            for (const goldString of explicitCopper.allow) {
                test(`Allow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'ExplicitCopper')).toBe(true);
                })
            }
        })

        describe("Disallow", () => {
            for (const goldString of explicitCopper.disallow) {
                test(`Disallow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'ExplicitCopper')).toBe(false);
                })
            }
        })

    })

    // -- -- --

    const explicitSilverAndCopper = {
        allow: withNegs([
            "12s 34c",
            "01s 02c",
        ]),
        disallow: withNegs([
            "",
            "12c 34s ",
            "34c 12s",
            "123s 456c",
            "123g",
            "123g 1c",
            "123g 2s",
            "123g 3s 2c",
        ])
    }

    describe("Explicit Silver AND Copper", () => {

        describe("Allow", () => {
            for (const goldString of explicitSilverAndCopper.allow) {
                test(`Allow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'ExplicitSilverAndCopper')).toBe(true);
                })
            }
        })

        describe("Disallow", () => {
            for (const goldString of explicitSilverAndCopper.disallow) {
                test(`Disallow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'ExplicitSilverAndCopper')).toBe(false);
                })
            }
        })

    })

    // -- -- --

    const explicitSilverOrCopper = {
        allow: withNegs([
            "12s",
            "01s",
            "02c",
        ]),
        disallow: withNegs([
            "",
            "12s 34c",
            "01s 02c",
            "12c 34s ",
            "34c 12s",
            "123s 456c",
            "123g",
            "123g 1c",
            "123g 2s",
            "123g 3s 2c",
        ])
    }

    describe("Explicit Silver OR Copper", () => {

        describe("Allow", () => {
            for (const goldString of explicitSilverOrCopper.allow) {
                test(`Allow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'ExplicitSilverOrCopper')).toBe(true);
                })
            }
        })

        describe("Disallow", () => {
            for (const goldString of explicitSilverOrCopper.disallow) {
                test(`Disallow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'ExplicitSilverOrCopper')).toBe(false);
                })
            }
        })

    })

    // -- -- --

    const explicitGold = {
        allow: withNegs([
            "1",
            "1g",
            "1k",
            "1m",
            "1b",
            "123",
            "123g",
            "123k",
            "123m",
            "123b",
            "0001",
            "0001g",
            "0001k",
            "0001m",
            "0001b",
            "000123",
            "000123g",
            "000123k",
            "000123m",
            "000123b",
            "1.1234",
            "1.1234g",
            "1.1234k",
            "1.1234m",
            "1.1234b",
            "123.1234",
            "123.1234g",
            "123.1234k",
            "123.1234m",
            "123.1234b",
            "0001.1234",
            "0001.1234g",
            "0001.1234k",
            "0001.1234m",
            "0001.1234b",
            "000123.1234",
            "000123.1234g",
            "000123.1234k",
            "000123.1234m",
            "000123.1234b"
        ]),
        disallow: withNegs([
            "",
            "1s",
            "1c",
            "12s 34c",
            "01s 02c",
            "12c 34s ",
            "34c 12s",
            "123s 456c",
            "123 1s",
            "123 1c",
            "123 1s 2c",

            "123g 1c",
            "123g 2s",
            "123g 3s 2c",
            "123k 1c",
            "123k 2s",
            "123k 3s 2c",
            "123m 1c",
            "123m 2s",
            "123m 3s 2c",
            "123b 1c",
            "123b 2s",
            "123b 3s 2c",

            "123.123g 1c",
            "123.123g 2s",
            "123.123g 3s 2c",
            "123.123k 1c",
            "123.123k 2s",
            "123.123k 3s 2c",
            "123.123m 1c",
            "123.123m 2s",
            "123.123m 3s 2c",
            "123.123b 1c",
            "123.123b 2s",
            "123.123b 3s 2c",

            "000123.123g 1c",
            "000123.123g 2s",
            "000123.123g 3s 2c",
            "000123.123k 1c",
            "000123.123k 2s",
            "000123.123k 3s 2c",
            "000123.123m 1c",
            "000123.123m 2s",
            "000123.123m 3s 2c",
            "000123.123b 1c",
            "000123.123b 2s",
            "000123.123b 3s 2c",
        ])
    }

    describe("Explicit Gold", () => {

        describe("Allow", () => {
            for (const goldString of explicitGold.allow) {
                test(`Allow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'ExplicitGold')).toBe(true);
                })
            }
        })

        describe("Disallow", () => {
            for (const goldString of explicitGold.disallow) {
                test(`Disallow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'ExplicitGold')).toBe(false);
                })
            }
        })

    })

    // -- -- --

    const genericGold = {
        allow: withNegs([
            "1",
            "1g",
            "1k",
            "1m",
            "1b",
            "123",
            "123g",
            "123k",
            "123m",
            "123b",
            "0001",
            "0001g",
            "0001k",
            "0001m",
            "0001b",
            "000123",
            "000123g",
            "000123k",
            "000123m",
            "000123b",
            "1.1234",
            "1.1234g",
            "1.1234k",
            "1.1234m",
            "1.1234b",
            "123.1234",
            "123.1234g",
            "123.1234k",
            "123.1234m",
            "123.1234b",
            "0001.1234",
            "0001.1234g",
            "0001.1234k",
            "0001.1234m",
            "0001.1234b",
            "000123.1234",
            "000123.1234g",
            "000123.1234k",
            "000123.1234m",
            "000123.1234b",
            "1g 23s",
            "1k 23s",
            "1m 23s",
            "1b 23s",
            "123g 23s",
            "123k 23s",
            "123m 23s",
            "123b 23s",
            "0001g 23s",
            "0001k 23s",
            "0001m 23s",
            "0001b 23s",
            "000123g 23s",
            "000123k 23s",
            "000123m 23s",
            "000123b 23s",
            "1g 23s 45c",
            "1k 23s 45c",
            "1m 23s 45c",
            "1b 23s 45c",
            "123g 23s 45c",
            "123k 23s 45c",
            "123m 23s 45c",
            "123b 23s 45c",
            "0001g 23s 45c",
            "0001k 23s 45c",
            "0001m 23s 45c",
            "0001b 23s 45c",
            "000123g 23s 45c",
            "000123k 23s 45c",
            "000123m 23s 45c",
            "000123b 23s 45c",
        ]),
        disallow: withNegs([
            "",
            "1c",
            "12c",
            "1s",
            "12s",
            "1s 2c",
            "12s 34c",
            "123c",
            "123s",
            "2c 1s",
            "34c 12s",
            "456c 123s",

            "123 1s",
            "123 1c",
            "123 12s 34c",
            "123 34c 12s",
            "123 034c 012s",

            "123.123 1s",
            "123.123 1c",
            "123.123 12s 34c",
            "123.123 34c 12s",
            "123.123 034c 012s",

            "123.123k 1s",
            "123.123k 1c",
            "123.123k 12s 34c",
            "123.123k 34c 12s",
            "123.123k 034c 012s",

            "123.123m 1s",
            "123.123m 1c",
            "123.123m 12s 34c",
            "123.123m 34c 12s",
            "123.123m 034c 012s",

            "123.123b 1s",
            "123.123b 1c",
            "123.123b 12s 34c",
            "123.123b 34c 12s",
            "123.123b 034c 012s",
        ])
    }

    describe("Generic Gold", () => {

        describe("Allow", () => {
            for (const goldString of genericGold.allow) {
                test(`Allow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'GenericGold')).toBe(true);
                })
            }
        })

        describe("Disallow", () => {
            for (const goldString of genericGold.disallow) {
                test(`Disallow '${goldString}'`, () => {
                    expect(Gold.isGoldString(goldString, 'GenericGold')).toBe(false);
                })
            }
        })

    })


})