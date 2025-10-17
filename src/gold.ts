import Decimal from 'decimal.js';
import { ValueNaNError } from './error/ValueNaNError';
import { InfiniteValueError } from './error/InfiniteValueError';
import { UnsafeNumberError } from './error/UnsafeNumberError';
import { ExplicitCopper, ExplicitGold, ExplicitSilverAndCopper, ExplicitSilverOrCopper, GenericGold, GoldExpressions } from './gold-expression';
import { MalformedGoldStringError } from './error/MalformedGoldStringError,';

type ResolvableTotalSegment = Decimal | BigInt | number;
type GoldFromTotalResolvableSegments = {

    /**
     * The total amount of gold of the desired gold amount.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     */
    gold: ResolvableTotalSegment;

    /**
     * The total amount of silver in the desired gold amount.
     * - 100s = 1g
     * - 1s = 0.01g
     * - 5,222s: = 52.22g
     * - 18,496.2547s = 1,849,625.47g
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     */
    silver: ResolvableTotalSegment;

    /**
     * The total amount of copper in the desired gold amount.
     * - 10,000c = 1g
     * - 1c = 0.0001g
     * - 55,658,769c = 5,565.8769g
     * - 584,269,726.26481c = 58,426.97g
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     */
    copper: ResolvableTotalSegment;

};

type GoldMathValue = Gold | Decimal.Value;

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

Decimal.config({ precision: 50 });


export class Gold {

    private _rawCopper: Decimal;

