test("Foo", () => {});

export function generateString(length = 32) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (result.length < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateArray<T>(generator: () => T, length = 10): T[] {
  const ret: T[] = [];
  for (let i = 0; i < length; i++) {
    ret.push(generator());
  }
  return ret;
}
