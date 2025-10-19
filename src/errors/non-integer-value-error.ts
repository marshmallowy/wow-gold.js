
export class NonIntegerValueError extends Error {

    constructor(message?: string) {
        super(message ?? "The specified value must be an integer.");
    }

}