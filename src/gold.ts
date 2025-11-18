import Decimal from "decimal.js";
import { InfiniteValueError } from "./errors/infinite-value-error";
import { ValueNaNError } from "./errors/value-nan-error";
import { UnsafeNumberError } from "./errors/unsafe-number-error";
import { GoldExpressionType, GoldExpressionTypeMatchableResolvable, GoldExpressionTypeParsable } from "./gold-expression-type";
import { ExplicitCopperExpressionType } from "./gold-expression-types/explicit-copper-expression-type";
import { SilverAndCopperExpressionType } from "./gold-expression-types/silver-and-copper-expression-type";
import { SilverOrCopperExpressionType } from "./gold-expression-types/silver-or-copper-expression-type";
import { GenericGoldExpressionType } from "./gold-expression-types/generic-gold-expression-type";
import { ExplicitGoldExpressionType } from "./gold-expression-types/explicit-gold-expression-type";
import { ExplicitOnlyGoldExpressionType } from "./gold-expression-types/explicit-only-gold-expression-type";
import { InvalidGoldExpressionError } from "./errors/invalid-gold-expression-error";

type GoldMathValueResolvable = Gold | Decimal.Value;

interface GoldMath {

    /**
     * Add the specified amount to this {@link Gold} value.
     * 
     * @param amount The amount to add.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    add(amount: GoldMathValueResolvable, mutate: boolean): Gold;

    /**
     * Subtract the specified amount from this {@link Gold} value.
     * 
     * @param amount The amount to subtract.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    sub(amount: GoldMathValueResolvable, mutate: boolean): Gold;

    /**
     * Multiply this {@link Gold} value by the specified amount.
     * 
     * @param amount The amount to multiply by.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    mul(amount: GoldMathValueResolvable, mutate: boolean): Gold;

    /**
     * Divide this {@link Gold} value by the specified amount.
     * 
     * @param amount The amount to divide by.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    div(amount: GoldMathValueResolvable, mutate: boolean): Gold;

    /**
     * Get the absolute of this {@link Gold} value (makes it positive).
     * 
     * - MDN: [`Math.abs`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs)  
     * - decimal.js: [`.abs`](https://mikemcl.github.io/decimal.js/#abs)  
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    abs(mutate: boolean): Gold;

    /**
     * Round this {@link Gold} value to the nearest whole amount of _**copper**_.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    round(mutate: boolean): Gold;

    /**
     * Round this {@link Gold} value to the nearest whole amount of _**gold**_.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    roundToGold(mutate: boolean): Gold;

    /**
     * Round this {@link Gold} value down to the nearest whole amount of _**copper**_.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    floor(mutate: boolean): Gold;

    /**
     * Round this {@link Gold} value down to the nearest whole amount of _**gold**_.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    floorToGold(mutate: boolean): Gold;

    /**
     * Round this {@link Gold} value up to the nearest whole amount of _**copper**_.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    ceil(mutate: boolean): Gold;

    /**
     * Round this {@link Gold} value up to the nearest whole amount of _**gold**_.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    ceilToGold(mutate: boolean): Gold;

    /**
     * Truncate the _**copper**_ amount of this {@link Gold} value, removing any fractional digits.
     * 
     * - MDN: [`Math.trunc`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)
     * - decimal.js: [`.trunc`](https://mikemcl.github.io/decimal.js/#trunc)
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    trunc(mutate: boolean): Gold;

    /**
     * Clamp this {@link Gold} value between the minimum and maximum amounts.
     * 
     * @param min The minimum clamp value.
     * @param max The maximum clamp value.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    clamp(min: GoldMathValueResolvable, max: GoldMathValueResolvable, mutate: boolean): Gold;

    /**
     * Divide this {@link Gold} value by the specified amount and return the remainder.
     * 
     * - MDN: [`%/Remainder`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)
     * - decimal.js: [`.mod`](https://mikemcl.github.io/decimal.js/#mod)
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    mod(amount: GoldMathValueResolvable, mutate: boolean): Gold;

    // -- -- -- --

    /**
     * Check if this {@link Gold} value is equal to the specified amount.
     * 
     * @param amount The amount to compare with.
     * @returns `true` if this {@link Gold} value is equal to the amount specified; `false` if otherwise.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    isEqualTo(amount: GoldMathValueResolvable): boolean;

    /**
     * Check if this {@link Gold} value is less than the specified amount.
     * 
     * @param amount The amount to compare with.
     * @returns `true` if this {@link Gold} value is less than the amount specified; `false` if otherwise.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    isLessThan(amount: GoldMathValueResolvable): boolean;

    /**
     * Check if this {@link Gold} value is less than or equal to the specified amount.
     * 
     * @param amount The amount to compare with.
     * @returns `true` if this {@link Gold} value is less than or equal to the amount specified; `false` if otherwise.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    isLessThanOrEqualTo(amount: GoldMathValueResolvable): boolean;

    /**
     * Check if this {@link Gold} value is greater than the specified amount.
     * 
     * @param amount The amount to compare with.
     * @returns `true` if this {@link Gold} value is greater than the amount specified; `false` if otherwise.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    isGreaterThan(amount: GoldMathValueResolvable): boolean;

    /**
     * Check if this {@link Gold} value is greater than or equal to the specified amount.
     * 
     * @param amount The amount to compare with.
     * @returns `true` if this {@link Gold} value is greater than or equal to the amount specified; `false` if otherwise.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};  
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    isGreaterThanOrEqualTo(amount: GoldMathValueResolvable): boolean;

}

Decimal.config({ precision: 50 });

const ONE                       = new Decimal(1);
const HUNDRED                   = new Decimal(100);
const THOUSAND                  = new Decimal(1_000);
const MILLION                   = new Decimal(1_000_000);
const BILLION                   = new Decimal(1_000_000_000);

const COPPER_PER_COPPER         = new Decimal(1);
const COPPER_PER_SILVER         = COPPER_PER_COPPER.mul(HUNDRED);
const COPPER_PER_GOLD           = COPPER_PER_SILVER.mul(HUNDRED);

const COPPER_PER_THOUSAND_GOLD  = COPPER_PER_GOLD.mul(THOUSAND);
const COPPER_PER_MILLION_GOLD   = COPPER_PER_GOLD.mul(MILLION);
const COPPER_PER_BILLION_GOLD   = COPPER_PER_GOLD.mul(BILLION);

// -- -- --
// MySQL BigInts - https://dev.mysql.com/doc/refman/8.4/en/integer-types.html
// -- -- --

const MIN_MYSQL_SIGNED_BIGINT   = -9_223_372_036_854_775_808n;
const MAX_MYSQL_SIGNED_BIGINT   = 9_223_372_036_854_775_807n;

const MIN_MYSQL_UNSIGNED_BIGINT = 0n;
const MAX_MYSQL_UNSIGNED_BIGINT = 18_446_744_073_709_551_615n;

// -- -- -- --

const SEGMENT_NAMES = [ 'gold', 'silver', 'copper' ] as const;

const GOLD_NOTATIONS = ['g', 'k', 'm', 'b'] as const;

const SILVER_NOTATION = 's' as const;

const COPPER_NOTATION = 'c' as const;

const GoldNotationMultiplier: Record<Gold.GoldNotation, Decimal> = {

    ['g']: ONE,
    ['k']: THOUSAND,
    ['m']: MILLION,
    ['b']: BILLION

} as const;

const GoldNotationCopperMultiplier: Record<Gold.GoldNotation, Decimal> = {

    ['g']: COPPER_PER_GOLD,
    ['k']: COPPER_PER_THOUSAND_GOLD,
    ['m']: COPPER_PER_MILLION_GOLD,
    ['b']: COPPER_PER_BILLION_GOLD

} as const;

const SegmentCopperAmount: Record<Gold.SegmentName, Decimal> = {

    ['gold']: COPPER_PER_GOLD,
    ['silver']: COPPER_PER_SILVER,
    ['copper']: COPPER_PER_COPPER

} as const;


// -- -- -- --


const resolveGoldMathValue = (value: GoldMathValueResolvable): Decimal.Value => value instanceof Gold ? value.rawCopper : value;

export class Gold implements GoldMath {

    // --
    // -- -- Gold Expression Constants -- --
    // --

    /**
     * An array of gold segment names.
     */
    public static get SEGMENT_NAMES() { return [...SEGMENT_NAMES]; }

