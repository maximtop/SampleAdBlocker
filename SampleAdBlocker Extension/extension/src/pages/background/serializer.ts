type LookupTables = Map<number, number[]> | Map<number, number>;

export type Objects = [string, number] | [string, number[]];

export const lookupTableToObject = (map: LookupTables): Objects => {
    return Object.fromEntries(map);
};

export const objectToLookupTable = (obj: Objects): LookupTables => {
    return new Map(Object.entries(obj)
        .map(([key, rawValue]) => {
            let value;
            if (Array.isArray(rawValue)) {
                value = rawValue.map((val) => Number(val));
            } else {
                value = Number(rawValue);
            }
            return [Number(key), value];
        })) as unknown as LookupTables;
};
