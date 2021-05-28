const STORAGE_KEY_PREFFIX = 'id&v:';

export const KEYS = {
  SESSION_ID: 'SESSION_ID',
  METHOD_ID: 'METHOD_ID',
  COUNTRY_CODE: 'COUNTRY_CODE',
  SOR_CHECK: 'SOR_CHECK',
  DOC_TYPE: 'DOC_TYPE',
  DOC_SIDE: 'DOC_SIDE',
  IDENTITY_ID: 'IDENTITY_ID',
  CONSENT_ID: 'CONSENT_ID',
  LIVENESS_TYPE: 'LIVENESS_TYPE',
  LIVENESS_SESSION_ID: 'LIVENESS_SESSION_ID',
  DOCUMENT_ID: 'DOCUMENT_ID',
  RETURN_TO_DESKTOP: 'RETURN_TO_DESKTOP',
  WIZARD_PROGRESS: 'WIZARD_PROGRESS',
};

const MAP_KEYS_NAMES = {
  [KEYS.SESSION_ID]: `${STORAGE_KEY_PREFFIX}sessionId`,
  [KEYS.METHOD_ID]: `${STORAGE_KEY_PREFFIX}methodId`,
  [KEYS.COUNTRY_CODE]: `${STORAGE_KEY_PREFFIX}countryCode`,
  [KEYS.DOC_TYPE]: `${STORAGE_KEY_PREFFIX}docType`,
  [KEYS.DOC_SIDE]: `${STORAGE_KEY_PREFFIX}docSide`,
  [KEYS.SOR_CHECK]: `${STORAGE_KEY_PREFFIX}sorCheck`,
  [KEYS.IDENTITY_ID]: `${STORAGE_KEY_PREFFIX}identityId`,
  [KEYS.CONSENT_ID]: `${STORAGE_KEY_PREFFIX}consentId`,
  [KEYS.LIVENESS_TYPE]: `${STORAGE_KEY_PREFFIX}livenessType`,
  [KEYS.LIVENESS_SESSION_ID]: `${STORAGE_KEY_PREFFIX}livenessSessionId`,
  [KEYS.DOCUMENT_ID]: `${STORAGE_KEY_PREFFIX}documentId`,
  [KEYS.RETURN_TO_DESKTOP]: `${STORAGE_KEY_PREFFIX}returnToDesktop`,
  [KEYS.WIZARD_PROGRESS]: `${STORAGE_KEY_PREFFIX}wizardProgress`,
};

export const REQUIRED_KEYS = [
  KEYS.IDENTITY_ID,
  KEYS.CONSENT_ID,
  KEYS.LIVENESS_SESSION_ID,
  KEYS.LIVENESS_TYPE,
];

export const setItem = (key, value) =>
  localStorage.setItem(MAP_KEYS_NAMES[key], value);

export const getItem = key => localStorage.getItem(MAP_KEYS_NAMES[key]);

export const removeItem = key => localStorage.removeItem(MAP_KEYS_NAMES[key]);

export const clear = () => {
  const lsKeys = Object.keys(localStorage);
  lsKeys.forEach(key => {
    if (key.indexOf(STORAGE_KEY_PREFFIX) !== -1) {
      localStorage.removeItem(key);
    }
  });
};
