import Decimal from "decimal.js";
import { GoldExpressionType, GoldExpressionTypeMatchableResolvable, NegativeGoldExpressionMatchGroup } from "../gold-expression-type";


const regexp = /(?:(?<=^)(?<neg>[-]){0,1}(?<explicitCopper>(?:\d{1,3}(?:(?:[,]\d{3})+|(?:[_]\d{3})+))|\d+)(?:[.](?<fractionalCopper>\d+)){0,1}[c](?=$))/i;

type MatchGroups = Partial<NegativeGoldExpressionMatchGroup> & {
    explicitCopper: string;
    fractionalCopper?: string;
};

export const ExplicitCopperExpressionType = GoldExpressionType.create(regexp, (expression: any, expressionType: GoldExpressionTypeMatchableResolvable<MatchGroups>) => {
    const match = GoldExpressionType.match(expression, expressionType);
    if (match) {
        const fractionalCopperStr = match.fractionalCopper ? `.${match.fractionalCopper}` : "";
        const totalCopper = new Decimal(`${match.neg ?? ""}${match.explicitCopper.replace(/[,_]/g, '')}${fractionalCopperStr}`);
        return totalCopper
    }
    return undefined;
});

export type ExplicitCopperExpressionType = typeof ExplicitCopperExpressionType;