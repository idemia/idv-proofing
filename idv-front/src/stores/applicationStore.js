import { makeAutoObservable, runInAction } from 'mobx';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import qs from 'query-string';
import { getItem, setItem, KEYS, clear } from '@utils/storage';
import {
  routerStore,
  documentStore,
  livenessStore,
  summaryStore,
} from '@stores';
import verifications from '@constants/verifications';
import routes from '@routes';

const NetworkCheckSDK = {
  bioserver: BioserverNetworkCheck,
  docserver: DocserverNetworkCheck,
};

const WS_OPTIONS = {
  secure: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
};

const ROUTES_CONFIG = {
  BACK: routes.backId,
  LIVENESS: routes.livenessInstructions,
  SUMMARY: routes.summary,
};
export class ApplicationStore {
  compatibilityChecked = false;

  isLoading = false;

  selectedMethod = null;

  qrURL = null;

  wsConnection = null;

  networkConnectionHasBeenChecked = false;

  checkingNetworkConnection = false;

  weakNetworkConnection = true;

  networkConnectionDetails = {};

  networkCheckError = false;

  networkChecked = false;

  incomatibleMessage = null;

  supportedList = [];

  unsupported = null;

  returnToDesktop = false;

  sides = [];

  currentWizardStep = 0;

  wizardStepCount = 0;

  constructor() {
    makeAutoObservable(this);
  }

  initEmojis = () => {
    try {
      // change emoji icons after all flags have been loaded
      setTimeout(() => {
        [...document.querySelectorAll('.emoji-flag')].forEach(
          n => twemoji.parse(n), // eslint-disable-line  no-undef
        );
      }, 0);
    } catch (error) {
      console.warn(error); // eslint-disable-line no-console
    }
  };

  setQRUrl = () => {
    const { sessionId } = documentStore;
    const encodedUrl = btoa(
      `${process.env.REACT_APP_BASE_URL}${routes.placeId}?s=${sessionId}&methodId=${this.selectedMethod.id}`,
    );
    // const encodedUrl = btoa(`${process.env.REACT_APP_BASE_URL}`);
    this.qrURL = `${process.env.REACT_APP_API_URL}/auth/ssl/${encodedUrl}`;
  };

  checkCompatibility = () =>
    new Promise((resolve, reject) => {
      if (DocserverEnvironment) {
        DocserverEnvironment.detection(true, response => {
          resolve(response);
          runInAction(() => {
            this.compatibilityChecked = true;
          });
        });
      } else {
        reject(new Error('DocserverEnvironment not found'));
      }
    });

  checkBrowserCompatibilityBeforeRender = async () => {
    if (!this.compatibilityChecked) {
      console.log('@@@checking compatibility'); // eslint-disable-line no-console
      const { envDetected, message } = await this.checkCompatibility();
      return this.redirectUnsuportedDevice(envDetected, message);
    }
    return true;
  };

  checkNetworkConnection = (type = 'docserver') => {
    runInAction(() => {
      this.checkingNetworkConnection = true;
      this.networkChecked = false;
      this.weakNetworkConnection = true;
      this.networkConnectionDetails = {
        checkType: type,
      };
      this.networkCheckError = false;
    });

    return new Promise((resolve, reject) => {
      if (NetworkCheckSDK[type]) {
        const speedCheckPath =
          type === 'docserver'
            ? process.env.REACT_APP_DOCSERVER_URL
            : process.env.REACT_APP_VIDEOSERVER_URL;

        NetworkCheckSDK[type].connectivityMeasure({
          downloadURL: `${speedCheckPath}/network-speed`,
          uploadURL: `${speedCheckPath}/network-speed`,
          latencyURL: `${speedCheckPath}/network-latency`,
          onNetworkCheckUpdate: networkConnectionResult => {
            runInAction(() => {
              this.checkingNetworkConnection = false;
              this.networkChecked = true;
              this.weakNetworkConnection = !networkConnectionResult.goodConnectivity;
              this.networkConnectionDetails = {
                ...networkConnectionResult,
                checkType: type,
              };
              this.networkCheckError = false;
              this.networkConnectionHasBeenChecked = true;
            });
            resolve(networkConnectionResult);
          },
          errorFn: () => {
            runInAction(() => {
              this.checkingNetworkConnection = false;
              this.networkChecked = true;
              this.weakNetworkConnection = true;
              this.networkCheckError = true;
              this.networkConnectionHasBeenChecked = true;
            });
            reject(new Error('Network check error'));
          },
        });
      } else {
        runInAction(() => {
          this.checkingNetworkConnection = false;
        });
        reject(new Error(`${type}Environment not found`));
      }
    });
  };