    /**
     * Create a new {@link Gold} value instance.
     * @param rawCopper The total amount of copper contained in this {@link Gold} value.
     */
    constructor(rawCopper: ResolvableTotalSegment) {
        try {
            this._rawCopper = copperFromTotal({ 'copper': rawCopper })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Get the total, raw amount of copper held by this {@link Gold} value, including any fractional copper amount.
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
        const gold = this._rawCopper.div(COPPER_PER_GOLD);
        return (this.isNegative ? gold.ceil() : gold.floor()).abs().toNumber();
    }

    /**
     * Returns the segmented amount of silver as an absolute integer number between 0-99.
     * 
     * @note Use {@link isNegative} to check if this {@link Gold} value is negative.
     */
    public get silver() {
        const silver = this._rawCopper.mod(COPPER_PER_GOLD).div(COPPER_PER_SILVER);
        return (this.isNegative ? silver.ceil() : silver.floor()).abs().toNumber();
    }

    /**
     * Returns the segmented amount of copper as an absolute integer number between 0-99.
     * 
     * @note Use {@link isNegative} to check if this {@link Gold} value is negative.
     */
    public get copper() {
        const copper = this._rawCopper.mod(COPPER_PER_SILVER);
        return (this.isNegative ? copper.ceil() : copper.floor()).abs().toNumber();
    }
    /**
     * Get a **JavaScript** [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) representation of the total copper held by this {@link Gold} value.  
     * Any fractional copper is ignored/rounded down.
     * 
     * @note Consider using {@link toMySQLBigInt()} to safely attempt convertion to a [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html).
     */
    public toBigInt() {
        return BigInt(this._rawCopper.trunc().toString());
    }

    /**
     * Attempt to get a **JavaScript** [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) representation of the total copper held by this {@link Gold} value.  
     * Any fractional copper is ignored/rounded down.
     * 
     * @param isUnsigned Whether or not to convert to an unsigned MySQL BIGINT instead of signed. Default: `false` (*signed*)
     * @throws
     * - {@link UnsafeNumberError} if the total copper held by this gold value falls below/exceeds the minimum/maximum supported values for a [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html).
     */
    public toMySQLBigInt(isUnsigned: boolean = false) {
        const minCopper = isUnsigned ? Gold.MIN_COPPER_MYSQL_UNSIGNED : Gold.MIN_COPPER_MYSQL_SIGNED;
        const maxCopper = isUnsigned ? Gold.MAX_COPPER_MYSQL_UNSIGNED : Gold.MAX_COPPER_MYSQL_SIGNED;

        if (this._rawCopper.lessThan(minCopper)) throw new UnsafeNumberError("Cannot convert Gold to MySQL BIGINT; total copper falls below minimum supported MySQL limit.");
        if (this._rawCopper.greaterThan(maxCopper)) throw new UnsafeNumberError("Cannot convert Gold to MySQL BIGINT; total copper exceeds maximum supported MySQL limit.");

        return this.toBigInt();
    }

    public toString() {
        const negStr = this.isNegative ? "-" : "";
        return `${negStr}${this.gold}g ${this.silver}s ${this.copper}c`;
    }

    // -- -- -- -- -- --
    // -- MATH  STUFF --
    // -- -- -- -- -- --


    /**
     * Add the specified amount to this {@link Gold} value.
     * 
     * @param amount The amount to add.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public add(amount: GoldMathValue, mutate: boolean = false) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        if (mutate) {
            this._rawCopper = this._rawCopper.add(amount);
            return this;
        } else {
            return new Gold(this._rawCopper.add(amount));
        }
    }

    /**
     * Subtract the specified amount from this {@link Gold} value.
     * 
     * @param amount The amount to subtract.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public sub(amount: GoldMathValue, mutate: boolean = false) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        if (mutate) {
            this._rawCopper = this._rawCopper.sub(amount);
            return this;
        } else {
            return new Gold(this._rawCopper.sub(amount));
        }
    }

    /**
     * Multiply this {@link Gold} value by the specified amount.
     * 
     * @param amount The amount to multiply by.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public mul(amount: GoldMathValue, mutate: boolean = false) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        if (mutate) {
            this._rawCopper = this._rawCopper.mul(amount);
            return this;
        } else {
            return new Gold(this._rawCopper.mul(amount));
        }
    }

    /**
     * Divide this {@link Gold} value by the specified amount.
     * 
     * @param amount The amount to divide by.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public div(amount: GoldMathValue, mutate: boolean = false) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        if (mutate) {
            this._rawCopper = this._rawCopper.div(amount);
            return this;
        } else {
            return new Gold(this._rawCopper.div(amount));
        }
    }

    /**
     * Get the absolute of this {@link Gold} value. (makes it positive)
     * 
     * @note See MDN: [`Math.abs`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs) | decimal.js: [`.abs`](https://mikemcl.github.io/decimal.js/#abs)
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public abs(mutate: boolean = false) {
        if (mutate) {
            this._rawCopper = this._rawCopper.abs();
            return this;
        } else {
            return new Gold(this._rawCopper.abs());
        }
    }

    /**
     * Round this {@link Gold} value to the nearest whole __**copper**__.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public round(mutate: boolean = false) {
        if (mutate) {
            this._rawCopper = this._rawCopper.round();
            return this;
        } else {
            return new Gold(this._rawCopper.round());
        }
    }

    /**
     * Round this {@link Gold} value to the nearest whole __**gold**__.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
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

    /**
     * Round this {@link Gold} value down to the nearest whole __**copper**__.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public floor(mutate: boolean = false) {
        if (mutate) this._rawCopper = this._rawCopper.floor();
        return mutate ? this : new Gold(this._rawCopper.floor());
    }

    /**
     * Round this {@link Gold} value down to the nearest whole __**gold**__.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
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

    /**
     * Round this {@link Gold} value up to the nearest whole __**copper**__.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public ceil(mutate: boolean = false) {
        if (mutate) this._rawCopper = this._rawCopper.ceil();
        return mutate ? this : new Gold(this._rawCopper.ceil());
    }

    /**
     * Round this {@link Gold} value up to the nearest whole __**gold**__.
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
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

    /**
     * Truncate the __**copper**__ representation of this {@link Gold} value, removing any fractional __**copper**__ digits.
     * 
     * @note See MDN: [`Math.trunc`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc) | decimal.js: [`.trunc`](https://mikemcl.github.io/decimal.js/#trunc)
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public trunc(mutate: boolean = false) {
        if (mutate) {
            this._rawCopper = this._rawCopper.trunc();
            return this;
        } else {
            return new Gold(this._rawCopper.trunc());
        }
    }

    /**
     * Clamp this {@link Gold} value between the minimum and maximum __**copper**__ values.
     * - If the __**copper**__ representation of this {@link Gold} value is _under_ the min value, use the min value; otherwise use the specified __**copper**__ value.
     * - If the __**copper**__ representation of this {@link Gold} value is _over_ the max value, use the max value; otherwise use the specified __**copper**__ value.
     * 
     * @param min The minimum __**copper**__ clamp value.
     * @param max The maximum __**copper**__ clamp value.
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public clamp(min: GoldMathValue, max: GoldMathValue, mutate: boolean = false) {
        min = min instanceof Gold ? min._rawCopper : min;
        max = max instanceof Gold ? max._rawCopper : max;
        if (mutate) {
            this._rawCopper = this._rawCopper.clamp(min, max);
            return this;
        } else {
            return new Gold(this._rawCopper.clamp(min, max));
        }
    }

    /**
     * Divide this {@link Gold} value by the specified amount and return the remainder.
     * 
     * @note See MDN: [`%/Remainder`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder) | decimal.js: [`.mod`](https://mikemcl.github.io/decimal.js/#mod)
     * 
     * @param mutate If `true`, performs the calculation on this {@link Gold} instance directly.  
     *               If `false` (default), returns a new {@link Gold} instance with the calculated value.
     * @returns The resulting {@link Gold} value — either this instance (if mutated), or a new one.
     */
    public mod(amount: GoldMathValue, mutate: boolean = false) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        if (mutate) this._rawCopper = this._rawCopper.mod(amount);
        return mutate ? this : new Gold(this._rawCopper.mod(amount));
    }

