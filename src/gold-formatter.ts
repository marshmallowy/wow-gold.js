import { Gold } from "./gold";

export enum GoldFormatterSourceType {
    GOLD_INSTANCE,
    SEGMENTS
}

type Formatter<T extends GoldFormatterSourceType> = {
    [GoldFormatterSourceType.GOLD_INSTANCE]: (
        /** The gold instance to format. */
        goldInstance: Gold
    ) => string;
    [GoldFormatterSourceType.SEGMENTS]: (
        /** Whether or not this amount of gold is negative. */
        isNegative: boolean,
        /** The absolute (abs) amount of gold. */
        gold: number,
        /** The absolute (abs) amount of silver between 0-99. */
        silver: number,
        /** The absolute (abs) amount of copper between 0-99. */
        copper: number
    ) => string;
}[T];

export class GoldFormatter<SourceType extends GoldFormatterSourceType> {

    /**
     * Create a new formaatter that formats a gold string directly from a {@link Gold} instance.
     * @param formatter The vallback used to format the gold string.
     * @returns The formatted gold string.
     */
    public static fromInstance(formatter: Formatter<GoldFormatterSourceType.GOLD_INSTANCE>) {
        return new GoldFormatter(GoldFormatterSourceType.GOLD_INSTANCE, formatter);
    }

    /**
     * Create a new formaatter that formats a gold string from each normalized segment amount.
     * @param formatter The callback used to format the gold string.
     * @returns The formatted gold string.
     */
    public static fromSegments(formatter: Formatter<GoldFormatterSourceType.SEGMENTS>) {
        return new GoldFormatter(GoldFormatterSourceType.SEGMENTS, formatter);
    }


    // -- -- -- --


    private readonly sourceType: SourceType;
    private readonly formatter: Formatter<SourceType>;

    private constructor(sourceType: SourceType, formatter: Formatter<SourceType>) {
        this.sourceType = sourceType;
        this.formatter = formatter;
    }

    /**
     * Format the speicifed {@link Gold} value.
     * @param gold The {@link Gold} value to format.
     * @returns The formatted gold string.
     */
    public format(gold: Gold) {
        switch (this.sourceType as GoldFormatterSourceType) {
            case GoldFormatterSourceType.GOLD_INSTANCE: return (this as GoldFormatter<GoldFormatterSourceType.GOLD_INSTANCE>).formatter(gold);
            case GoldFormatterSourceType.SEGMENTS: return (this as GoldFormatter<GoldFormatterSourceType.SEGMENTS>).formatter(gold.isNegative, gold.gold, gold.silver, gold.copper);
        }
    }

}
