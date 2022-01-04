import { makeAutoObservable, runInAction } from 'mobx';

import { API, APIRoutes } from '@app/api';
import { clear, getItem, setItem, KEYS, REQUIRED_KEYS } from '@utils/storage';
import { applicationStore, documentStore, routerStore } from '@stores';
import routes from '@routes';

export class LivenessStore {
  isLoading = false;

  initialized = false;

  sessionId = null;

  consentId = null;

  challengeResult = null;

  livenessType = null;

  lsid = null;

  imageId = null;

  constructor() {
    makeAutoObservable(this);
  }

  restoreLivenessSession = async () => {
    try {
      if (!this.consentId || !this.sessionId) {
        const missingData = [];
        REQUIRED_KEYS.forEach((key) => {
          if (!getItem(key)) {
            console.log('@@@ required data is missing: ', key); // eslint-disable-line no-console
            missingData.push(key);
            routerStore.push(routes.root);
          }
        });

        if (!missingData.length) {
          // eslint-disable-next-line no-console
          console.log('@@@ restoring session from localStorage');
          runInAction(() => {
            this.consentId = getItem(KEYS.CONSENT_ID);
            this.sessionId = getItem(KEYS.LIVENESS_SESSION_ID);
            this.livenessType = getItem(KEYS.LIVENESS_TYPE);
          });
        }
      }
    } catch (error) {
      console.warn(error); // eslint-disable-line
    }
  };

  initLivenessSession = async () => {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      if (!this.livenessType) {
        runInAction(() => {
          this.livenessType = getItem(KEYS.LIVENESS_TYPE);
        });
      }

      if (applicationStore.networkConnectionDetails.goodConnectivity) {
        await documentStore.initSession();

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

        const {
          data: {
            data: [consent],
          },
        } = await API.post(APIRoutes.sendConsent, {
          identityId: documentStore.identityId,
          payload: consentsPayload,
        });

        const sessionPayload = {
          identityId: documentStore.identityId,
          payload: {
            type: this.livenessType,
          },
        };

        const {
          data: { data: livenessSession },
        } = await API.post(APIRoutes.createLivenessSession, sessionPayload);

        const { sessionId } = livenessSession;
        // eslint-disable-next-line
        console.log(`@@@ init session with GIPS: ${sessionId}`, {
          sessionPayload,
        });
        if (livenessSession.errors) {
          throw new Error(
            `${livenessSession.errors[0].code}: ${livenessSession.errors[0].message}`,
          );
        }

        runInAction(() => {
          this.consentId = consent.consentId;
          this.sessionId = sessionId;

          setItem(KEYS.CONSENT_ID, this.consentId);
          setItem(KEYS.LIVENESS_SESSION_ID, this.sessionId);
        });

        applicationStore.setWizardStepsAndRoutingConfiguration();
      }
    } catch (error) {
      console.warn(error); // eslint-disable-line
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.initialized = true;
      });
    }
  };

  reset = () => {
    this.initialized = false;
    this.isLoading = false;
    this.sessionId = null;
    this.consentId = null;
    this.challengeResult = null;
    this.livenessType = null;
    this.lsid = null;
    this.imageId = null;

    clear();
  };
}

export default new LivenessStore();
