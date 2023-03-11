export type Value = {
    count: number;
    valueType: number;
} & Partial<{
    targetNo: number;
    targetType: number;
    source: string;
}>;