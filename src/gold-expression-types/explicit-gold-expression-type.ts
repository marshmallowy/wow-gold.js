import Decimal from "decimal.js";
import { GoldExpressionType, GoldExpressionTypeMatchableResolvable, GoldNotationGoldExpressionMatchGroup, NegativeGoldExpressionMatchGroup } from "../gold-expression-type";
import { Gold } from "../gold";


const regexp = /(?:(?<=^)(?<neg>[-]){0,1}(?<gold>(?:\d{1,3}(?:(?:[,]\d{3})+|(?:[_]\d{3})+))|\d+)(?:[.](?<fractionalGold>\d+)){0,1}(?<goldNotation>[gkmb])(?=$))/i;

type MatchGroups = Partial<NegativeGoldExpressionMatchGroup> & GoldNotationGoldExpressionMatchGroup & {
    gold: string;
    fractionalGold?: string;
}

export const ExplicitGoldExpressionType = GoldExpressionType.create(regexp, (expression: any, expressionType: GoldExpressionTypeMatchableResolvable<MatchGroups>) => {
    const match = GoldExpressionType.match(expression, expressionType);
    if (match) {
        const multiplier = Gold.getGoldNotationCopperMultiplier(match.goldNotation);
        return new Decimal(`${match.neg ?? ""}${match.gold.replace(/[,_]/g, '')}.${match.fractionalGold ?? '0'}`).mul(multiplier);
    }
    return undefined;
});

export type ExplicitGoldExpressionType = typeof ExplicitGoldExpressionType;