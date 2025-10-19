import Decimal from "decimal.js";
import { GoldExpressionType, GoldExpressionTypeMatchableResolvable, GoldNotationGoldExpressionMatchGroup, NegativeGoldExpressionMatchGroup } from "../gold-expression-type";
import { Gold } from "../gold";


/**
 * The uncombined parts that make up a generic gold expression.
 * 
 * 1. The suffix parts should be combined as `(?:(A | B){0,1})`
 * 2. Add the combined suffix to the end of the gold expression
 * 3. Wrap the parts as `(?:(?<=^)${gold}${suffix}(?=$))`
 * 
 * @note Not intended to be used as standalone expressions.
 */
const regexpParts = {
    gold: /(?:(?<neg>[-]){0,1}(?<gold>(?:\d{1,3}(?:(?:[,]\d{3})+|(?:[_]\d{3})+))|\d+)(?:[.](?<fractionalGold>\d+)){0,1}(?<goldNotation>[gkmb]){0,1})/,
    silverAndCopperSuffix: /(?:(?<=(?<![.]\d+)[gkmb])[ ]*(?<and_silver>\d{1,2})[s][ ]*(?<and_copper>\d{1,2})[c])/,
    silverOrCopperSuffix: /(?:(?<=(?<![.]\d+)[gkmb])[ ]*(?:(?<or_silver>\d{1,2})[s]|(?<or_copper>\d{1,2})[c]))/
}

const regexp = (() => {
    const goldBaseSuffixParts = [
        regexpParts.silverAndCopperSuffix.source,
        regexpParts.silverOrCopperSuffix.source,
    ].join('|');
    const genericGoldSuffixExpParts = new RegExp(`(?:${goldBaseSuffixParts}){0,1}`);

    return new RegExp(`(?<=^)(?:${regexpParts.gold.source}${genericGoldSuffixExpParts.source})(?=$)`);
})();

type MatchGroups = Partial<NegativeGoldExpressionMatchGroup> & Partial<GoldNotationGoldExpressionMatchGroup> & {
    gold: string;
    fractionalGold?: string;
    or_silver?: string;
    or_copper?: string;
    and_silver?: string;
    and_copper?: string;
}

export const GenericGoldExpressionType = GoldExpressionType.create(regexp, (expression: any, expressionType: GoldExpressionTypeMatchableResolvable<MatchGroups>) => {
    const match = GoldExpressionType.match(expression, expressionType);
    if (match) {
        let totalCopper = new Decimal(0);
        if (match.gold) {

            const multiplier = Gold.getGoldNotationCopperMultiplier(match.goldNotation);
            totalCopper = new Decimal(`${match.neg ?? ""}${match.gold.replace(/[,_]/g, '')}`).mul(multiplier);
            
            if (match.fractionalGold) {
                totalCopper = totalCopper.add(
                    new Decimal(`${match.neg ?? ""}0.${match.fractionalGold}`).mul(Gold.COPPER_PER_GOLD)
                )
            }

        }

        const silver = match.and_silver ?? match.or_silver;
        const copper = match.and_copper ?? match.or_copper;

        totalCopper = silver ? totalCopper.add(new Decimal(`${match.neg ?? ""}${silver}`).mul(Gold.COPPER_PER_SILVER)) : totalCopper;
        totalCopper = copper ? totalCopper.add(new Decimal(`${match.neg ?? ""}${copper}`).mul(Gold.COPPER_PER_COPPER)) : totalCopper;

        return totalCopper;
    }
    return undefined;
});

export type GenericGoldExpressionType = typeof GenericGoldExpressionType;