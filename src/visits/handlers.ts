import { badResponse, response } from '../utils';
import { APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

const { COUNTER_API_URL, COUNTER_NAMESPACE, COUNTER_KEY } = process.env;

export async function getCount(): Promise<APIGatewayProxyResult> {
  try {
    const data = await counterApiRequest('get');

    return response(200, data);
  } catch (e) {
    return badResponse(500, 'Failed to get visits count');
  }
}

export async function hitCount(): Promise<APIGatewayProxyResult> {
  try {
    const data = await counterApiRequest('hit');

    return response(200, data);
  } catch (e) {
    return badResponse(500, 'Failed to hit to visits count');
  }
}

async function counterApiRequest(action: 'get' | 'hit') {
  const url = `${COUNTER_API_URL}/${action}/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;
  const { data } = await axios.get(url);

  return data;
}