    /**
     * An array of gold notation characters in order of multiplier magnitude.
     */
    public static get GOLD_NOTATIONS() { return [...GOLD_NOTATIONS]; }

    /**
     * The character used to denote silver.
     */
    public static get SILVER_NOTATION() { return SILVER_NOTATION; }

    /**
     * The character used to denote copper.
     */
    public static get COPPER_NOTATION() { return COPPER_NOTATION; }

    public static get ExpressionType() {
        return {
            EXPLICIT_COPPER: ExplicitCopperExpressionType,
            SILVER_AND_COPPER: SilverAndCopperExpressionType,
            SILVER_OR_COPPER: SilverOrCopperExpressionType,
            EXPLICIT_GOLD: ExplicitGoldExpressionType,
            EXPLICIT_ONLY_GOLD: ExplicitOnlyGoldExpressionType,
            GENERIC_GOLD: GenericGoldExpressionType
        } as Gold.ExpressionType;
    }


    // --
    // -- -- Copper Amount Constants -- --
    // --


    /**
     * The total amount of copper in one copper (1).  
     * See: {@link Gold.getSegmentCopperAmount}
     */
    static get COPPER_PER_COPPER() { return COPPER_PER_COPPER; }

    /**
     * The total amount of copper in one silver (100).  
     * See: {@link Gold.getSegmentCopperAmount}
     */
    static get COPPER_PER_SILVER() { return COPPER_PER_SILVER; }

