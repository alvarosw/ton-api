import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';

function generatePolicy({
  principalId,
  effect,
  resource,
}: {
  principalId: string;
  effect: 'Allow' | 'Deny';
  resource: string;
}) {
  return {
    principalId,
    ...(effect &&
      resource && {
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: effect,
              Resource: resource,
            },
          ],
        },
      }),
  };
}

export function auth(event: APIGatewayRequestAuthorizerEvent, _context, callback) {
  const token = event['authorizationToken'];
  if (!token) return callback(null, 'Unauthorized');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return callback(null, 'Unauthorized');

    return callback(
      null,
      generatePolicy({
        principalId: (decoded as { id: string }).id,
        effect: 'Allow',
        resource: event['methodArn'],
      }),
    );
  });
}
