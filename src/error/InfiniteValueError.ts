
export class InfiniteValueError extends Error {

    constructor(message?: string) {
        super(message ?? "The specified value amount must not be infinite.");
    }

}