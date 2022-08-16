import { badResponse, response } from '../../helpers';
import VisitsService from './visits.service';

const visitsSvc = new VisitsService();

export async function getCount() {
  return visitsSvc
    .getVisitsCount()
    .then((res) => response(200, res))
    .catch((error) => badResponse(error));
}

export async function hitCount() {
  return visitsSvc
    .hitVisitsCount()
    .then((res) => response(200, res))
    .catch((error) => badResponse(error));
}
