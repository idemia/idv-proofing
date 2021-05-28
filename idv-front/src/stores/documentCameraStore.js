import { makeAutoObservable, runInAction } from 'mobx';
import { documentStore, routerStore } from '@stores';
import routes from '@routes';
import { ARBITARY_CAMERA_INITIALIZATION_DELAY } from '@constants';

const DOC_TYPES_RENDER_BORDERS = {
  IDENTITY_CARD: true,
  PASSPORT: true,
  DRIVING_LICENSE: true,
};

const CAMERA_FRAME_MESSAGE_PREFIX = 'camera.frame.document';

let initTimeout = null;

export class DocumentCameraStore {
  isLoading = false;

  defaultDeviceId = null;

  initialized = false;

  error = null;

  client = null;

  captureInProgress = false;

  renderBorders = true;

  pending = false;

  cameraFrameMessage = '';

  availableCameraDevices = {};

  videoOutput = null;

  documentFrame = null;

  videoStream = null;

  activeCamera = 'default';

  isRetry = false;

  intl = null;

  constructor() {
    makeAutoObservable(this);
  }

  displayInstructionsToUser = ({ position, corners, pending }) => {
    // Event list: badFraming, glare, blur, tooClose, tooFar, holdStraight, lowlight
    if (position) {
      runInAction(() => {
        // << got some message related to document position
        if (position.pdf417) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.keep`;
        } else if (position.holdStraight) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.hold_straight`;
        } else if (position.badFraming) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.align.${documentStore.docType}.${documentStore.docSide?.side?.name}`;
        } else if (position.lowlight) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.low_light`;
        } else if (position.reflection) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.reflection`;
        } else if (position.tooClose) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.too_close`;
        } else if (position.tooFar) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.too_far`;
        } else if (position.blur) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.blur`;
        } else {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.align.${documentStore.docType}.${documentStore.docSide?.side?.name}`;
        }
      });
    }
    if (corners) {
      // displayMsg(scanningDocMsg, 5000);
      if (this.documentFrame && this.renderBorders) {
        const { x0, y0, x1, y1, x2, y2, x3, y3 } = corners;
        const coefW =
          this.videoOutput.offsetWidth / this.videoOutput.videoWidth;
        const coefH =
          this.videoOutput.offsetHeight / this.videoOutput.videoHeight;
        const points = `${x0 * coefW}, ${y0 * coefH} ${x1 * coefW}, ${y1 *
          coefH} ${x2 * coefW}, ${y2 * coefH} ${x3 * coefW}, ${y3 * coefH}`;

        this.documentFrame.setAttribute('points', points);
      }
    }
    if (pending) {
      runInAction(() => {
        this.pending = true;
      });
    }
  };

  setVideoStream = async (intl, deviceId = null) => {
    try {
      const videoStream = await DocserverVideo.getDeviceStream({
        video: { deviceId },
        errorFn: err => {
          console.log('Failed to get User Media Stream', err); // eslint-disable-line
          runInAction(() => {
            this.error = {
              msg: this.intl.formatMessage({
                id: 'error.camera.video_stream_failed',
              }),
            };
          });
        },
      }).catch(e => {
        let msg = this.intl.formatMessage({ id: 'error.camera.message' });
        let extendedMsg;
        if (e.name && e.name.indexOf('NotAllowed') > -1) {
          msg = this.intl.formatMessage({
            id: 'error.camera.message_not_allowed',
          });
          extendedMsg = this.intl.formatMessage({
            id: 'error.camera.message_not_allowed_extended',
          });
        }
        if (e.name && e.name.indexOf('OverconstrainedError') > -1) {
          extendedMsg = this.intl.formatMessage(
            { id: 'error.camera.message_resolution' },
            { resolution: e.extendedInfo },
          );
        }

        runInAction(() => {
          this.error = {
            msg,
            extendedMsg,
          };
        });
      });

      if (!this.error) {
        const videoTrack = videoStream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        const currentDeviceId = settings.deviceId;
        runInAction(() => {
          this.videoStream = videoStream;
          this.defaultDeviceId = currentDeviceId;
        });
      }
    } catch (error) {
      console.warn(error); // eslint-disable-line
    }
  };

  initCamera = async (videoOutput, intl) => {
    await runInAction(() => {
      this.isLoading = true;
      this.documentFrame = document.getElementById('doc-frame');
      this.videoOutput = videoOutput;
      this.intl = intl;
    });

    try {
      await this.setVideoStream();

      // get user camera video (front camera is default)
      if (!this.videoStream) return;
      // display the video stream
      videoOutput.srcObject = this.videoStream;

      // initialize the doc capture client with callbacks
      const docCaptureOptions = {
        docserverVideoUrl: process.env.REACT_APP_DOCSERVER_URL,
        onDocCaptured: async doc => {
          runInAction(() => {
            this.captureInProgress = false;
          });

          if (doc) {
            routerStore.push(routes.preview);
          }

          if (this.client) {
            this.client.disconnect();
          }
        },
        trackingFn: trackingInfo => {
          this.displayInstructionsToUser(trackingInfo);
        },
        errorFn: error => {
          console.warn('doc capture error', error); // eslint-disable-line

          runInAction(() => {
            this.error = {
              msg: this.intl.formatMessage({ id: 'camera.error.undefined' }),
            };
          });
          if (this.client) {
            this.client.disconnect();
          }
        },
      };

      await documentStore.initSession();
      const client = await DocserverVideo.initDocCaptureClient(
        docCaptureOptions,
      );

      runInAction(() => {
        this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.align.${documentStore.docType}.${documentStore.docSide?.side?.name}`;
      });
      initTimeout = setTimeout(() => {
        client.start({
          stream: this.videoStream,
          sessionId: documentStore.sessionId,
          isRetry: this.isRetry,
        });
        runInAction(() => {
          this.captureInProgress = true;
        });
      }, ARBITARY_CAMERA_INITIALIZATION_DELAY);

      runInAction(() => {
        this.client = client;
      });
    } catch (error) {
      console.warn(error); // eslint-disable-line
      runInAction(() => {
        this.captureInProgress = false;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.initialized = true;
      });
    }
  };

  resetCameraStore = () => {
    try {
      clearTimeout(initTimeout);
      if (this.client) {
        this.client.disconnect();
      }
      this.error = null;
      this.pending = false;
      this.videoStream = null;
      this.isRetry = false;
    } catch (error) {
      console.warn(error); // eslint-disable-line
    }
  };

  setCameraLayout = docType => {
    this.renderBorders = DOC_TYPES_RENDER_BORDERS[docType];
  };

  setIsRetry = () => {
    this.isRetry = true;
  };

  retakePhoto = () => {
    this.setIsRetry();
    routerStore.history.goBack();
  };
}

export default new DocumentCameraStore();
