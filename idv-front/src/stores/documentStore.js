import { makeAutoObservable, runInAction } from 'mobx';
import { API, APIRoutes } from '@app/api';
import { clear, getItem, setItem, removeItem, KEYS } from '@utils/storage';
import { toast } from 'react-toastify';
import last from 'lodash/last';
import {
  applicationStore,
  routerStore,
  documentCameraStore,
  livenessStore,
} from '@stores';
import { sleep } from '@utils';
import routes from '@routes';

const MAX_ATTEMPTS = 10;
const RETRY_INTERVAL = 1000;

const DOCUMENT_CAPTURE_STATUS = {
  TIMEOUT: 'TIMEOUT',
  FAILED: 'FAILED',
  DONE: 'DONE',
  IN_PROGRESS: 'IN_PROGRESS',
};

export class DocumentStore {
  isInitialized = false;

  isLoading = false;

  countryCode = null;

  docType = null;

  docSideRules = null;

  docSide = null;

  sessionId = null;

  sessionExpires = null;

  docFormat = null;

  fetchingCaptureResults = false;

  captureResults = {};

  frontCaptureId = null;

  backCaptureId = null;

  documentFront = null;

  documentBack = null;

  documentId = null;

  showCapturedImageOutlines = true;

  constructor() {
    makeAutoObservable(this);
  }

  setDocSide = sideIndex => {
    this.docSide = this.docSideRules[
      sideIndex >= this.docSideRules.length
        ? this.docSideRules.length - 1
        : sideIndex
    ];
    setItem(KEYS.DOC_SIDE, JSON.stringify(this.docSide));
    documentCameraStore.setCameraLayout(this.docType);
  };

  backToFirstSide = () => {
    applicationStore.setCurrentWizardStep(0);
    removeItem(KEYS.WIZARD_PROGRESS);
    this.setDocSide(0);
    routerStore.goBack();
  };

  setSessionData = data => {
    // eslint-disable-next-line no-console
    console.log('@@@ setSessionData: ', data);
    try {
      this.countryCode = data.countryCode;
      this.docType = data.docType;
      this.sessionId = data.id;
      this.sessionExpires = data.expires;
      this.docFormat = data.docFormat;
      this.docSideRules = data.docSideRules;
    } catch (error) {
      console.warn(error); // eslint-disable-line
    }
  };

