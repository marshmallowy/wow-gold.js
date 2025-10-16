import Decimal from "decimal.js";
import { Gold } from "./gold";

interface OptionallyNegative {
    /**
     * If present, the string is prefixed with `-` to indicate a negative value.
     */
    neg?: '-';
};

interface OptionalGoldNotation {
    /**
     * Optional gold notation.  
     * If present, the value should be multiplied by:
     * - `g`: Standard Gold - 1x
     * - `k`: Thousands - 1,000x
     * - `m`: Millions - 1,000,000x
     * - `b`: Billions - 1,000,000,000x
     */
    goldNotation?: 'g' | 'k' | 'm' | 'b';
};

interface ExpressionFunctions<Groups extends Record<string, any>> {

    /**
     * Attempts to match the specified string with this expression.
     * @param value The string to match.
     * @returns the match groups if a match is returned; undefined if otherwise.
     */
    match: (value: string) => ReturnType<typeof _match<Groups>>;

    /**
     * Test the specified string against this expression and see if it matches.
     * @param value The string to test.
     * @returns Returns true if it's a match; false if otherwise.
     */
    test: (value: string) => ReturnType<typeof _test>;

    /**
     * Attempts to match the specified value against this expression and then parses it as a total copper value.
     * @param value The value to match and parse.
     * @returns the total copper as a {@link Decimal}, parsed from the specified value.
     */
    parseCopper: (value: string) => Decimal | undefined;

};

export interface GoldExpression<Groups extends Record<string, any> = Record<string, any>> extends ExpressionFunctions<Groups> {
    expression: RegExp;
    Groups: Groups;
}

// -- -- -- --

type GenericGoldGroups = OptionallyNegative & OptionalGoldNotation & {
    gold: string;
    fractionalGold?: string;
} & Partial<ExplicitSilverAndCopperGroups> & Partial<ExplicitSilverOrCopperGroups>;

/**
 * A generic gold string expression.
 * - The gold amount is always present if a match is returned.
 * - The fractional gold amount is optional and may not be present.
 * - The gold notation is optional and may not be present (gkmb).
 * - Silver and/or copper are optional. One or both may or may not be present; unless:
 *   - Neither silver nor copper will be present if the gold is fractional.
 *   - Neither silver nor copper will be present if the gold notation is not present.
 */
export type GenericGold = GoldExpression<GenericGoldGroups> & {
    /**
     * The uncombined parts that make up a generic gold expression.
     * 
     * 1. The suffix parts should be combined as `(?:(A | B){0,1})`
     * 2. Add the combined suffix to the end of the gold expression
     * 3. Wrap the parts as `(?:(?<=^)${gold}${suffix}(?=$))`
     * 
     * @note Not intended to be used as standalone expressions.
     */
    Parts: {
        gold: RegExp;
        silverAndCopperSuffix: RegExp;
        silverOrCopperSuffix: RegExp;
    }
};

// -- -- -- --

type ExplicitGoldGroups = OptionallyNegative & Omit<
    GenericGoldGroups,
    keyof ExplicitSilverAndCopperGroups | keyof ExplicitSilverOrCopperGroups
>;

/**
 * Matches with ONLY the gold segment, with or without its notation.
 * - The fractional gold amount is optional and may or may not be present.
 * - The gold notation is optional and may or may not be present (gkmb).
 */
export type ExplicitGold = GoldExpression<ExplicitGoldGroups>;


// -- -- -- --


/**
 * Explicitly matches ONLY silver AND copper together, within the same string.
 * - Both silver and copper must include their notations (s/c).
 * - Each have a min/max value of -99-99; only two digits per segment.
 * - Not fractional.
 */
type ExplicitSilverAndCopperGroups = OptionallyNegative & {
    and_silver: string;
    and_copper: string;
};

/**
 * Explicitly matches ONLY silver AND copper together, within the same string.
 * - Both silver and copper must include their notations (s/c).
 * - Each have a min/max value of -99-99; only two digits per segment.
 * - Not fractional.
 */
export type ExplicitSilverAndCopper = GoldExpression<ExplicitSilverAndCopperGroups>;


// -- -- -- --


/**
 * Explicitly matches ONLY silver OR copper together, within the same string.
 * - Both silver and copper must include their notations (s/c).
 * - Each have a min/max value of -99-99; only two digits per segment.
 * - Not fractional.
 */
type ExplicitSilverOrCopperGroups = OptionallyNegative & {
    or_silver?: string;
    or_copper?: string;
};

