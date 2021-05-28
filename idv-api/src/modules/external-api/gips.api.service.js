import axios from 'axios';
import curlirize from 'axios-curlirize';
import FormData from 'form-data';
import { Readable } from 'stream';

import { handleExternalApiResponse } from './utils';
import { env } from '../../lib/env';
import { logger } from '../../lib/logger';

export default class GipsApiService {
  constructor({}) {
    this.client = axios.create({
      baseURL: env.API_GIPS_URL,
      headers: {
        apiKey: env.API_GIPS_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (env.ENABLE_EXT_API_REQUESTS_LOGGER) {
      curlirize(this.client, (result) => {
        const { command } = result;
        logger.debug('GIPS API Request:');
        logger.debug(command);
      });

      this.client.interceptors.response.use((response) => {
        logger.debug('GIPS API Response:');
        logger.debug({
          status: response.status,
          headers: response.headers,
          data: response.data,
        });
        return response;
      });
    }
  }

  @handleExternalApiResponse
  async createIdentity() {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const url = '/identities';
    this._logRequestInfo({
      url,
      method: 'POST',
      message: 'Creates an identity to be used during subsequent requests.',
    });
    return this.client.post('/identities', {}, { headers });
  }

  @handleExternalApiResponse
  async createLiveCaptureSession({ identityId, payload }) {
    const url = `/identities/${identityId}/attributes/portrait/live-capture-session`;
    this._logRequestInfo({
      url,
      method: 'POST',
      message: 'Starts a new live capture video session.',
    });
    return this.client.post(url, payload);
  }

  @handleExternalApiResponse
  async sendConsent({ identityId, payload }) {
    const url = `/identities/${identityId}/consents`;
    this._logRequestInfo({
      url,
      method: 'POST',
      message:
        'Submit confirmation that user consent has been obtained to perform specific evidence verifications for a given period.',
    });
    return this.client.post(url, payload);
  }

  @handleExternalApiResponse
  async getIdentityDetails({ identityId }) {
    const url = `/identities/${identityId}?detailed=true`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message: 'Returns identity details based on a unique ID.',
    });
    return this.client.get(url);
  }

  @handleExternalApiResponse
  async checkPortraitStatus({ identityId, portraitId }) {
    const url = `/identities/${identityId}/status/${portraitId}`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message: 'Get status of a specific evidence.',
    });
    return this.client.get(url);
  }

  @handleExternalApiResponse
  async captureIdDocument({
    identityId,
    documentFront,
    documentBack,
    documentCaptureDetails,
  }) {
    const formData = new FormData();

    if (documentFront) {
      formData.append(
        'DocumentFront',
        Buffer.from(documentFront.base64, 'base64'),
        documentFront.filename,
      );
    }

    if (documentBack) {
      formData.append(
        'DocumentBack',
        Buffer.from(documentBack.base64, 'base64'),
        documentBack.filename,
      );
    }

    if (documentCaptureDetails) {
      const stringified = JSON.stringify(documentCaptureDetails);
      const readable = Readable.from(stringified);
      formData.append('DocumentCaptureDetails', readable, 'details.json');
    }

    const headers = formData.getHeaders();
    headers['Content-Type'] = headers['content-type'];
    delete headers['content-type'];
    const url = `/identities/${identityId}/id-documents/capture`;
    this._logRequestInfo({
      url,
      method: 'POST',
      message: 'Submit pictures of an identity document for verification.',
    });
    return this.client.post(url, formData, { headers });
  }

  @handleExternalApiResponse
  async checkDocumentStatus({ identityId, documentId }) {
    const url = `/identities/${identityId}/status/${documentId}`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message: 'Get status of a specific evidence.',
    });
    return this.client.get(url);
  }

  @handleExternalApiResponse
  async checkIdentityStatus({ identityId }) {
    const url = `/identities/${identityId}/status`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message: 'Returns identity status based on a unique ID.',
    });
    return this.client.get(url);
  }

  async getCapturedPortrait({ identityId }) {
    const url = `/identities/${identityId}/attributes/portrait/capture`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message: 'Retrieve the portrait image capture for this identity.',
    });
    return this.client.get(url, { responseType: 'arraybuffer' });
  }

  @handleExternalApiResponse
  async getPortraitCaptureDetails({ identityId }) {
    const url = `/identities/${identityId}/attributes/portrait/capture`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message: 'Retrieve the portrait image capture for this identity.',
    });
    return this.client.get(url);
  }

  async getProof({ identityId }) {
    const url = `/identities/${identityId}/proof`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message:
        'Returns the proof associated with the identity based on its unique ID and discards the transaction linked to that identity.',
    });
    return this.client.get(url, { responseType: 'arraybuffer' });
  }

  async getDocumentImage({ identityId, evidenceId }) {
    const url = `/identities/${identityId}/id-documents/${evidenceId}/capture`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message:
        'Retrieve the captured image of the ID document as multipart/form-data.',
    });
    return this.client.get(url, { responseType: 'arraybuffer' });
  }

  _logRequestInfo({ method, url, message }) {
    logger.info(`[GIPS API] ${method} ${url}`);
    if (message) {
      logger.info(`[GIPS API] ${message}`);
    }
  }
}