    /**
     * The total amount of copper in one gold (10,000).  
     * See: {@link Gold.getSegmentCopperAmount}
     */
    static get COPPER_PER_GOLD() { return COPPER_PER_GOLD; }

    /**
     * The total amount of copper in 1k gold (10,000,000).  
     * See: {@link Gold.getGoldNotationCopperMultiplier}
     */
    static get COPPER_PER_THOUSAND_GOLD() { return COPPER_PER_THOUSAND_GOLD; }

    /**
     * The total amount of copper in 1m gold (10,000,000,000).  
     * See: {@link Gold.getGoldNotationCopperMultiplier}
     */
    static get COPPER_PER_MILLION_GOLD() { return COPPER_PER_MILLION_GOLD; }

    /**
     * The total amount of copper in 1b gold (10,000,000,000,000).  
     * See: {@link Gold.getGoldNotationCopperMultiplier}
     */
    static get COPPER_PER_BILLION_GOLD() { return COPPER_PER_BILLION_GOLD; }


    // --
    // -- -- Copper Amount Limit Constants -- --
    // --


    /**
     * The minimum *signed* `number` that **Javascript** accurately supports.  
     * [`Number.MIN_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER): `−(2^53 − 1)` = `−9,007,199,254,740,991`
     */
    static get MIN_COPPER_INT() { return Number.MIN_SAFE_INTEGER; }

    /**
     * The maximum *signed* `number` that **Javascript** accurately supports.  
     * [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER): `(2^53) - 1` = `9,007,199,254,740,991` 
     */
    static get MAX_COPPER_INT() { return Number.MAX_SAFE_INTEGER; }

    /**
     * The minimum *signed* `BIGINT` that **MySQL** supports.  
     * [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) : `-2^63` = `-9,223,372,036,854,775,808`
     */
    static get MIN_COPPER_MYSQL_BIGINT() { return MIN_MYSQL_SIGNED_BIGINT; }

    /**
     * The maximum *signed* `BIGINT` that **MySQL** supports.  
     * [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html): `2^63-1` = `9,223,372,036,854,775,807`
     */
    static get MAX_COPPER_MYSQL_BIGINT() { return MAX_MYSQL_SIGNED_BIGINT; }

    // -- -- -- --

    /**
     * The minimum *signed* [`BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) that MySQL supports.  
     * [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html): `0` = `0`
     */
    static get MIN_COPPER_MYSQL_UBIGINT() { return MIN_MYSQL_UNSIGNED_BIGINT; }

    /**
     * The maximum *signed* [`BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) that MySQL supports.  
     * [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html): `(2^64) - 1` = `18,446,744,073,709,551,615`
     */
    static get MAX_COPPER_MYSQL_UBIGINT() { return MAX_MYSQL_UNSIGNED_BIGINT; }
    

    // --
    // -- -- Static Util Functions -- --
    // --


    /**
     * Get the multiplier that the specified gold notation represents.  
     * If an invalid, or no notation is specified, the default notation of `g` is used.
     * 
     * - `1g` = `1 gold`
     * - `1k` = `1,000 gold`
     * - `1m` = `1,000,000 gold`
     * - `1b` = `1,000,000,000 gold`
     * 
     * @param notation The notation to get the multiplier of.
     * @returns the notation multiplier.
     */
    public static getGoldNotationMultiplier(notation?: Gold.GoldNotation | (string & {})) {
        notation = (notation && GOLD_NOTATIONS.includes(notation as any)) ? notation : 'g';
        return GoldNotationMultiplier[notation as Gold.GoldNotation]
    }

