
export class UnsafeNumberError extends Error {

    constructor(message?: string) {
        super(message ?? "The specified value falls below or exceeds JavaScript's lower/upper safe number bounds. Consider using Decimal `(decimal.js)` or BigInt when dealing with large numbers to preserve number precision.");
    }

}