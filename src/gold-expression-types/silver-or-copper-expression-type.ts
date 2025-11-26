import Decimal from "decimal.js";
import { GoldExpressionType, GoldExpressionTypeMatchableResolvable, NegativeGoldExpressionMatchGroup } from "../gold-expression-type";
import { Gold } from "../gold";


const regexp = /(?:(?<=^)(?<neg>[-]){0,1}(?:(?<or_silver>\d{1,2})[s]|(?<or_copper>\d{1,2})[c])(?=$))/i;

type MatchGroups = Partial<NegativeGoldExpressionMatchGroup> & {
    or_silver?: string;
    or_copper?: string;
};

export const SilverOrCopperExpressionType = GoldExpressionType.create(regexp, (expression: any, expressionType: GoldExpressionTypeMatchableResolvable<MatchGroups>) => {
    const match = GoldExpressionType.match(expression, expressionType);
    if (match) {
        const silver = match.or_silver ? new Decimal(match.or_silver).mul(Gold.COPPER_PER_SILVER) : 0;
        const copper = match.or_copper ? new Decimal(match.or_copper).mul(Gold.COPPER_PER_COPPER) : 0;
        return new Decimal(`${match.neg ?? ""}${silver}`).add(copper);
    }
    return undefined;
});

export type SilverOrCopperExpressionType = typeof SilverOrCopperExpressionType;