    /**
     * Get the multiplier that the specified gold notation represents as a total amount of _**copper**_.  
     * If an invalid, or no notation is specified, the default notation of `g` is used.
     * 
     * - `1g` = `10,000 copper` | {@link Gold.COPPER_PER_GOLD}
     * - `1k` = `10,000,000 copper` | {@link Gold.COPPER_PER_THOUSAND_GOLD}
     * - `1m` = `10,000,000,000 copper` | {@link Gold.COPPER_PER_MILLION_GOLD}
     * - `1b` = `10,000,000,000,000 copper` | {@link Gold.COPPER_PER_BILLION_GOLD}
     * 
     * @param notation The notation to get the multiplier of.
     * @returns the notation multiplier.
     */
    public static getGoldNotationCopperMultiplier(notation?: Gold.GoldNotation | (string & {})) {
        notation = (notation && GOLD_NOTATIONS.includes(notation as any)) ? notation : 'g';
        return GoldNotationCopperMultiplier[notation as Gold.GoldNotation]
    }

    /**
     * Get the amount that the specified segment represents as a total amount of _**copper**_.  
     * If an invalid, or no segment name is specified, the default segment name of `copper` is used.
     * 
     * - `gold` = `10,000 copper` | {@link Gold.COPPER_PER_GOLD}
     * - `silver` = `100 copper` | {@link Gold.COPPER_PER_SILVER}
     * - `copper` = `1 copper` | {@link Gold.COPPER_PER_COPPER}
     * 
     * @param notation The notation to get the multiplier of.
     * @returns the notation multiplier.
     */
    public static getSegmentCopperAmount(segment?: Gold.SegmentName | (string & {})) {
        segment = (segment && SEGMENT_NAMES.includes(segment as any)) ? segment : 'copper';
        return SegmentCopperAmount[segment as Gold.SegmentName];
    }

    /**
     * Calculate the sum of the specified segment amounts and return the total amount as a total amount of _**copper**_.
     * 
     * @param segments A map containing the segment amounts.
     * @returns the total amount of _**copper**_.
     * @throws
     * - {@link ValueNaNError} if any segment amount is `NaN`.
     * - {@link InfiniteValueError} if any segment amount is infinite.
     * - {@link UnsafeNumberError} if any segment amount exceeds JavaScript's lower/upper safe integer bounds.
     * - {@link TypeError} if any segment is not a type of Decimal (decimal.js), BigInt or number.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     */
    public static getCopperFromTotal<T extends Partial<Gold.Segments>>(segments: T) {
        if ((segments.gold ?? segments.silver ?? segments.copper) === undefined) return new Decimal(0);
    
        let totalCopper = new Decimal(0);
        for (const segmentName of SEGMENT_NAMES) {
            if (!(segmentName in segments)) continue;

            const amount = segments[segmentName];

            if (amount instanceof Decimal) {
    
                if (!amount.isFinite()) throw new InfiniteValueError(`The amount of '${segmentName}' must not be infinite.`);
    
            } else if (typeof amount === 'number') {
    
                if (Number.isNaN(amount)) throw new ValueNaNError(`The value of '${segmentName}' is NaN.`);
                if (!Number.isFinite(amount)) throw new InfiniteValueError(`The amount of '${segmentName}' must not be infinite.`)
                if (amount < Number.MIN_SAFE_INTEGER || amount > Number.MAX_SAFE_INTEGER) throw new UnsafeNumberError(`The amount of '${segmentName}' falls below or exceeds JavaScript's lower/upper safe number bounds. Consider using Decimal (decimal.js) or BigInt when dealing with large numbers to preserve number precision.`);
    
            } else if (typeof amount === 'bigint') {
                // self-validated
            } else {
                throw new TypeError(`The value amount of '${segmentName}' must be a Decimal (decimal.js), BigInt or number.`);
            }
    
            totalCopper = totalCopper.add(new Decimal(amount).mul(Gold.getSegmentCopperAmount(segmentName)));


        }
    
        return totalCopper;
    }

    /**
     * Calculate the sum of specified segment amounts and return the total amount as a new {@link Gold} value.
     * 
     * @param segments A map containing the segment amounts.
     * @returns the new {@link Gold} value.
     * @throws
     * - {@link ValueNaNError} if any segment amount is `NaN`.
     * - {@link InfiniteValueError} if any segment amount is infinite.
     * - {@link UnsafeNumberError} if any segment amount exceeds JavaScript's lower/upper safe integer bounds.
     * - {@link TypeError} if any segment is not a type of Decimal (decimal.js), BigInt or number.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     */
    public static fromTotal<T extends Partial<Gold.Segments>>(segments: T) {
        try {
            return new Gold(Gold.getCopperFromTotal(segments));
        } catch (e) {
            throw e;
        }
    }

