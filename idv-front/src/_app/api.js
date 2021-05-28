import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error') {
      toast.error('Ups. Looks like no connection with API');
    }
    return Promise.reject(error.response.data);
  },
);

const APIRoutes = {
  initDocumentSession: '/document/session',
  getDocumentSession: sessionId => `/document/session/${sessionId}`,
  getCapturedResults: sessionId => `/document/session/${sessionId}/captures`,
  createLivenessIdentity: '/identity-proofing/identity',
  sendConsent: '/identity-proofing/consents',
  createLivenessSession: '/identity-proofing/session',
  verifyIdDocument: '/identity-proofing/capture-id-document',
  checkIdentityStatus: identityId =>
    `/identity-proofing/check-identity-status?identityId=${identityId}`,
  getIdentity: identityId =>
    `/identity-proofing/get-identity?identityId=${identityId}`,
  getCapturedPortrait: identityId =>
    `/identity-proofing/get-captured-portrait?identityId=${identityId}`,
  getProof: identityId =>
    `/identity-proofing/get-proof?identityId=${identityId}`,
  getDocumentImage: (identityId, documentId, side = 'front') =>
    `/identity-proofing/get-document-image?identityId=${identityId}&documentId=${documentId}&side=${side}`,
};

export { API, APIRoutes };