    // -- -- -- --

    /**
     * Check if this {@link Gold} value is less than the specified amount.
     * @param amount The amount to check against.
     * @returns `true` if this {@link Gold} value is less than the value specified; `false` if otherwise.
     */
    public isLessThan(amount: GoldMathValue) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        return this._rawCopper.lessThan(amount);
    }

    /**
     * Check if this {@link Gold} value is less than or equal to the specified amount.
     * @param amount The amount to check against.
     * @returns `true` if this {@link Gold} value is less than or equal to the value specified; `false` if otherwise.
     */
    public isLessThanOrEqualTo(amount: GoldMathValue) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        return this._rawCopper.lessThanOrEqualTo(amount);
    }

    /**
     * Check if this {@link Gold} value is greater than the specified amount.
     * @param amount The amount to check against.
     * @returns `true` if this {@link Gold} value is greater than the value specified; `false` if otherwise.
     */
    public isGreaterThan(amount: GoldMathValue) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        return this._rawCopper.greaterThan(amount);
    }

    /**
     * Check if this {@link Gold} value is greater than or equal to the specified amount.
     * @param amount The amount to check against.
     * @returns `true` if this {@link Gold} value is greater than or equal to the value specified; `false` if otherwise.
     */
    public isGreaterThanOrEqualTo(amount: GoldMathValue) {
        amount = amount instanceof Gold ? amount._rawCopper : amount;
        return this._rawCopper.greaterThanOrEqualTo(amount);
    }


    // -- -- -- --

    /**
     * Create a new {@link Gold} value from the summation of the specified amounts.
     * @param amount The amounts to sum together.
     * @returns a new {@link Gold} value of the total summation.
     */
    public static sum(...amount: GoldMathValue[]) {
        amount = [...amount].map(v => (v instanceof Gold ? v._rawCopper : v));
        const totalCopper = Decimal.sum(...amount as Decimal.Value[]);
        return new Gold(totalCopper);
    }

    /**
     * Test the specified string to see if it's a valid gold string.
     * 
     * @note The `value` is trimmed before testing.
     * @param value The value to test.
     * @returns `true` if the string is a valid gold string; `false` if otherwise.
     */
    public static isGoldString(value: string, goldExpressionType?: keyof GoldExpressions) {
        value = value.trim();

        const goldExpressions: GoldExpressions = {
            ExplicitCopper: ExplicitCopper,
            ExplicitSilverAndCopper: ExplicitSilverAndCopper,
            ExplicitSilverOrCopper: ExplicitSilverOrCopper,
            ExplicitGold: ExplicitGold,
            GenericGold: GenericGold
        }

        if (goldExpressionType) return goldExpressions[goldExpressionType].test(value);
        for (const goldExpression of Object.values(goldExpressions)) if (goldExpression.test(value)) return true;

        return false;
    }

    /**
     * Attempts to parse the specified string as a Gold string.
     * 
     * @note The `value` is trimmed before parsing.
     * @param value The value to parse.
     * @param goldExpressionType If provided, only the specified gold expression type will be accepted. Default: `undefined` (*any expression type*)
     * @returns the new {@link Gold} value.
     * @throws
     * - {@link ValueNaNError} if any segment amount is `NaN`.
     * - {@link InfiniteValueError} if any segment amount is infinite.
     * - {@link UnsafeNumberError} if any segment amount exceeds JavaScript's lower/upper safe integer bounds.
     * - {@link MalformedGoldStringError} if the specified gold string could not be parsed.
     */
    public static parse(value: string, goldExpressionType?: keyof GoldExpressions) {
        value = value.trim();

        const goldExpressions: GoldExpressions = {
            GenericGold: GenericGold,
            ExplicitSilverAndCopper: ExplicitSilverAndCopper,
            ExplicitSilverOrCopper: ExplicitSilverOrCopper,
            ExplicitCopper: ExplicitCopper,
            ExplicitGold: ExplicitGold,
        }

        let totalCopper;
        if (goldExpressionType) {
            totalCopper = goldExpressions[goldExpressionType].parseCopper(value);
        } else {
            for (const goldExpression of Object.values(goldExpressions)) {
                totalCopper = goldExpression.parseCopper(value);
                if (totalCopper !== undefined) break;
            }
        }

        if (totalCopper !== undefined) return new Gold(totalCopper);

        throw new MalformedGoldStringError();

    }

    /**
     * Creates a new {@link Gold} value from the specified segment amounts.
     * 
     * @note Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.
     * @param segments The segment amounts.
     * @returns the new {@link Gold} value.
     * @throws
     * - {@link ValueNaNError} if any segment amount is `NaN`.
     * - {@link InfiniteValueError} if any segment amount is infinite.
     * - {@link UnsafeNumberError} if any segment amount exceeds JavaScript's lower/upper safe integer bounds.
     * - {@link TypeError} if any segment is not a type of Decimal (decimal.js), BigInt or number.
     */
    public static fromTotal(segments: Partial<GoldFromTotalResolvableSegments>) {
        try {
            return new Gold(copperFromTotal(segments));
        } catch (e) {
            throw e;
        }
    }

    // -- -- -- --

    static get COPPER_PER_COPPER() { return COPPER_PER_COPPER; }
    static get COPPER_PER_SILVER() { return COPPER_PER_SILVER; }
    static get COPPER_PER_GOLD() { return COPPER_PER_GOLD; }

    static get COPPER_PER_THOUSAND_GOLD() { return COPPER_PER_THOUSAND_GOLD; }
    static get COPPER_PER_MILLION_GOLD() { return COPPER_PER_MILLION_GOLD; }
    static get COPPER_PER_BILLION_GOLD() { return COPPER_PER_BILLION_GOLD; }

    // -- -- -- --

    /**
     * The minimum *signed* `number` that **Javascript** accurately supports.  
     * Alias for [`Number.MIN_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) : `−(2^53 − 1)` = `−9,007,199,254,740,991`
     * 
     * @note Minimum *signed* [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) : `-2^63` = `-9,223,372,036,854,775,808`
     */
    static get MIN_COPPER_INT() { return Number.MIN_SAFE_INTEGER; }

    /**
     * The maximum *signed* `number` that **Javascript** accurately supports.  
     * Alias for [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) : `(2^53) - 1` = `9,007,199,254,740,991`  
     * 
     * @note Maximum *signed* [`MySQL BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) : `2^63-1` = `9,223,372,036,854,775,807`
     */
    static get MAX_COPPER_INT() { return Number.MAX_SAFE_INTEGER; }


    // -- -- -- --


    /**
     * The minimum *signed* [`BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) that MySQL supports.  
     * Min : `-(2^63)` = `-9,223,372,036,854,775,808`
     * 
     * @note Minimum *signed* `number` that **Javascript** accurately supports : `−(2^53 − 1)` = `−9,007,199,254,740,991` : [`Number.MIN_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER)
     */
    static get MIN_COPPER_MYSQL_SIGNED() { return MIN_MYSQL_SIGNED_BIGINT; }

    /**
     * The maximum *signed* [`BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) that MySQL supports.  
     * Max : `(2^63) - 1` = `9,223,372,036,854,775,807`
     * 
     * @note Maximum *signed* `number` that **Javascript** accurately supports : `(2^53) - 1` = `9,007,199,254,740,991`` : [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
     */
    static get MAX_COPPER_MYSQL_SIGNED() { return MAX_MYSQL_SIGNED_BIGINT; }

    // -- -- -- --

    /**
     * The minimum *signed* [`BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) that MySQL supports.  
     * Min : 0
     * 
     * @note Minimum *signed* `number` that **Javascript** accurately supports : `−(2^53 − 1)` = `−9,007,199,254,740,991` : [`Number.MIN_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER)
     */
    static get MIN_COPPER_MYSQL_UNSIGNED() { return MIN_MYSQL_UNSIGNED_BIGINT; }

    /**
     * The maximum *signed* [`BIGINT`](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html) that MySQL supports.  
     * Max : `(2^64) - 1` = `18,446,744,073,709,551,615`
     * 
     * @note Maximum *signed* `number` that **Javascript** accurately supports : `(2^53) - 1` = `9,007,199,254,740,991`` : [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
     */
    static get MAX_COPPER_MYSQL_UNSIGNED() { return MAX_MYSQL_UNSIGNED_BIGINT; }

}