    /**
     * Calculate the sum of the specified amount(s) and return the result as a new {@link Gold} value.
     * 
     * @param amount The calculation amount(s).
     * @returns the {@link Gold} value, from the result of the summation.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @note 
     *      With all {@link Gold} math functions, the amount(s) specified is always assumed to  
     *      be an amount of _**copper**_, unless specifically provided as an instance of {@link Gold};   
     *      in which case, the internal copper amount of the {@link Gold} instance is used.
     * 
     */
    public static sum(...amount: GoldMathValueResolvable[]) {
        amount = [...amount].map(v => (v instanceof Gold ? v._rawCopper : v));
        const totalCopper = Decimal.sum(...amount as Decimal.Value[]);
        return new Gold(totalCopper);
    }


    // --
    // -- -- Static Gold Expression Functions -- --
    // --

    
    /**
     * Test the specified gold expression value to see if it's a valid gold expression.
     * 
     * @note The gold expression value is converted to a string before attempting the match, using `.toString()`.
     * 
     * @param expression The gold expression value to test.
     * @param expressionType A specific gold expression type to test with.  
     *                       - Use {@link Gold.ExpressionType} to choose a specific type.  
     *                       - Accepts any type that resolves to an instance of {@link RegExp} or; an object with a `regexp` property: `{ regexp: RegExp }`.  
     *                         See: {@link GoldExpressionTypeMatchableResolvable}
     *                       - If unprovided, the default gold expression types are used.
     * @param doNotTrim Whether or not to disable performing `.trim` on the gold expression value before matching. Default: `false`
     * @returns `true` if the value is a valid gold expression; `false` if otherwise.
     */
    public static isGoldExpression(expression: any, expressionType?: GoldExpressionTypeMatchableResolvable, doNotTrim: boolean = false) {
        if (expression === null || expression === undefined) return false;

        if (expressionType) {

            return GoldExpressionType.test(expression, expressionType, doNotTrim);

        } else {

            // Must be in this order to accurately cover all default expression types.
            const defaultExpressionTypes = [
                Gold.ExpressionType.EXPLICIT_COPPER,
                Gold.ExpressionType.SILVER_AND_COPPER,
                Gold.ExpressionType.SILVER_OR_COPPER,
                Gold.ExpressionType.GENERIC_GOLD
            ]
            for (const defaultExpressionType of defaultExpressionTypes) if (GoldExpressionType.test(expression, defaultExpressionType, doNotTrim)) return true;

        }

        return false;
    }

    /**
     * Attempt to parse the specified gold expression value using the given expression  
     * type, returning the parsed expression as a new instance of {@link Gold}.
     * 
     * @note The gold expression value is converted to a string before attempting the match, using `.toString()`.
     * 
     * @param expression The gold expression value to test.
     * @param expressionType A specific gold expression type to parse with.
     *                       - Use {@link Gold.ExpressionType} to choose a specific type.  
     *                       - Accepts any type that can be used as parsable expression type  
     *                         See: {@link GoldExpressionTypeParsable}
     *                       - If unprovided, the default gold expression types are used.
     * @param doNotTrim Whether or not to disable performing `.trim` on the gold expression value before matching. Default: `false`
     * @returns the new {@link Gold} value.
     * @throws
     * - {@link InvalidGoldExpressionError} if:  
     *   - `null` or `undefined` are provided as the gold expression value ; or
     *   - The specified gold expression could not be parsed.
     */
    public static parse(expression: any, expressionType?: GoldExpressionTypeParsable<any> | null, doNotTrim: boolean = false) {
        expressionType = expressionType ? expressionType : null;

        let totalCopper;
        if (expressionType) {

            totalCopper = expressionType.parseCopper(expression, doNotTrim);

        } else {

            // Must be in this order to accurately cover all default expression types.
            const defaultExpressionTypes = [
                Gold.ExpressionType.EXPLICIT_COPPER,
                Gold.ExpressionType.SILVER_AND_COPPER,
                Gold.ExpressionType.SILVER_OR_COPPER,
                Gold.ExpressionType.GENERIC_GOLD
            ]

            for (const defaultExpressionType of defaultExpressionTypes) {
                totalCopper = defaultExpressionType.parseCopper(expression, doNotTrim);
                if (totalCopper !== undefined) break;
            }

        }

        if (totalCopper === undefined) throw new InvalidGoldExpressionError(expression, expressionType);
        return new Gold(totalCopper);
    }



