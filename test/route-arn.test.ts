import "mocha";
import { AuthorizerResponse } from "../src";
import { expect } from "chai";

const region = "us-west-2";
const awsAccountId = "102413378525";
const apiId = "np6plfykai";
const stage = "dev";
const method = "GET";

describe("Route ARN Path Regex Test Suite", () => {
  it("Will replace path variables with '*'", () => {
    const path = "/variable/{id}";

    const result = AuthorizerResponse.buildRouteArn(
      region,
      awsAccountId,
      apiId,
      stage,
      method,
      path
    );
    expect(result).to.equal(
      `arn:aws:execute-api:${region}:${awsAccountId}:${apiId}/${stage}/${method}/variable/*`
    );
  });
  it("Will replace multiple path variables with '*'", () => {
    const path = "/variable/{id}/hello/{name}";

    const result = AuthorizerResponse.buildRouteArn(
      region,
      awsAccountId,
      apiId,
      stage,
      method,
      path
    );
    expect(result).to.equal(
      `arn:aws:execute-api:${region}:${awsAccountId}:${apiId}/${stage}/${method}/variable/*/hello/*`
    );
  });
});
