import { Response } from '../../helpers';
import VisitsService from './visits.service';

const visitsSvc = new VisitsService();

export async function getCount() {
  return visitsSvc
    .getVisitsCount()
    .then((res) => Response.ok(200, res))
    .catch((error) => Response.error(error));
}

export async function hitCount() {
  return visitsSvc
    .hitVisitsCount()
    .then((res) => Response.ok(200, res))
    .catch((error) => Response.error(error));
}