    // --
    // -- -- INSTANCE -- --
    // --



    private _rawCopper: Decimal;

    /**
     * Create a new {@link Gold} value instance.
     * @param rawCopper The total amount of copper contained in this {@link Gold} value.
     */
    constructor(rawCopper: Gold.SegmentResolvable) {
        try {
            this._rawCopper = Gold.getCopperFromTotal({ 'copper': rawCopper })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Get the total, raw amount of copper held by this {@link Gold}  
     * value, including any fractional copper amount.
     */
    public get rawCopper() { return this._rawCopper }

    /**
     * Whether or not this {@link Gold} value is negative.
     */
    public get isNegative() { return this._rawCopper.isNegative() }

    /**
     * Whether or not this {@link Gold} value is positive.
     */
    public get isPositive() { return this._rawCopper.isPositive() }

    /**
     * Whether or not this {@link Gold} value is zero (0).
     */
    public get isZero() { return this._rawCopper.isZero() }

    // -- -- -- --

    /**
     * Get the total amount of copper held by this {@link Gold} value, rounded to the nearest whole number.
     */
    public get totalCopper() { return this.isNegative ? this._rawCopper.ceil() : this._rawCopper.floor() }

    /**
     * Returns the segmented amount of gold as an absolute integer number.
     * 
     * @note Use {@link isNegative} to check if this {@link Gold} value is negative.
     */
    public get gold() {
        return this._rawCopper.abs().div(COPPER_PER_GOLD).floor().toNumber();
    }

    /**
     * Returns the segmented amount of silver as an absolute integer number between 0-99.
     * 
     * @note Use {@link isNegative} to check if this {@link Gold} value is negative.
     */
    public get silver() {
        return this._rawCopper.abs().mod(COPPER_PER_GOLD).div(COPPER_PER_SILVER).floor().toNumber();
    }

    /**
     * Returns the segmented amount of copper as an absolute integer number between 0-99.
     * 
     * @note Use {@link isNegative} to check if this {@link Gold} value is negative.
     */
    public get copper() {
        return this._rawCopper.abs().mod(COPPER_PER_SILVER).floor().toNumber();
    }
    /**
     * Get a **JavaScript** [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) representation of the total copper held by this {@link Gold} value.  
     * The total amount of copper is truncated, removing any amount of fractional copper.
     * 
     * @note Consider using {@link toMySQLBigInt()} to safely attempt convertion to a [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html).
     */
    public toBigInt() {
        return BigInt(this._rawCopper.trunc().toString());
    }

    /**
     * Attempt to get a **JavaScript** [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) representation of the total copper held by this {@link Gold} value.  
     * The total amount of copper is truncated, removing any amount of fractional copper.
     * 
     * @param isUnsigned Whether or not to convert to an unsigned MySQL BIGINT instead of signed. Default: `false` (*signed*)
     * @throws
     * - {@link UnsafeNumberError} if the total copper held by this gold value falls below/exceeds the minimum/maximum supported values for a [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html).
     */
    public toMySQLBigInt(isUnsigned: boolean = false) {
        const minCopper = isUnsigned ? MIN_MYSQL_UNSIGNED_BIGINT : MIN_MYSQL_SIGNED_BIGINT;
        const maxCopper = isUnsigned ? MAX_MYSQL_UNSIGNED_BIGINT : MAX_MYSQL_SIGNED_BIGINT;

        if (this._rawCopper.lessThan(minCopper)) throw new UnsafeNumberError("Cannot convert Gold to MySQL BIGINT: total copper amount falls below minimum MySQL BIGINT value.");
        if (this._rawCopper.greaterThan(maxCopper)) throw new UnsafeNumberError("Cannot convert Gold to MySQL BIGINT: total copper amount exceeds maximum MySQL BIGINT value.");

        return this.toBigInt();
    }

    /**
     * Convert this {@link Gold} value to a simple gold string, with a formatted gold amount and padded silver/copper.
     * 
     * - 1g 03s 34c
     * - 3,234,533g 00s 01c
     * - -533g 10s 00c
     * 
     * @returns the gold string
     */
    public toString() {
        const negStr = this.isNegative ? "-" : "";
        const [ gold, silver, copper ] = [
            this.gold.toLocaleString(),
            this.silver.toString().padStart(2, '0'),
            this.copper.toString().padStart(2, '0'),
        ]
        return `${negStr}${gold}g ${silver}s ${copper}c`;
    }

    /**
     * Convert this {@link Gold} value to a JSON value, using the total amount of copper.  
     * Uses the `decimal.js` [`.toJSON`](https://mikemcl.github.io/decimal.js/#toJSON) function.
     * 
     * @returns the JSON value.
     */
    public toJSON() {
        return this._rawCopper.toJSON();
    }


    // --
    // -- -- Gold Math Functions -- --
    // --


    public add(amount: GoldMathValueResolvable, mutate: boolean = false) {
        amount = resolveGoldMathValue(amount);
        if (mutate) {
            this._rawCopper = this._rawCopper.add(amount);
            return this;
        } else {
            return new Gold(this._rawCopper.add(amount));
        }
    }

    public sub(amount: GoldMathValueResolvable, mutate: boolean = false) {
        amount = resolveGoldMathValue(amount);
        if (mutate) {
            this._rawCopper = this._rawCopper.sub(amount);
            return this;
        } else {
            return new Gold(this._rawCopper.sub(amount));
        }
    }

    public mul(amount: GoldMathValueResolvable, mutate: boolean = false) {
        amount = resolveGoldMathValue(amount);
        if (mutate) {
            this._rawCopper = this._rawCopper.mul(amount);
            return this;
        } else {
            return new Gold(this._rawCopper.mul(amount));
        }
    }

    public div(amount: GoldMathValueResolvable, mutate: boolean = false) {
        amount = resolveGoldMathValue(amount);
        if (mutate) {
            this._rawCopper = this._rawCopper.div(amount);
            return this;
        } else {
            return new Gold(this._rawCopper.div(amount));
        }
    }

    public abs(mutate: boolean = false) {
        if (mutate) {
            this._rawCopper = this._rawCopper.abs();
            return this;
        } else {
            return new Gold(this._rawCopper.abs());
        }
    }

    public round(mutate: boolean = false) {
        if (mutate) {
            this._rawCopper = this._rawCopper.round();
            return this;
        } else {
            return new Gold(this._rawCopper.round());
        }
    }

    public roundToGold(mutate: boolean = false) {
        const gold = this._rawCopper.div(COPPER_PER_GOLD).round();
        const totalCopper = gold.mul(COPPER_PER_GOLD);
        if (mutate) {
            this._rawCopper = totalCopper;
            return this;
        } else {
            return new Gold(totalCopper);
        }
    }

    public floor(mutate: boolean = false) {
        if (mutate) this._rawCopper = this._rawCopper.floor();
        return mutate ? this : new Gold(this._rawCopper.floor());
    }

    public floorToGold(mutate: boolean = false) {
        const gold = this._rawCopper.div(COPPER_PER_GOLD).floor();
        const totalCopper = gold.mul(COPPER_PER_GOLD);
        if (mutate) {
            this._rawCopper = totalCopper;
            return this;
        } else {
            return new Gold(totalCopper);
        }
    }

    public ceil(mutate: boolean = false) {
        if (mutate) this._rawCopper = this._rawCopper.ceil();
        return mutate ? this : new Gold(this._rawCopper.ceil());
    }

    public ceilToGold(mutate: boolean = false) {
        const gold = this._rawCopper.div(COPPER_PER_GOLD).ceil();
        const totalCopper = gold.mul(COPPER_PER_GOLD);
        if (mutate) {
            this._rawCopper = totalCopper;
            return this;
        } else {
            return new Gold(totalCopper);
        }
    }

    public trunc(mutate: boolean = false) {
        if (mutate) {
            this._rawCopper = this._rawCopper.trunc();
            return this;
        } else {
            return new Gold(this._rawCopper.trunc());
        }
    }

    public clamp(min: GoldMathValueResolvable, max: GoldMathValueResolvable, mutate: boolean = false) {
        min = resolveGoldMathValue(min);
        max = resolveGoldMathValue(max);
        if (mutate) {
            this._rawCopper = this._rawCopper.clamp(min, max);
            return this;
        } else {
            return new Gold(this._rawCopper.clamp(min, max));
        }
    }

    public mod(amount: GoldMathValueResolvable, mutate: boolean = false) {
        amount = resolveGoldMathValue(amount);
        if (mutate) this._rawCopper = this._rawCopper.mod(amount);
        return mutate ? this : new Gold(this._rawCopper.mod(amount));
    }

    // -- -- -- --

    public isEqualTo(amount: GoldMathValueResolvable) {
        amount = resolveGoldMathValue(amount);
        return this._rawCopper.equals(amount);
    }

    public isLessThan(amount: GoldMathValueResolvable) {
        amount = resolveGoldMathValue(amount);
        return this._rawCopper.lessThan(amount);
    }

    public isLessThanOrEqualTo(amount: GoldMathValueResolvable) {
        amount = resolveGoldMathValue(amount);
        return this._rawCopper.lessThanOrEqualTo(amount);
    }

    public isGreaterThan(amount: GoldMathValueResolvable) {
        amount = resolveGoldMathValue(amount);
        return this._rawCopper.greaterThan(amount);
    }

    public isGreaterThanOrEqualTo(amount: GoldMathValueResolvable) {
        amount = resolveGoldMathValue(amount);
        return this._rawCopper.greaterThanOrEqualTo(amount);
    }

}


export namespace Gold {

    /** The characters used to denote a gold segment. */
    export type GoldNotation = typeof GOLD_NOTATIONS[number];

    /** The character used to denote a silver segment. */
    export type SilverNotation = typeof SILVER_NOTATION;

    /** The character used to denote silver. */
    export type CopperNotation = typeof COPPER_NOTATION;

    /** The resolvable value types of a segment. */
    export type SegmentResolvable = Decimal | BigInt | number;

    export interface Segments {

        /**
         * The total amount of gold.
         * 
         * - `1g` = `10,000c`
         * - `132.4563g` = `1,324,563c`
         * 
         * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
         */
        gold: SegmentResolvable;

        /**
         * The total amount of silver.
         * 
         * - `100s` = `1g`
         * - `1s` = `0.01g`
         * - `5,222s` = `52.22g`
         * - `18,496.2547s` = `1,849,625.47g`
         * 
         * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
         */
        silver: SegmentResolvable;

        /**
         * The total amount of copper.
         * 
         * - `10,000c` = `1g`
         * - `1c` = `0.0001g`
         * - `55,658,769c` = 5`,565.8769g`
         * - `584,269,726.26481c` = `58,426.97g`
         * 
         * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
         */
        copper: SegmentResolvable;

    };

    export type SegmentName = typeof SEGMENT_NAMES[number];

    /**
     * The default gold expression types.
     */
    export type ExpressionType = {

        /**
         * A gold expression type to express an explicit amount of copper.
         * 
         * - Must always be denoted as copper using c
         *   - Does not accept any other expression that is not denoted as copper
         * - Accepts an expression smaller/larger than -99-99
         * - Accepts an expression with a fractional amount of copper
         * 
         */
        EXPLICIT_COPPER: ExplicitCopperExpressionType;

        /**
         * A gold expression type to express both silver _**and**_ copper.
         * 
         * - Both segments must always be denoted as silver/copper using s/c
         * - Min/max segment amount is fixed to 1-2 digits: -99-99
         * 
         */
        SILVER_AND_COPPER: SilverAndCopperExpressionType;

        /**
         * A gold expression type to express either silver _**or**_ copper.
         * 
         * - Both segments must always be denoted as silver/copper using s/c
         * - Min/max segment amount is fixed to 1-2 digits: -99-99
         * 
         */
        SILVER_OR_COPPER: SilverOrCopperExpressionType;

        /**
         * A gold expression type to express an explicit amount of gold.
         * 
         * - Must always be denoted with a valid gold notation using g/k/m/b
         *   - Does not accept any other expression that is not denoted as gold
         * - Accepts an expression with a fractional amount of gold
         * 
         */
        EXPLICIT_GOLD: ExplicitGoldExpressionType;

        /**
         * A gold expression type to express an explicit amount of _**only**_ gold.
         * 
         * - Must always be denoted with a valid gold notation using g/k/m/b
         *   - Does not accept any other expression that is not denoted as gold
         * - Does _**not**_ accept expressions with a fractional amount of gold
         * 
         */
        EXPLICIT_ONLY_GOLD: ExplicitOnlyGoldExpressionType;

        /**
         * A gold expression type to express any generic format of gold
         * 
         * - If only gold is expressed, the notation is optional; the expression is assumed to be an amount of gold
         * - The expressed amount of gold can be fractional
         *   - If gold is expressed as a fractional amount, neither silver nor copper can be present
         * - The gold notation _**must**_ be present if the expression contains an amount of silver and/or copper.
         *   - Both silver and/or copper segments must always be denoted as silver/copper using s/c
         *   - If both silver _**and**_ copper are expressed, silver must always come first
         *   - Min/max amount for silver/copper is fixed to 1-2 digits: -99-99
         * 
         */
        GENERIC_GOLD: GenericGoldExpressionType;

    }

}