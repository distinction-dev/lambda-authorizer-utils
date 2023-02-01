import "mocha";
import { AuthorizerResponse } from "../src";
import { expect } from "chai";

describe("Auth Response Test Suite", () => {
  it("Will Create Auth Response Instance", () => {
    const methodArn =
      "arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/test-stage/GET/test-path";
    const principalId = "apigateway.amazonaws.com";

    const response = AuthorizerResponse.fromMethodArn(principalId, methodArn);
    expect(response.region).to.equal("us-west-2");
    expect(response.awsAccountId).to.equal("123456789012");
    expect(response.apiId).to.equal("ymy8tbxw7b");
    expect(response.stage).to.equal("test-stage");
  });
});
