import "mocha";
import axios, { AxiosError } from "axios";
import { create } from "njwt";
import { expect, assert } from "chai";
const basePath = "https://xyym7mxtoa.execute-api.us-east-1.amazonaws.com/dev";

describe("API Test Suite", () => {
  const superUserToken = create(
    {
      email: "superuser@distinction.dev",
    },
    "test-key"
  ).compact();
  const adminToken = create(
    {
      email: "admin@distinction.dev",
    },
    "test-key"
  ).compact();
  it("Will allow superuser", async () => {
    const response = await axios.get(`${basePath}/hello`, {
      headers: {
        Authorization: superUserToken,
      },
    });
    expect(response.status).to.equal(200);
  });
  it("Will allow /hello to admin", async () => {
    const response = await axios.get(`${basePath}/hello`, {
      headers: {
        Authorization: adminToken,
      },
    });
    expect(response.status).to.equal(200);
  });
  it("Will allow /variable/{id} to admin", async () => {
    const response = await axios.get(`${basePath}/variable/420`, {
      headers: {
        Authorization: adminToken,
      },
    });
    expect(response.status).to.equal(200);
  });
  it("Will not allow /hello2 to admin", async () => {
    try {
      await axios.get(`${basePath}/hello2`, {
        headers: {
          Authorization: adminToken,
        },
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      assert.isNotNull(axiosError.response);
      if (axiosError.response) {
        expect(axiosError.response.status).to.equal(403);
      }
    }
  });
});