// -- -- -- --


function copperFromTotal(segments: Partial<GoldFromTotalResolvableSegments>) {

    if ((segments.gold ?? segments.silver ?? segments.copper) === undefined) return new Decimal(0);

    const copperMulti: Record<keyof GoldFromTotalResolvableSegments, Decimal> = {
        gold: COPPER_PER_GOLD,
        silver: COPPER_PER_SILVER,
        copper: COPPER_PER_COPPER
    } as const;

    let totalCopper = new Decimal(0);
    for (const [segmentName, amount] of Object.entries(segments) as [keyof GoldFromTotalResolvableSegments, ResolvableTotalSegment][]) {

        if (amount instanceof Decimal) {

            if (!amount.isFinite()) throw new InfiniteValueError(`The amount of '${segmentName}' must not be infinite.`);

        } else if (typeof amount === 'number') {

            if (Number.isNaN(amount)) throw new ValueNaNError(`The amount of '${segmentName}' is NaN.`);
            if (!Number.isFinite(amount)) throw new InfiniteValueError(`The amount of '${segmentName}' must not be infinite.`)
            if (amount < Number.MIN_SAFE_INTEGER || amount > Number.MAX_SAFE_INTEGER) throw new UnsafeNumberError(`The amount of '${segmentName}' falls below or exceeds JavaScript's lower/upper safe number bounds. Consider using Decimal (decimal.js) or BigInt when dealing with large numbers to preserve number precision.`);

        } else if (typeof amount === 'bigint') {
            // self validated
        } else {
            throw new TypeError(`The amount of '${segmentName}' must be a Decimal (decimal.js), BigInt or number.`);
        }

        totalCopper = totalCopper.add(new Decimal(amount.toString()).mul(copperMulti[segmentName]));

    }

    return totalCopper;
}