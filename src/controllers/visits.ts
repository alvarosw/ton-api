import axios from 'axios';
import { Exception } from '../utils';

const { COUNTER_API_URL, COUNTER_NAMESPACE, COUNTER_KEY } = process.env;

enum CounterOpt {
  Hit = 'hit',
  Count = 'count',
}
export default class VisitsService {
  async hitVisitsCount() {
    return this.counterApiRequest(CounterOpt.Hit);
  }

  async getVisitsCount() {
    return this.counterApiRequest(CounterOpt.Count);
  }

  private async counterApiRequest(action: CounterOpt) {
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
