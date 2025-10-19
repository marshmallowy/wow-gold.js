import Decimal from "decimal.js";
import { InvalidGoldExpressionError } from "./errors/invalid-gold-expression-error";

export interface NegativeGoldExpressionMatchGroup {
    /**
     * The gold expression is prefixed with `-` to indicate a negative value.
     */
    neg: '-';
};

export interface GoldNotationGoldExpressionMatchGroup {
    /**
     * Where a gold value has a specific notation, it should be multiplied by:
     * - `g`: Standard Gold - 1x
     * - `k`: Thousands - 1,000x
     * - `m`: Millions - 1,000,000x
     * - `b`: Billions - 1,000,000,000x
     */
    goldNotation: 'g' | 'k' | 'm' | 'b';
};

export type GoldExpressionTypeMatchGroups = Record<string, any> | undefined

export interface GoldExpressionTypeMatchable<MatchGroups extends GoldExpressionTypeMatchGroups> {

    /**
     * The Regular Expresssion used to validate a gold expression string.
     */
    regexp: RegExp;

}

export type GoldExpressionTypeMatchableResolvable<MatchGroups extends GoldExpressionTypeMatchGroups = GoldExpressionTypeMatchGroups> = GoldExpressionTypeMatchable<MatchGroups> | RegExp;

/**
 * The parser callback function used to convert a gold expression value into a total amount of _**copper**_. 
 * 
 * Attempt to parse the specified gold expression value using this expression type,  
 * parsing the total amount of _**copper**_ from the expression.
 * 
 * @param expression The gold expression value to match and parse.
 * @param expressionType The gold expression type to parse with.
 * @param doNotTrim Whether or not to disable performing `.trim` on the gold expression value before matching. Default: `false`
 * @returns the parsed, total amount of _**copper**_ as a {@link Decimal} instance, if the match is successful; `undefined` if otherwise.
 * @throws <br>
 * - {@link InvalidGoldExpressionError} if `null` or `undefined` are provided as the gold expression value (assuming correct parser implementation).
 */
export type GoldExpressionParser<MatchGroups extends GoldExpressionTypeMatchGroups> = (expression: any, expressionType: GoldExpressionTypeMatchableResolvable<MatchGroups>, doNotTrim: boolean) => Decimal | undefined;

export interface GoldExpressionTypeParsable<MatchGroups extends GoldExpressionTypeMatchGroups> extends GoldExpressionTypeMatchable<MatchGroups> {

    /**
     * Attempt to parse the specified gold expression value using this expression type,  
     * parsing the total amount of _**copper**_ from the expression.
     * 
     * @param expression The gold expression value to match and parse.
     * @param doNotTrim Whether or not to disable performing `.trim` on the gold expression value before matching. Default: `false`
     * @returns the parsed, total amount of _**copper**_ as a {@link Decimal} instance, if the match is successful; `undefined` if otherwise.
     * @throws <br>
     * - {@link InvalidGoldExpressionError} if `null` or `undefined` are provided as the gold expression value (assuming correct parser implementation).
     */
    parseCopper: (expression: any, doNotTrim: boolean) => ReturnType<GoldExpressionParser<MatchGroups>>;

}


// -- -- -- --


export class GoldExpressionType<MatchGroups extends GoldExpressionTypeMatchGroups> implements GoldExpressionTypeParsable<MatchGroups> {

    private readonly _regexp: RegExp;
    private readonly parser: GoldExpressionParser<MatchGroups>;

    private constructor(regexp: RegExp, parser: GoldExpressionParser<MatchGroups>) {
        this._regexp = regexp;
        this.parser = parser;
    }

    public get regexp() { return this._regexp; }

    /**
     * Attempt to match the specified gold expression value with this expression type.
     * 
     * @note The gold expression value is converted to a string before attempting the match, using `.toString()`.
     * 
     * @param expression The gold expression value to match.
     * @param doNotTrim Whether or not to disable performing `.trim` on the gold expression value before matching. Default: `false`
     * @returns the {@link RegExp} match groups if the match is successful; `undefined` if otherwise.
     * @throws <br>
     * - {@link InvalidGoldExpressionError} if `null` or `undefined` are provided as the gold expression value.
     */
    public match(expression: string, doNotTrim: boolean = false) {
        return GoldExpressionType.match<MatchGroups>(expression, this, doNotTrim);
    }

    /**
     * Test the specified gold expression value with this expression type.
     * 
     * @note The gold expression value is converted to a string before attempting the match, using `.toString()`.
     * 
     * @param expression The gold expression value to test.
     * @param doNotTrim Whether or not to disable performing `.trim` on the gold expression value before matching. Default: `false`
     * @returns `true` if the gold expression matches the type; `false` if otherwise.
     * @throws <br>
     * - {@link InvalidGoldExpressionError} if `null` or `undefined` are provided as the gold expression value.
     */
    public test(expression: string, doNotTrim: boolean = false) {
        return GoldExpressionType.test(expression, this, doNotTrim);
    }

    public parseCopper(expression: any, doNotTrim: boolean = false) {
        return this.parser(expression, this, doNotTrim);
    }


    // -- -- -- --


    /**
     * Test the specified gold expression value with the given expression type.
     * 
     * @note The gold expression value is converted to a string before attempting the match, using `.toString()`.
     * 
     * @param expression The gold expression value to test.
     * @param expressionType The gold expression type to test with.
     * @param doNotTrim Whether or not to disable performing `.trim` on the gold expression value before matching. Default: `false`
     * @returns `true` if the gold expression matches the type; `false` if otherwise.
     */
    public static test(expression: any, expressionType: GoldExpressionTypeMatchableResolvable, doNotTrim: boolean = false) {
        if (expression === null || expression === undefined) return false;
        expression = doNotTrim ? expression.toString() : expression.toString().trim();

        expressionType = expressionType instanceof RegExp ? expressionType : expressionType.regexp;
        return expressionType.test(expression as string);
    }

    /**
     * Attempt to match the specified gold expression value with the given expression type.
     * 
     * @note The gold expression value is converted to a string before attempting the match, using `.toString()`.
     * 
     * @param expression The gold expression value to match.
     * @param expressionType The gold expression type to match with.
     * @param doNotTrim Whether or not to disable performing `.trim` on the gold expression value before matching. Default: `false`
     * @returns the {@link RegExp} match groups if the match is successful; `undefined` if otherwise.
     * @throws <br>
     * - {@link InvalidGoldExpressionError} if `null` or `undefined` are provided as the gold expression value.
     */
    public static match<MatchGroups extends GoldExpressionTypeMatchGroups>(expression: any, expressionType: GoldExpressionTypeMatchableResolvable<MatchGroups>, doNotTrim: boolean = false) {
        if (expression === null || expression === undefined) throw InvalidGoldExpressionError.fromNullOrUndefined(expression, expressionType);
        expression = doNotTrim ? expression.toString() : expression.toString().trim();

        expressionType = expressionType instanceof RegExp ? expressionType : expressionType.regexp;
        const match = expression.match(expressionType);
        if (match) return match.groups as MatchGroups;
        return undefined;
    }


    // -- -- -- --


    /**
     * Create a new {@link GoldExpressionType}.
     * 
     * @param regexp The Regular Expresssion used to validate a gold expression string.
     * @param parser The parser function used to convert a gold expression into a total amount of _**copper**_.
     * @returns the new {@link GoldExpressionType} instance.
     */
    public static create<MatchGroups extends GoldExpressionTypeMatchGroups>(regexp: RegExp, parser: GoldExpressionParser<MatchGroups>) {
        return new GoldExpressionType<MatchGroups>(regexp, parser);
    }

}