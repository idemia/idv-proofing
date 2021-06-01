import { makeAutoObservable, runInAction } from 'mobx';
import get from 'lodash/get';
import last from 'lodash/last';
import { getItem, setItem, KEYS } from '@utils/storage';
import { API, APIRoutes } from '@app/api';
import { sleep } from '@utils';
import { applicationStore, documentStore } from '@stores';
import documentIndicators from '@constants/documentIndicators.json';

const MAX_ATTEMPTS = 360;
const RETRY_INTERVAL = 10000;

function humanize(text) {
  const string = text.replace(/_/g, ' ').toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class SummaryStore {
  documentAuthenticationDetails = [];

  documentBackImage = null;

  documentFrontImage = null;

  documentId = null;

  error = null;

  idDocument = {};

  identityId = null;

  identityInformationStatus = null;

  isLoading = false;

  onFido = false;

  overallScore = null;

  proofDownloadURL = null;

  selfie = {};

  selfieImageURL = null;

  sessionId = null;

  summary = {};

  twoSidesDocument = true;

  constructor() {
    makeAutoObservable(this);
  }

  getIdentityStatus = async (attempts = MAX_ATTEMPTS) => {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const { identityId } = this;

      const {
        data: { data: identityStatusResponse },
      } = await API.get(APIRoutes.checkIdentityStatus(identityId));

      if (identityStatusResponse.globalStatus.status === 'PROCESSING') {
        if (attempts) {
          await sleep(RETRY_INTERVAL);
          await this.getIdentityStatus(attempts - 1);
        } else {
          return new Error('maximum retries were reached');
        }
      } else if (
        identityStatusResponse.singleStatuses.filter(
          singleStatus => singleStatus.status === 'ADJUDICATION',
        ).length
      ) {
        runInAction(() => {
          this.onFido = true;
        });

        if (attempts) {
          await sleep(RETRY_INTERVAL);
          await this.getIdentityStatus(attempts - 1);
        } else {
          return new Error('maximum retries were reached');
        }
      } else {
        const {
          data: { data: identity },
        } = await API.get(APIRoutes.getIdentity(identityId));

        const [idDocument] = get(identity, 'idDocuments');
        setItem(KEYS.DOCUMENT_ID, idDocument.evidenceId);

        runInAction(() => {
          this.summary = identity;
          this.documentId = idDocument.evidenceId;
        });
        this.processIdentity(identity);
      }
    } catch (error) {
      runInAction(() => {
        this.error = {
          msg: 'Something went wrong',
        };
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  processIdentity = identity => {
    this.overallScore = get(identity, 'globalStatus.levelOfAssurance', null);

    this.idDocument = last(get(identity, 'idDocuments', {}));
    this.selfie = get(identity, 'portrait', {});

    this.selfieImageURL = `${
      process.env.REACT_APP_API_URL
    }${APIRoutes.getCapturedPortrait(this.identityId)}`;

    this.documentFrontImage = `${
      process.env.REACT_APP_API_URL
    }${APIRoutes.getDocumentImage(this.identityId, this.documentId)}`;

    this.twoSidesDocument = documentStore.documentHasTwoSides(
      this.idDocument.type,
    );

    if (this.twoSidesDocument) {
      this.documentBackImage = `${
        process.env.REACT_APP_API_URL
      }${APIRoutes.getDocumentImage(this.identityId, this.documentId, 'back')}`;
    }

    // map evidence status for Document Authentication
    const evidenceStatus = get(this.idDocument, 'evidenceStatus');
    const positiveIndicators = get(evidenceStatus, 'positiveIndicators', []);
    const unverifiedIndicators = get(
      evidenceStatus,
      'unverifiedIndicators',
      [],
    );
    const warningIndicators = get(evidenceStatus, 'warningIndicators', []);

    const positive = positiveIndicators.map(indicator => {
      const indicatorStriped = indicator.toString().replace('_OK', '');
      return {
        text: humanize(indicatorStriped),
        description: documentIndicators[indicatorStriped],
        status: 'passed',
      };
    });
    const unverified = unverifiedIndicators.map(indicator => {
      const indicatorStriped = indicator.toString().replace('_UNVERIFIED', '');
      return {
        text: humanize(indicatorStriped),
        description: documentIndicators[indicatorStriped],
        status: 'untested',
      };
    });
    const warnings = warningIndicators.map(indicator => {
      const indicatorStriped = indicator.toString().replace('_FAILED', '');
      return {
        text: humanize(indicatorStriped),
        description: documentIndicators[indicatorStriped],
        status: 'failed',
      };
    });

    this.documentAuthenticationDetails = [
      ...positive,
      ...unverified,
      ...warnings,
    ];

    this.proofDownloadURL = `${
      process.env.REACT_APP_API_URL
    }${APIRoutes.getProof(this.identityId)}`;

    this.identityInformationStatus =
      !!this.overallScore && this.overallScore !== 'LOA0'
        ? 'VERIFIED'
        : 'NOT_VERIFIED';
  };

  initSummary = async () => {
    try {
      this.restoreIds();

      if (this.identityId && this.sessionId) {
        await this.getIdentityStatus();
      } else {
        throw new Error('missing parameters');
      }
    } catch (error) {
      if (!error.data) {
        runInAction(() => {
          this.isLoading = false;
          this.error = {
            msg: 'Something went wrong',
          };
        });
      }
    }
  };

  setIds = (identityId, sessionId) => {
    this.identityId = identityId;
    this.sessionId = sessionId;
  };

  restoreIds = () => {
    if (!this.identityId || !this.sessionId) {
      this.identityId = getItem(KEYS.IDENTITY_ID);
      this.sessionId = getItem(KEYS.SESSION_ID);
      applicationStore.setWizardStepsAndRoutingConfiguration();
    }
  };

  reset = () => {
    this.isLoading = false;
    this.documentId = null;
    this.identityId = null;
    this.sessionId = null;
    this.summary = {};
    this.error = null;
  };
}

export default new SummaryStore();
