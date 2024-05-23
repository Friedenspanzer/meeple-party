import { partition } from "../array";
import { generateArray, generateNumber } from "../test";

describe("partition", () => {
  it("splits array according to discriminator function", () => {
    const input = generateArray(generateNumber, 100);
    const even = input.filter((n) => n % 2 === 0);
    const odd = input.filter((n) => n % 2 === 1);
    const [pass, fail] = partition(input, (n) => n % 2 === 0);
    expect(pass).toEqual(even);
    expect(fail).toEqual(odd);
  });
  it("returns empty results when input is empty", () => {
    const input = [] as number[];
    const partitioned = partition(input, () => true);
    expect(partitioned.length).toBe(2);
    expect(partitioned[0].length).toBe(0);
    expect(partitioned[1].length).toBe(0);
  });
  it("returns only passed when discriminator is always true", () => {
    const input = generateArray(generateNumber);
    const [pass, fail] = partition(input, () => true);
    expect(pass).toEqual(input);
    expect(fail).toEqual([]);
  });
  it("returns only failed when discriminator is always false", () => {
    const input = generateArray(generateNumber);
    const [pass, fail] = partition(input, () => false);
    expect(pass).toEqual([]);
    expect(fail).toEqual(input);
  });
});