/**
 * Explicitly matches ONLY silver AND copper together, within the same string.
 * - Both silver and copper must include their notations (s/c).
 * - Each have a min/max value of -99-99; only two digits per segment.
 * - Not fractional.
 */
export type ExplicitSilverOrCopper = GoldExpression<ExplicitSilverOrCopperGroups>;


// -- -- -- --


type ExplicitCopperGroups = OptionallyNegative & {
    explicitCopper: string;
    fractionalCopper?: string;
};

/**
 * Matches with ONLY copper in an explicit context, allowing fractional values of any amount.
 * - Must include its copper notation (c).
 * - Can be smaller/larger than -99-99.
 */
export type ExplicitCopper = GoldExpression<ExplicitCopperGroups>;


// -- -- -- --


type AnyGoldGroups = Partial<GenericGoldGroups & ExplicitSilverAndCopperGroups & ExplicitSilverOrCopperGroups & ExplicitCopper>;

/**
 * Matches agaist any type of valid gold string.
 * - GenericGold
 * - ExplicitGold
 * - ExplicitSilverAndCopper
 * - ExplicitSilverOrCopper
 * - ExplicitCopper
 */
type AnyGold = GoldExpression<AnyGoldGroups>;

// -- -- -- --

export type GoldExpressions = {

    ExplicitCopper: ExplicitCopper;
    ExplicitSilverAndCopper: ExplicitSilverAndCopper;
    ExplicitSilverOrCopper: ExplicitSilverOrCopper;
    GenericGold: GenericGold;
    ExplicitGold: ExplicitGold;

}

// -- -- -- --


function _match<Groups extends Record<string, any>>(exp: RegExp, str: string): Groups | undefined {
    const match = str.match(exp);
    if (match) return match.groups as Groups;
    return undefined;
}

function _test(exp: RegExp, str: string) {
    return exp.test(str);
}


// -- -- -- --


export const GenericGold = {} as GenericGold;
GenericGold.Parts = {
    gold: /(?:(?<neg>[-]){0,1}(?<gold>(?:\d{1,3}(?:(?:[,]\d{3})+|(?:[_]\d{3})+))|\d+)(?:[.](?<fractionalGold>\d+)){0,1}(?<goldNotation>[gkmb]){0,1})/,
    silverAndCopperSuffix: /(?:(?<=(?<![.]\d+)[gkmb])[ ]*(?<and_silver>\d{1,2})[s][ ]*(?<and_copper>\d{1,2})[c])/,
    silverOrCopperSuffix: /(?:(?<=(?<![.]\d+)[gkmb])[ ]*(?:(?<or_silver>\d{1,2})[s]|(?<or_copper>\d{1,2})[c]))/
} as const;
GenericGold.expression = (() => {
    const goldBaseSuffixParts = [
        GenericGold.Parts.silverAndCopperSuffix.source,
        GenericGold.Parts.silverOrCopperSuffix.source,
    ].join('|');
    const genericGoldSuffixExpParts = new RegExp(`(?:${goldBaseSuffixParts}){0,1}`);

    return new RegExp(`(?<=^)(?:${GenericGold.Parts.gold.source}${genericGoldSuffixExpParts.source})(?=$)`);
})();
GenericGold.parseCopper = (value: string) => {
    if (!value) return undefined;
    const match = GenericGold.match(value.trim());
    if (match) {

        let totalCopper = new Decimal(0);
        if (match.gold) {

            const goldNotationMult = match.goldNotation ? {
                ['g']: Gold.COPPER_PER_GOLD,
                ['k']: Gold.COPPER_PER_THOUSAND_GOLD,
                ['m']: Gold.COPPER_PER_MILLION_GOLD,
                ['b']: Gold.COPPER_PER_BILLION_GOLD,
            }[match.goldNotation] : Gold.COPPER_PER_GOLD;
            totalCopper = new Decimal(`${match.neg ?? ""}${match.gold.replace(/[,_]/g, '')}`).mul(goldNotationMult);
            
            if (match.fractionalGold) {
                totalCopper = totalCopper.add(
                    new Decimal(`${match.neg ?? ""}0.${match.fractionalGold}`).mul(Gold.COPPER_PER_GOLD)
                )
            }

        }

        const silver = match.and_silver ?? match.or_silver;
        const copper = match.and_copper ?? match.or_copper;

        totalCopper = silver ? totalCopper.add(new Decimal(`${match.neg ?? ""}${silver}`).mul(Gold.COPPER_PER_SILVER)) : totalCopper;
        totalCopper = copper ? totalCopper.add(new Decimal(`${match.neg ?? ""}${copper}`).mul(Gold.COPPER_PER_COPPER)) : totalCopper;

        return totalCopper;
    }
    return undefined;
}


