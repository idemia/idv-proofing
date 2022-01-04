import { before, POST, route } from 'awilix-koa';
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
  constructor({ gipsApiService }) {
    this.gipsApiService = gipsApiService;
  }

  @POST()
  @route(routes.documents.session)
  @before(
    validate([
      validateRequired(['issuingCountry', 'idDocumentType']),
      validateEnum('idDocumentType', DOC_TYPES),
    ]),
  )
  async createSession(ctx) {
    const {
      body: { issuingCountry, idDocumentType, identityId },
    } = ctx.request;

    const result = await this.gipsApiService.createDocumentSession({
      issuingCountry,
      idDocumentType,
      identityId,
    });
    ctx.respondWith(result);
  }
}
