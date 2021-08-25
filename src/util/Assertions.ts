export function assertTrue(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}