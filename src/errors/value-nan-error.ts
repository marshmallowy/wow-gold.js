
export class ValueNaNError extends Error {

    constructor(message?: string) {
        super(message ?? "The specified value is NaN.");
    }

}