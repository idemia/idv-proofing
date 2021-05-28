import axios from 'axios';
import curlirize from 'axios-curlirize';

import { handleExternalApiResponse } from './utils';
import { env } from '../../lib/env';
import { logger } from '../../lib/logger';

export default class DocServerApiService {
  constructor({}) {
    this.client = axios.create({
      baseURL: env.API_DOC_SERVER_URL,
      headers: {
        apiKey: env.API_DOC_SERVER_KEY,
      },
    });

    if (env.ENABLE_EXT_API_REQUESTS_LOGGER) {
      curlirize(this.client, (result) => {
        const { command } = result;
        logger.debug('DOC SERVER API Request:');
        logger.debug(command);
      });

      this.client.interceptors.response.use((response) => {
        logger.debug('DOC SERVER API Response:');
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
  async createDocumentSession({ countryCode, docType, docSides }) {
    const url = '/document-sessions';
    const data = {
      countryCode,
      docType,
      docSides,
    };
    this._logRequestInfo({
      url,
      method: 'POST',
      message: 'Initialize a new document session.',
    });
    return this.client.post(url, data);
  }

  @handleExternalApiResponse
  async getDocumentSession({ sessionId }) {
    const url = `/document-sessions/${sessionId}`;
    this._logRequestInfo({
      url,
      method: 'GET',
      message:
        'Get a document capture session with all the captures it contains.',
    });
    return this.client.get(url);
  }

  @handleExternalApiResponse
  async getCaptureResult({ sessionId, documentSideId }) {
    let url = `/document-sessions/${sessionId}/captures`;
    if (documentSideId) {
      url += `/${documentSideId}`;
    }
    this._logRequestInfo({
      url,
      method: 'GET',
      message: 'Get all document captures in the given session.',
    });
    return this.client.get(url);
  }

  _logRequestInfo({ method, url, message }) {
    logger.info(`[DOCS API] ${method} ${url}`);
    if (message) {
      logger.info(`[DOCS API] ${message}`);
    }
  }
}
