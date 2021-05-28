import { before, GET, POST, route } from 'awilix-koa';
import { validate, validateEnum, validateRequired } from '../../lib/validator';
import routes from '../routes';

const DOC_TYPES = [
  'UNKNOWN',
  'IDENTITY_CARD',
  'RESIDENT_CARD',
  'PASSPORT',
  'DRIVING_LICENSE',
];

@route(routes.documents.root)
export default class DocumentsController {
  constructor({ docServerApiService }) {
    this.docServerApiService = docServerApiService;
  }

  @POST()
  @route(routes.documents.session)
  @before(
    validate([
      validateRequired(['countryCode', 'docType', 'docSides']),
      validateEnum('docType', DOC_TYPES),
    ]),
  )
  async createSession(ctx) {
    const { countryCode, docType, docSides } = ctx.request.body;
    const result = await this.docServerApiService.createDocumentSession({
      countryCode,
      docType,
      docSides,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.documents.sessionDetails)
  async getSession(ctx) {
    const { id } = ctx.params;
    const result = await this.docServerApiService.getDocumentSession({
      sessionId: id,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.documents.sessionCaptureResult)
  async getDocCaptureResult(ctx) {
    const { sessionId, documentSideId } = ctx.params;
    const result = await this.docServerApiService.getCaptureResult({
      sessionId,
      documentSideId,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.documents.sessionCaptures)
  async getDocCaptureResult(ctx) {
    const { sessionId } = ctx.params;
    const result = await this.docServerApiService.getCaptureResult({
      sessionId,
    });
    ctx.respondWith(result);
  }
}
