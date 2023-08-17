import { APIGatewayRequestAuthorizerEvent, Callback, Context } from 'aws-lambda';
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

export function handle(
  event: APIGatewayRequestAuthorizerEvent & { authorizationToken?: string },
  _context: Context,
  callback: Callback,
) {
  const token = event.authorizationToken || '';
  if (!token) return callback(null, 'Unauthorized');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.info('error on jwt verification', err);
      return callback(null, 'Unauthorized');
    }
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