  getSessionData = async sessionId => {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const {
        data: { data },
      } = await API.get(APIRoutes.getDocumentSession(sessionId));

      runInAction(() => {
        this.setSessionData(data);
        this.isInitialized = true;
      });
    } catch (error) {
      removeItem(KEYS.SESSION_ID);
      routerStore.push(routes.root);
      toast.error(error.response.data);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
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
            data: { data },
          } = await API.post(APIRoutes.initDocumentSession, {
            countryCode,
            docType,
            docSides: applicationStore.selectedMethod.docSides,
          });
          runInAction(() => {
            this.setSessionData(data);
          });
          setItem(KEYS.SESSION_ID, data.id);
        } else {
          // restore session
          const sessionId = getItem(KEYS.SESSION_ID);
          await this.getSessionData(sessionId);
        }
      }

      if (getItem(KEYS.DOC_SIDE)) {
        runInAction(() => {
          this.docSide = JSON.parse(getItem(KEYS.DOC_SIDE));
        });
      } else {
        this.setDocSide(0);
      }

      applicationStore.setWizardStepsAndRoutingConfiguration();

      runInAction(() => {
        this.isInitialized = true;
      });
    } catch (error) {
      routerStore.push(routes.root);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  calculateCapturedDocumentStatus = document => {
    // eslint-disable-next-line no-console
    console.log('@@@ calculating document captured status');

    switch (document.status) {
      case DOCUMENT_CAPTURE_STATUS.TIMEOUT:
        return DOCUMENT_CAPTURE_STATUS.TIMEOUT;
      case DOCUMENT_CAPTURE_STATUS.DONE:
        return DOCUMENT_CAPTURE_STATUS.DONE;
      default:
        return DOCUMENT_CAPTURE_STATUS.FAILED;
    }
  };

  getCapturedResults = async (attempts = MAX_ATTEMPTS, sideId) => {
    console.log('@@@@ getCapturedResults'); // eslint-disable-line no-console
    runInAction(() => {
      this.fetchingCaptureResults = true;
    });
    try {
      if (this.sessionId) {
        const documentSideId = sideId || this.docSide.side.id;
        const {
          data: { data },
        } = await API.get(APIRoutes.getCapturedResults(this.sessionId));

        const currentSideResults = last(
          data.filter(d => d.side.id === documentSideId),
        );

        if (currentSideResults.status === DOCUMENT_CAPTURE_STATUS.IN_PROGRESS) {
          if (attempts) {
            await sleep(RETRY_INTERVAL);
            await this.getCapturedResults(attempts - 1);
          } else {
            return new Error('maximum retries were reached');
          }
        } else {
          currentSideResults.status = this.calculateCapturedDocumentStatus(
            currentSideResults,
          );

          runInAction(() => {
            this.captureResults[documentSideId] = currentSideResults;
            switch (documentSideId) {
              case 'SIDE1':
                this.frontCaptureId = currentSideResults.id;
                this.documentFront = currentSideResults.image;
                break;
              case 'SIDE2':
                this.backCaptureId = currentSideResults.id;
                this.documentBack = currentSideResults.image;
                break;
              default:
                this.frontCaptureId = null;
                this.backCaptureId = null;
                break;
            }
          });
        }
      }
    } catch (error) {
      console.warn(error); // eslint-disable-line
    } finally {
      runInAction(() => {
        this.fetchingCaptureResults = false;
      });
    }
  };

  documentHasTwoSides = () =>
    applicationStore.selectedMethod.docSides.length === 2;

  GIPSverifyDocuments = async () => {
    // eslint-disable-next-line no-console
    console.log('@@@ Sending document to verification');
    try {
      // if there's no document images, refetch captured results
      if (
        (this.documentHasTwoSides() &&
          (!this.documentFront || !this.documentBack)) ||
        !this.documentFront
      ) {
        await Promise.all(
          this.docSideRules.map(async docSideRule => {
            const sideId = docSideRule.side.id;
            await this.getCapturedResults(10, sideId);
          }),
        );
      }

      const { identityId } = livenessStore;

      const payload = {
        identityId,
        payload: {
          documentFront: {
            base64: this.documentFront,
            filename: `front.jpeg`,
          },
          documentCaptureDetails: {
            jurisdiction: this.countryCode,
            documentType: this.docType,
            source: 'LIVE_CAPTURE_IMAGE',
          },
        },
      };

      if (this.documentHasTwoSides()) {
        payload.payload.documentBack = {
          base64: this.documentBack,
          filename: `back.jpeg`,
        };
      }

      const {
        data: { data: verifyDocumentResponse },
      } = await API.post(APIRoutes.verifyIdDocument, payload);

      runInAction(() => {
        this.documentId = verifyDocumentResponse.id;
        setItem(KEYS.DOCUMENT_ID, this.documentId);
      });

      // eslint-disable-next-line no-console
      console.log('@@@ document has been sent to verification');
    } catch (error) {
      console.warn(error); // eslint-disable-line
    }
  };

  getCurrentSideResults = () => {
    try {
      if (this.docSide) {
        return this.captureResults[this.docSide.side.id];
      }
    } catch (error) {
      console.warn(error); // eslint-disable-line no-console
    }
  };

  setNewImageBlob = blob => {
    this.captureResults[this.docSide.side.id].image = blob;
  };

  reset = () => {
    this.countryCode = null;
    this.docType = null;
    this.sessionId = null;
    this.sessionExpires = null;
    this.docSide = null;
    this.docFormat = null;
    this.docSideRules = null;
    this.frontCaptureId = null;
    this.backCaptureId = null;
    this.isInitialized = false;
    clear();
  };
}

export default new DocumentStore();
