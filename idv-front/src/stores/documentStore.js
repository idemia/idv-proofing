/* eslint-disable no-console */

import { makeAutoObservable, runInAction } from 'mobx';
import { API, APIRoutes } from '@app/api';
import { clear, getItem, setItem, removeItem, KEYS } from '@utils/storage';
import { applicationStore, routerStore, documentCameraStore } from '@stores';
import routes from '@routes';

export class DocumentStore {
  isInitialized = false;

  isLoading = false;

  countryCode = null;

  docType = null;

  sessionId = null;

  identityId = null;

  sessionExpires = null;

  docFormat = null;

  documentId = null;

  constructor() {
    makeAutoObservable(this);
  }

  documentHasTwoSides = () => {
    return applicationStore.selectedMethod?.docSides?.length > 1;
  };

  back = () => {
    applicationStore.setCurrentWizardStep(0);
    removeItem(KEYS.WIZARD_PROGRESS);
    routerStore.goBack();
  };

  setSessionData = (data) => {
    console.log('@@@ setSessionData: ', data);

    try {
      this.countryCode = data.countryCode;
      this.docType = data.docType;
      documentCameraStore.setCameraLayout(this.docType);
      this.sessionId = data.sessionId;
      this.identityId = data.identityId;
      this.documentId = data.id;
      this.docFormat = data.docFormat;

      runInAction(() => {
        this.isInitialized = true;
      });

      API.post(APIRoutes.sessionCache(data.sessionId), data);
    } catch (error) {
      console.warn(error);
    }
  };

  restoreSessionData = async (sessionId) => {
    console.info('restoreSession()', { sessionId });

    const { data } = await API.get(APIRoutes.sessionCache(sessionId));

    this.setSessionData(data);
  };

  initSession = async () => {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      if (!this.sessionId) {
        if (!getItem(KEYS.SESSION_ID)) {
          const countryCode = getItem(KEYS.COUNTRY_CODE);
          const docType = getItem(KEYS.DOC_TYPE);

          const {
            data: { data: gipsIdentity },
          } = await API.post(APIRoutes.createLivenessIdentity);

          const consentsPayload = [
            {
              approved: true,
              type: 'PORTRAIT',
            },
          ];

          // if SOR check check consent GIV
          if (JSON.parse(getItem(KEYS.SOR_CHECK))) {
            consentsPayload.push({
              approved: true,
              type: 'GIV',
            });
          }

          await API.post(APIRoutes.sendConsent, {
            identityId: gipsIdentity.id,
            payload: consentsPayload,
          });

          const {
            data: { data },
          } = await API.post(APIRoutes.initDocumentSession, {
            issuingCountry: countryCode,
            idDocumentType: docType,
            identityId: gipsIdentity.id,
          });
          runInAction(() => {
            this.setSessionData({
              ...data,
              docType,
              identityId: gipsIdentity.id,
              docFormat: 'ID1',
            });
          });
          setItem(KEYS.SESSION_ID, data.sessionId);
        } else {
          await this.restoreSessionData(getItem(KEYS.SESSION_ID));
        }
      }

      applicationStore.setWizardStepsAndRoutingConfiguration();
    } catch (error) {
      routerStore.push(routes.root);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  reset = () => {
    this.countryCode = null;
    this.docType = null;
    this.sessionId = null;
    this.sessionExpires = null;
    this.docFormat = null;
    this.isInitialized = false;
    clear();
  };
}

export default new DocumentStore();
