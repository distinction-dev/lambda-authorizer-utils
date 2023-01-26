import "mocha";
import { assert } from "chai";
import { PATH_REGEXP } from "../src/authorizerResponse";

describe("PATH_REGEXP tests", () => {
  it("Test positive cases", () => {
    const positiveTests = [
      "order",
      "/order",
      "order/",
      "order/{id}",
      "/order/{id}",
      "order/{id}",
      "order/{id}/",
      "/order/{id}/",
      "order/{id}/",
      "order/{id}/abc",
      "/order/{id}/abc",
      "order/{id}/abc/",
      "/order/{id}/abc/",
      "*",
      "/*",
      "*/",
      "/*/",
      "/*/*/",
      "order/item/{id}/abc/to/test",
    ];

    positiveTests.forEach(testCase => {
      assert.isTrue(PATH_REGEXP.test(testCase));
    });
  });

  it("Test negative cases", () => {
    const negativeTests = ["/order{id}/"];

    negativeTests.forEach(testCase => {
      assert.isFalse(PATH_REGEXP.test(testCase));
    });
  });
});
