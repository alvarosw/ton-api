import { Exception, HttpTools } from '../../utils';
import VisitController from '../../controllers/visits';

const controller = new VisitController();

export async function handle() {
  try {
    const count = await controller.getVisitsCount();

    return HttpTools.buildResponse(200, count);
  } catch (error) {
    if (error instanceof Exception)
      return HttpTools.buildResponse(error.statusCode, error.message);
    return HttpTools.buildResponse(500, 'Something went wrong. Try again later.');
  }
}
