export const minZeroDecrease = (num: number): number => {
    if (num > 0) {
        return num - 1;
    }
    return 0;
}
