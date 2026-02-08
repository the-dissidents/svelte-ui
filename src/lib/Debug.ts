export const Debug: {
    assert(cond: boolean, reason?: string): asserts cond,
    never(value?: never): never,
} = {
    assert(cond, reason) {
        console.assert(cond, reason);
    },
    never(x): never {
        const msg = `Unreachable code reached (never=${x})`;
        console.error(msg);
        throw new Error(msg);
    }
}