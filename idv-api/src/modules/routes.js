export default {
  session: {
    root: '/session',
    cache: '/cache',
  },
  documents: {
    root: '/document',
    session: '/session',
  },
  identityProofing: {
    root: '/identity-proofing',
    identity: '/identity',
    session: '/session',
    consents: '/consents',
    captureIdDocument: '/capture-id-document',
    checkDocumentStatus: '/check-document-status',
    checkIdentityStatus: '/check-identity-status',
    getIdentity: '/get-identity',
    getCapturedPortrait: '/get-captured-portrait',
    checkPortraitStatus: '/check-portrait-status',
    getProof: '/get-proof',
    gerPortraitDetails: '/get-portrait-details',
    getDocumentImage: '/get-document-image',
  },
  heartbeat: {
    root: '/heartbeat',
  },
  pug: {
    root: '/auth',
    sslAuth: '/ssl/*',
    thanks: '/thanks',
  },
};
