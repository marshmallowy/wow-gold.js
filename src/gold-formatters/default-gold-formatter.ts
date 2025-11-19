import { GoldFormatter } from "../gold-formatter";

export const DefaultGoldFormatter = GoldFormatter.fromSegments((isNegative, gold, silver, copper) => {
    const negStr = isNegative ? "-" : "";
    const [ goldStr, silverStr, copperStr ] = [
        gold.toLocaleString(),
        silver.toString().padStart(2, '0'),
        copper.toString().padStart(2, '0'),
    ]
    return `${negStr}${goldStr}g ${silverStr}s ${copperStr}c`;
})