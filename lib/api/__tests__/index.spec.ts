import { testMethod } from "../index";

describe("index", () => {
  it("should return true", () => {
    expect(testMethod()).toBeTruthy();
  });
});
