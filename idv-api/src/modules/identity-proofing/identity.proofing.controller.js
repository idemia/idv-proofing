import { GET, POST, route } from 'awilix-koa';
import get from 'lodash/get';
import find from 'lodash/find';
import { env } from '../../lib/env';
import routes from '../routes';

const multipart = require('parse-multipart-data');

@route(routes.identityProofing.root)
export default class IdentityProofingController {
  constructor({ gipsApiService }) {
    this.gipsApiService = gipsApiService;
  }

  @POST()
  @route(routes.identityProofing.identity)
  async createIdentity(ctx) {
    const result = await this.gipsApiService.createIdentity();
    ctx.respondWith(result);
  }

  @POST()
  @route(routes.identityProofing.session)
  async createSession(ctx) {
    const { identityId, payload } = ctx.request.body;

    const result = await this.gipsApiService.createLiveCaptureSession({
      identityId,
      payload: {
        ...payload,
        securityLevel: env.SECURITY_LEVEL,
        nbChallenge: env.NB_CHALLENGE,
      },
    });
    ctx.respondWith(result);
  }

  @POST()
  @route(routes.identityProofing.consents)
  async sendConsent(ctx) {
    const { identityId, payload } = ctx.request.body;
    const result = await this.gipsApiService.sendConsent({
      identityId,
      payload,
    });
    ctx.respondWith(result);
  }

  @POST()
  @route(routes.identityProofing.captureIdDocument)
  async captureIdDocument(ctx) {
    const { identityId, payload } = ctx.request.body;
    const result = await this.gipsApiService.captureIdDocument({
      identityId,
      ...payload,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.identityProofing.checkDocumentStatus)
  async checkDocumentStatus(ctx) {
    const { identityId, documentId } = ctx.request.query;
    const result = await this.gipsApiService.checkDocumentStatus({
      identityId,
      documentId,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.identityProofing.checkIdentityStatus)
  async checkIdentityStatus(ctx) {
    const { identityId } = ctx.request.query;
    const result = await this.gipsApiService.checkIdentityStatus({
      identityId,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.identityProofing.getIdentity)
  async getIdentity(ctx) {
    const { identityId } = ctx.request.query;
    const result = await this.gipsApiService.getIdentityDetails({
      identityId,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.identityProofing.getCapturedPortrait)
  async getCapturedPortrait(ctx) {
    const { identityId } = ctx.request.query;
    const result = await this.gipsApiService.getCapturedPortrait({
      identityId,
    });

    const boundary = `${result.headers['content-type'].split('boundary=')[1]}`;
    const bufferedData = Buffer.from(result.data);
    const parts = multipart.parse(bufferedData, boundary);
    const resultFile = parts[0];

    ctx.set(
      'Content-Disposition',
      `attachment; filename=${resultFile.filename}`,
    );
    ctx.set('Content-type', resultFile.type);
    ctx.body = resultFile.data;
  }

  @GET()
  @route(routes.identityProofing.checkPortraitStatus)
  async checkPortraitStatus(ctx) {
    const { identityId, portraitId } = ctx.request.query;
    const result = await this.gipsApiService.checkPortraitStatus({
      identityId,
      portraitId,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.identityProofing.getProof)
  async getProof(ctx) {
    const { identityId } = ctx.request.query;
    const gipsApiResponse = await this.gipsApiService.getProof({
      identityId,
    });

    const proofFile = this._getProofFile(gipsApiResponse);
    ctx.set('Content-Disposition', `attachment; filename=${proofFile.name}`);
    ctx.set('Content-type', 'application/octet-stream');
    ctx.body = proofFile.data;
  }

  _getProofFile(gipsApiResponse) {
    const boundary = `${
      gipsApiResponse.headers['content-type'].split('boundary=')[1]
    }`;
    const parts = multipart.parse(gipsApiResponse.data, boundary);
    const resultFile = parts[0];
    if (this._doesFileStartWithNewLine({ resultFile })) {
      resultFile.data = resultFile.data.slice(2);
    }
    return resultFile;
  }

  _doesFileStartWithNewLine({ resultFile }) {
    const carriageReturnCharCode = 13;
    const lineFeedCharCode = 10;
    return resultFile.data[0] == carriageReturnCharCode && resultFile.data[1] == lineFeedCharCode;
  }

  @GET()
  @route(routes.identityProofing.gerPortraitDetails)
  async getPortraitDetails(ctx) {
    const { identityId } = ctx.request.query;
    const result = await this.gipsApiService.getPortraitCaptureDetails({
      identityId,
    });
    ctx.respondWith(result);
  }

  @GET()
  @route(routes.identityProofing.getDocumentImage)
  async getDocumentImage(ctx) {
    const { identityId, documentId } = ctx.request.query;
    const side = get(ctx.request.query, 'side', 'front');
    const expectedFilename =
      side === 'front' ? 'DocumentFront' : 'DocumentBack';
    const result = await this.gipsApiService.getDocumentImage({
      identityId,
      evidenceId: documentId,
    });

    const boundary = `${result.headers['content-type'].split('boundary=')[1]}`;
    const bufferedData = Buffer.from(result.data);
    const parts = multipart.parse(bufferedData, boundary);
    console.log({ find });
    const resultFile = find(
      parts,
      (p) => p.filename.indexOf(expectedFilename) !== -1,
    );
    console.log({ resultFile });

    ctx.set(
      'Content-Disposition',
      `attachment; filename=${resultFile.filename}`,
    );
    ctx.set('Content-type', resultFile.type);
    ctx.body = resultFile.data;
  }
}
