
export class MalformedGoldExpressionError extends Error {

    constructor(message?: string) {
        super(message ?? "Malformed gold expression; the gold string could not be parsed.");
    }


}