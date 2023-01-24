import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Access Complete",
      route: event.path,
    }),
  };
}
