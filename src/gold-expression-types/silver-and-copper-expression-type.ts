import Decimal from "decimal.js";
import { GoldExpressionType, GoldExpressionTypeMatchableResolvable, NegativeGoldExpressionMatchGroup } from "../gold-expression-type";
import { Gold } from "../gold";


const regexp = /(?:(?<=^)(?<neg>[-]){0,1}(?:(?<and_silver>\d{1,2})[s][ ]*(?<and_copper>\d{1,2})[c])(?=$))/i;

type MatchGroups = Partial<NegativeGoldExpressionMatchGroup> & {
    and_silver?: string;
    and_copper?: string;
};

export const SilverAndCopperExpressionType = GoldExpressionType.create(regexp, (expression: any, expressionType: GoldExpressionTypeMatchableResolvable<MatchGroups>) => {
    const match = GoldExpressionType.match(expression, expressionType);
    if (match) {
        const silver = match.and_silver ? new Decimal(match.and_silver).mul(Gold.COPPER_PER_SILVER) : 0;
        const copper = match.and_copper ? new Decimal(match.and_copper).mul(Gold.COPPER_PER_COPPER) : 0;
        return new Decimal(`${match.neg ?? ""}${silver}`).add(copper);
    }
    return undefined;
});

export type SilverAndCopperExpressionType = typeof SilverAndCopperExpressionType;