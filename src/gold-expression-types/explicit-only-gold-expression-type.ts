import Decimal from "decimal.js";
import { GoldExpressionType, GoldExpressionTypeMatchableResolvable, GoldNotationGoldExpressionMatchGroup, NegativeGoldExpressionMatchGroup } from "../gold-expression-type";
import { Gold } from "../gold";


const regexp = /(?:(?<=^)(?<neg>[-]){0,1}(?<gold>(?:\d{1,3}(?:(?:[,]\d{3})+|(?:[_]\d{3})+))|\d+)(?<goldNotation>[gkmb])(?=$))/;

type MatchGroups = Partial<NegativeGoldExpressionMatchGroup> & GoldNotationGoldExpressionMatchGroup & {
    gold: string;
}

export const OnlyGoldExpressionType = GoldExpressionType.create(regexp, (expression: any, expressionType: GoldExpressionTypeMatchableResolvable<MatchGroups>) => {
    const match = GoldExpressionType.match(expression, expressionType);
    if (match) {
        let totalCopper = new Decimal(0);

        const multiplier = Gold.getGoldNotationCopperMultiplier(match.goldNotation);
        totalCopper = new Decimal(`${match.neg ?? ""}${match.gold.replace(/[,_]/g, '')}`).mul(multiplier);

        return totalCopper;
    }
    return undefined;
});

export type OnlyGoldExpressionType = typeof OnlyGoldExpressionType;