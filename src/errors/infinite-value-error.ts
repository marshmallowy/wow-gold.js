
export class InfiniteValueError extends Error {

    constructor(message?: string) {
        super(message ?? "The specified value must not be infinite.");
    }

}