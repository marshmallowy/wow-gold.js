
export class MalformedGoldExpressionError extends Error {

    constructor(message?: string) {
        super(message ?? "Malformed gold string; the gold string could not be parsed.");
    }


}