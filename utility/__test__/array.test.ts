import { batch, distinct, partition } from "../array";
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

describe("distinct", () => {
  it("filters duplicate elements", () => {
    const input = [1, 1, 1, 2, 3, 4, 5, 2, 6, 7, 2, 8, 8, 9];
    const result = distinct(input);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it("returns empty when input array is empty", () => {
    const input = [] as any[];
    const result = distinct(input);
    expect(result).toEqual([]);
  });
  it("works for complex types", () => {
    const a = { foo: 1 };
    const b = { bar: 2 };
    const c = { foo: 1, bar: 2 };
    const input = [a, c, a, b];
    const result = distinct(input);
    expect(result).toEqual([a, c, b]);
  });
});

describe("batch", () => {
  it("creates array batches", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = batch(input, 4);
    expect(result).toStrictEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);
  });
  it("creates small remainder array", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = batch(input, 4);
    expect(result).toStrictEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10],
    ]);
  });
  it("returns empty array for empty input", () => {
    const result = batch([], 4);
    expect(result).toStrictEqual([]);
  });
  it("returns complete array for big batch size", () => {
    const input = generateArray(generateNumber, 50);
    const result = batch(input, input.length);
    expect(result).toStrictEqual([input]);
  });
  it("returns complete array for invalid batch size", () => {
    const input = generateArray(generateNumber, 50);
    const result = batch(input, 0);
    expect(result).toStrictEqual([input]);
  });
});
