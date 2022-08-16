import axios from 'axios';
import { Exception } from '../../helpers';

const { COUNTER_API_URL, COUNTER_NAMESPACE, COUNTER_KEY } = process.env;

export default class VisitsService {
  async hitVisitsCount() {
    return this.counterApiRequest('hit');
  }

  async getVisitsCount() {
    return this.counterApiRequest('get');
  }

  private async counterApiRequest(action: 'get' | 'hit') {
    try {
      const url = `${COUNTER_API_URL}/${action}/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;
      const { data } = await axios.get(url);

      return data;
    } catch (error) {
      return new Exception({
        message: `Failed to ${action} visits count`,
      });
    }
  }
}