export const ExplicitGold = {} as ExplicitGold;
ExplicitGold.expression = new RegExp(`(?<=^)${GenericGold.Parts.gold.source}(?=$)`);
ExplicitGold.parseCopper = (value: string) => {
    if (!value) return undefined;
    const match = ExplicitGold.match(value.trim());
    if (match) {

        let totalCopper = new Decimal(0);

        const goldNotationMult = match.goldNotation ? {
            ['g']: Gold.COPPER_PER_GOLD,
            ['k']: Gold.COPPER_PER_THOUSAND_GOLD,
            ['m']: Gold.COPPER_PER_MILLION_GOLD,
            ['b']: Gold.COPPER_PER_BILLION_GOLD,
        }[match.goldNotation] : Gold.COPPER_PER_GOLD;
        totalCopper = new Decimal(`${match.neg ?? ""}${match.gold.replace(/[,_]/g, '')}`).mul(goldNotationMult);
        
        if (match.fractionalGold) {
            totalCopper = totalCopper.add(
                new Decimal(`${match.neg ?? ""}0.${match.fractionalGold}`).mul(Gold.COPPER_PER_GOLD)
            )
        }

        return totalCopper;
    }
    return undefined;
}


export const ExplicitSilverAndCopper = {} as ExplicitSilverAndCopper;
ExplicitSilverAndCopper.expression = /(?:(?<=^)(?<neg>[-]){0,1}(?:(?<and_silver>\d{1,2})[s][ ]*(?<and_copper>\d{1,2})[c])(?=$))/;
ExplicitSilverAndCopper.parseCopper = (value: string) => {
    if (!value) return undefined;
    const match = ExplicitSilverAndCopper.match(value.trim());
    if (match) {
        const silver = match.and_silver ? new Decimal(match.and_silver).mul(Gold.COPPER_PER_SILVER) : 0;
        const copper = match.and_copper ? new Decimal(match.and_copper).mul(Gold.COPPER_PER_COPPER) : 0;

        return new Decimal(`${match.neg ?? ""}${silver}`).add(copper);
    }
    return undefined;
}


export const ExplicitSilverOrCopper = {} as ExplicitSilverOrCopper;
ExplicitSilverOrCopper.expression = /(?:(?<=^)(?<neg>[-]){0,1}(?:(?<or_silver>\d{1,2})[s]|(?<or_copper>\d{1,2})[c])(?=$))/;
ExplicitSilverOrCopper.parseCopper = (value: string) => {
    if (!value) return undefined;
    const match = ExplicitSilverOrCopper.match(value.trim());
    if (match) {
        const silver = match.or_silver ? new Decimal(match.or_silver).mul(Gold.COPPER_PER_SILVER) : 0;
        const copper = match.or_copper ? new Decimal(match.or_copper).mul(Gold.COPPER_PER_COPPER) : 0;

        return new Decimal(`${match.neg ?? ""}${silver}`).add(copper);
    }
    return undefined;
}


export const ExplicitCopper = {} as ExplicitCopper;
ExplicitCopper.expression = /(?:(?<=^)(?<neg>[-]){0,1}(?<explicitCopper>(?:\d{1,3}(?:(?:[,]\d{3})+|(?:[_]\d{3})+))|\d+)(?:[.](?<fractionalCopper>\d+)){0,1}[c](?=$))/;
ExplicitCopper.parseCopper = (value: string) => {
    if (!value) return undefined;
    const match = ExplicitCopper.match(value.trim());
    if (match) {
        const fractionalCopperStr = match.fractionalCopper ? `.${match.fractionalCopper}` : "";
        const totalCopper = new Decimal(`${match.neg ?? ""}${match.explicitCopper.replace(/[,_]/g, '')}${fractionalCopperStr}`);
        return totalCopper
    }
    return undefined;
}


const AnyGold = {} as AnyGold;
AnyGold.expression = / /; // TODO: Fix me


// -- -- -- --


// Add the matcher functions to each gold expression.
[
    GenericGold,
    ExplicitGold,
    ExplicitSilverAndCopper,
    ExplicitSilverOrCopper,
    ExplicitCopper,
    // TODO: AnyGold
].forEach(goldExpression => {
    goldExpression.match = (str: string) => _match(goldExpression.expression, str);
    goldExpression.test = (str: string) => _test(goldExpression.expression, str);
})