  redirectUnsuportedDevice = (envDetected, message) => {
    if (!envDetected.browser.isSupported || !envDetected.os.isSupported) {
      runInAction(() => {
        if (!envDetected.browser.isSupported) {
          this.supportedList = envDetected.browser.supportedList;
          this.unsupported = 'browser';
        }
        if (!envDetected.os.isSupported) {
          this.supportedList = envDetected.os.supportedList;
          this.unsupported = 'os';
        }
        this.incomatibleMessage = message;
      });
      routerStore.push(routes.incompatible);

      return false;
    }

    return true;
  };

  isSupportedDevice = envDetected =>
    envDetected.browser.isSupported && envDetected.os.isSupported;

  selectMethod = async method => {
    runInAction(() => {
      this.isLoading = true;
      this.selectedMethod = method;
    });

    try {
      setItem(KEYS.METHOD_ID, method.id);
      setItem(KEYS.COUNTRY_CODE, method.countryCode);
      setItem(KEYS.DOC_TYPE, method.docType);
      setItem(KEYS.LIVENESS_TYPE, method.livenessType);
      setItem(KEYS.SOR_CHECK, !!method.sorCheck);

      const { envDetected, message } = await this.checkCompatibility();

      // detect compatibility - if it's not mobile device redirect to QR code page
      if (!envDetected.browser.isSupported && !envDetected.os.isSupported) {
        // init document session
        await documentStore.initSession();

        runInAction(() => {
          this.setQRUrl();
        });
        routerStore.push(routes.redirect);
      } else {
        this.redirectUnsuportedDevice(envDetected, message);
        if (this.isSupportedDevice(envDetected)) {
          routerStore.push(routes.placeId);
        }
      }
    } catch (error) {
      console.warn(error); // eslint-disable-line
      toast.error(error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  initQRpage = async () => {
    try {
      await documentStore.initSession();
      const { sessionId } = documentStore;

      this.wsConnection = io(process.env.REACT_APP_WEBSOCKET, WS_OPTIONS);
      this.wsConnection.on('mobileInitialized', ({ sessionId: ssid }) => {
        if (ssid === sessionId) {
          routerStore.push(`${routes.wait}`);
        }
      });
      this.wsConnection.on('showSummary', ({ sessionId: ssid }) => {
        if (ssid === sessionId) {
          routerStore.push(`${routes.summary}`);
        }
      });

      this.setQRUrl();
    } catch (error) {
      toast.error(error);
      routerStore.push(routes.root);
    }
  };

  initMobileWizard = async () => {
    try {
      const { envDetected, message } = await this.checkCompatibility();
      const {
        location: { search },
      } = routerStore;

      // check device compatibility
      this.redirectUnsuportedDevice(envDetected, message);
      if (this.isSupportedDevice(envDetected)) {
        // get session id from query params
        const { s: ssid, methodId } = qs.parse(search);

        if (this.networkConnectionDetails.goodConnectivity) {
          // init process on mobile device after QR code redirect
          if (ssid && methodId) {
            clear();
            const selectedMethod = verifications.find(
              v => v.id === parseInt(methodId, 10),
            );
            // eslint-disable-next-line no-console
            console.log('@@@ initMobileWizard', {
              selectedMethod,
              methodId,
            });

            setItem(KEYS.SESSION_ID, ssid);
            setItem(KEYS.METHOD_ID, parseInt(methodId, 10));
            setItem(KEYS.RETURN_TO_DESKTOP, true);
            setItem(KEYS.COUNTRY_CODE, selectedMethod.countryCode);
            setItem(KEYS.DOC_TYPE, selectedMethod.docType);
            setItem(KEYS.LIVENESS_TYPE, selectedMethod.livenessType);
            setItem(KEYS.SOR_CHECK, !!selectedMethod.sorCheck);

            runInAction(() => {
              this.returnToDesktop = true;
              this.selectedMethod = selectedMethod;
            });
            routerStore.replace(routes.placeId);
            await documentStore.getSessionData(ssid);
          } else {
            await documentStore.initSession();
          }
        }

        const { sessionId } = documentStore;

        this.setWizardStepsAndRoutingConfiguration();

        if (!this.wsConnection) {
          const websocketConnection = io(
            process.env.REACT_APP_WEBSOCKET,
            WS_OPTIONS,
          );

          websocketConnection.on('connect', () => {
            runInAction(() => {
              this.wsConnection = websocketConnection;
            });
            this.wsConnection.emit('mobileInit', { sessionId });
          });
        } else {
          this.wsConnection.emit('mobileInit', { sessionId });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  retestConnection = async (type = 'docserver') => {
    try {
      await this.checkNetworkConnection(type);
    } catch (error) {
      toast.error(error);
    } finally {
      runInAction(() => {
        this.checkingNetworkConnection = false;
      });
    }
  };

  reconnectWS = () => {
    try {
      if (!this.wsConnection) {
        this.wsConnection = io(process.env.REACT_APP_WEBSOCKET, WS_OPTIONS);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  backToDesktop = async () => {
    try {
      this.reconnectWS();
      await documentStore.initSession();
      const { sessionId } = documentStore;
      await livenessStore.restoreLivenessSession();
      const { identityId } = livenessStore;
      this.wsConnection.emit('showDesktopSummary', {
        sessionId,
        identityId,
      });
    } catch (error) {
      toast.error(error);
    }
  };

  redirectToSummaryPage = () => {
    this.getNextRoute();
    if (this.returnToDesktop || getItem(KEYS.RETURN_TO_DESKTOP)) {
      this.backToDesktop();
      routerStore.push(routes.returnToDesktop);
    } else {
      routerStore.push(routes.summary);
    }
  };

  setWizardStepsAndRoutingConfiguration = () => {
    if (getItem(KEYS.WIZARD_PROGRESS) && getItem(KEYS.METHOD_ID)) {
      const wizardProgress = JSON.parse(getItem(KEYS.WIZARD_PROGRESS));
      const methodId = getItem(KEYS.METHOD_ID);
      this.selectedMethod = verifications.find(
        ({ id }) => id === parseInt(methodId, 10),
      );
      this.sides = wizardProgress.sides;
      this.wizardStepCount = wizardProgress.wizardStepCount;
      this.currentWizardStep = wizardProgress.currentWizardStep;
    } else {
      this.sides = [
        ...this.selectedMethod.docSides.map(({ name }) => name),
        'LIVENESS',
        'SUMMARY',
      ];
      this.wizardStepCount = this.sides.length;
      this.currentWizardStep = 0;

      this.saveWizardSettings();
    }
  };

  saveWizardSettings = () => {
    setItem(
      KEYS.WIZARD_PROGRESS,
      JSON.stringify({
        sides: this.sides,
        wizardStepCount: this.wizardStepCount,
        currentWizardStep: this.currentWizardStep,
      }),
    );
  };

  getNextRoute = () => {
    this.currentWizardStep += 1;
    this.saveWizardSettings();
    return ROUTES_CONFIG[this.sides[this.currentWizardStep]];
  };

  setCurrentWizardStep = stepNo => {
    this.currentWizardStep = stepNo;
  };

  waitForMobileWizardFinish = async () => {
    try {
      if (!getItem(KEYS.SESSION_ID)) {
        routerStore.push(routes.root);
      } else {
        if (!this.wsConnection) {
          this.reconnectWS();
        }

        this.wsConnection.on('mobileWizardFinished', async data => {
          if (data.sessionId === getItem(KEYS.SESSION_ID)) {
            await documentStore.getSessionData(data.sessionId);
            runInAction(() => {
              livenessStore.identityId = data.identityId;
            });
            setItem(KEYS.IDENTITY_ID, data.identityId);
            summaryStore.setIds(data.identityId, data.sessionId);
            routerStore.push(routes.summary);
          }
        });
      }
    } catch (error) {
      console.warn(error); // eslint-disable-line
    }
  };

  reset = () => {
    try {
      this.isLoading = false;
      this.selectedMethod = null;
      this.qrURL = null;

      if (this.wsConnection) {
        this.wsConnection.disconnect();
      }
      this.wsConnection = null;

      this.networkConnectionHasBeenChecked = false;
      this.checkingNetworkConnection = false;
      this.weakNetworkConnection = true;
      this.networkConnectionDetails = {};
      this.networkCheckError = false;
      this.networkChecked = false;
      this.incomatibleMessage = null;
      this.supportedList = [];
      this.unsupported = null;
      this.returnToDesktop = false;
      this.sides = [];
      this.currentWizardStep = 0;
      this.wizardStepCount = 0;

      clear();
    } catch (e) {
      console.warn(e); // eslint-disable-line
    }
  };
}

export default new ApplicationStore();
