import { GoldExpressionTypeMatchableResolvable } from "../gold-expression-type";

export class InvalidGoldExpressionError extends Error {

    /**
     * The gold expression value that the match and/or parse attempt was performed on.
     */
    public readonly expression: any;

    /**
     * The gold expression type that was used to perform the match/parse.  
     * Can be `null` if the error was thrown from a parse attempt where all default expression types were used.
     */
    public readonly expressionType: GoldExpressionTypeMatchableResolvable | null;

    /**
     * An error to indicate when a gold expression match and/or parse attempt has failed.
     * 
     * @param expression The gold expression value that the match and/or parse attempt was performed on. 
     * @param expressionType The gold expression type that was used to perform the match/parse.  
     *                       Can be `null` if the error was thrown from a parse attempt where all default expression types were used.
     * @param message The error message.
     */
    constructor(expression: Exclude<any, undefined | null>, expressionType: GoldExpressionTypeMatchableResolvable | null, message?: string) {
        super(message ?? `The value '${expression}' did not match as a valid gold expression.`);
        this.expression = expression;
        this.expressionType = expressionType;
    }

    public static fromNullOrUndefined(expression: null | undefined, expressionType: GoldExpressionTypeMatchableResolvable | null) {
        return new InvalidGoldExpressionError(
            expression,
            expressionType,
            `Type of ${typeof expression} is not a valid gold expression and cannot be matched.`
        )
    }

}