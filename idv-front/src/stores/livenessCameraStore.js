import { makeAutoObservable, runInAction } from 'mobx';
import { livenessStore, routerStore } from '@stores';
import routes from '@routes';
import {
  ARBITARY_CAMERA_INITIALIZATION_DELAY,
  TRACKING_POSITION_INFO,
} from '@constants';

const CAMERA_FRAME_MESSAGE_PREFIX = 'camera.frame.liveness';

let initTimeout = null;

export class LivenessCameraStore {
  isLoading = false;

  defaultDeviceId = null;

  initialized = false;

  error = null;

  client = null;

  challengeInProgress = false;

  challengePending = false;

  renderBorders = true;

  cameraFrameMessage = null;

  showFaceOutline = true;

  availableCameraDevices = {};

  videoOutput = null;

  videoStream = null;

  activeCamera = 'default';

  phoneNotVertical = false;

  livenessHigh = false;

  intl = null;

  temporaryMessageTimeout = null;

  constructor() {
    makeAutoObservable(this);
  }

  displayInstructionsToUser = trackingInfo => {
    // Display messages to user during capture (eg: move closer, center your face ...)
    if (trackingInfo) {
      const { livenessHigh: livenessHighData } = trackingInfo;
      runInAction(() => {
        if (trackingInfo.phoneNotVertical) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.phone_not_vertical`;
          this.phoneNotVertical = true;
        } else if (!this.challengeInProgress) {
          this.handlePassiveLivenessMessages(trackingInfo);
        } else if (livenessHighData) {
          this.handleHighLivenessMessages(livenessHighData);
        } else if (trackingInfo.faceh === 0 && trackingInfo.facew === 0) {
          this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.center`;
          this.phoneNotVertical = false;
        }

        if (this.challengeInProgress && !this.temporaryMessageTimeout) {
          this.cameraFrameMessage = null;
          this.phoneNotVertical = false;
          this.showFaceOutline = false;
        }
      });
    }
  };

  // handle showing information for initial user face capture for passive liveness
  handlePassiveLivenessMessages = trackingInfo => {
    if (
      !this.challengeInProgress &&
      trackingInfo.positionInfo !==
        TRACKING_POSITION_INFO.TRACKER_POSITION_INFO_GOOD
    ) {
      this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.${
        TRACKING_POSITION_INFO[trackingInfo.positionInfo]
      }`;
      this.phoneNotVertical = false;
    }
  };

  // handle showing information for when user don't know what to do in high liveness
  handleHighLivenessMessages = livenessHighData => {
    if (livenessHighData.stillFace) {
      this.showTemporaryMessage(`${CAMERA_FRAME_MESSAGE_PREFIX}.still_face`);
      this.phoneNotVertical = false;
    } else if (livenessHighData.movingPhone) {
      this.showTemporaryMessage(`${CAMERA_FRAME_MESSAGE_PREFIX}.moving_phone`);
      this.phoneNotVertical = false;
    }
  };

  // temporary overlay show with message
  showTemporaryMessage = message => {
    if (this.temporaryMessageTimeout)
      clearTimeout(this.temporaryMessageTimeout);
    this.cameraFrameMessage = message;
    this.temporaryMessageTimeout = setTimeout(() => {
      runInAction(() => {
        this.cameraFrameMessage = null;
        this.temporaryMessageTimeout = null;
      });
    }, ARBITARY_CAMERA_INITIALIZATION_DELAY);
  };

  setVideoStream = async () => {
    try {
      const videoStream = await BioserverVideo.getMediaStream({
        video: { width: 1280, height: 720 },
        videoId: 'camera-video-container',
      }).catch(e => {
        let msg = this.intl.formatMessage({
          id: 'error.camera.video_stream_failed',
        });

        let extendedMsg;
        if (e.name && e.name.indexOf('NotAllowed') > -1) {
          msg = this.intl.formatMessage({
            id: 'error.camera.message_not_allowed',
          });
          extendedMsg = this.intl.formatMessage({
            id: 'error.camera.message_not_allowed_extended',
          });
        }
        runInAction(() => {
          this.error = {
            msg,
            extendedMsg,
          };
        });
      });

      const videoTrack = videoStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      const currentDeviceId = settings.deviceId;
      runInAction(() => {
        this.videoStream = videoStream;
        this.defaultDeviceId = currentDeviceId;
      });
    } catch (error) {
      console.warn(error); // eslint-disable-line
    }
  };

  initCamera = async (videoOutput, intl) => {
    try {
      await livenessStore.restoreLivenessSession();
      const { sessionId, identityId } = livenessStore;

      await runInAction(() => {
        this.isLoading = true;
        this.videoOutput = videoOutput;
        this.intl = intl;
        this.showFaceOutline = true;
        this.cameraFrameMessage = `${CAMERA_FRAME_MESSAGE_PREFIX}.center`;
      });

      await this.setVideoStream();
      if (!this.videoStream || !sessionId) return;

      this.videoOutput.srcObject = this.videoStream;

      const faceCaptureOptions = {
        bioSessionId: sessionId,
        identityId,
        showChallengeInstruction: async challengeInstruction => {
          // eslint-disable-next-line no-console
          console.log('@@@ showChallengeInstruction', {
            challengeInstruction,
          });

          if (challengeInstruction === 'TRACKER_CHALLENGE_PENDING') {
            runInAction(() => {
              this.challengeInProgress = false;
              this.challengePending = true;
            });
            BioserverVideoUI.resetLivenessHighGraphics();
          } else {
            runInAction(() => {
              this.challengeInProgress = true;
            });

            // display challenge
            const options = {
              tooltip: {
                enabled: true,
                text: this.intl.formatMessage({
                  id: 'camera.liveness.challenge.tooltip',
                }),
              },
            };

            BioserverVideoUI.resetLivenessHighGraphics(options);
          }
        },
        showChallengeResult: async () => {
          runInAction(() => {
            this.challengePending = true;
          });
          // eslint-disable-next-line no-console
          console.log(
            '@@@ showChallengeResult Liveness Challenge done > requesting result ...',
          );
          routerStore.push(routes.loading);
        },
        trackingFn: trackingInfo => {
          if (!this.challengePending) {
            this.displayInstructionsToUser(trackingInfo);

            BioserverVideoUI.updateLivenessHighGraphics(
              'camera-video-container',
              trackingInfo,
            );
          }
        },
        errorFn: ({ error }) => {
          console.warn({ error }); // eslint-disable-line

          runInAction(() => {
            this.error = {
              msg: error,
            };
          });

          if (this.client) this.client.disconnect();
        },
      };

      faceCaptureOptions.wspath = '/video-server/engine.io';
      faceCaptureOptions.bioserverVideoUrl = process.env.REACT_APP_SDK_PATH;
      faceCaptureOptions.rtcConfigurationPath = `${
        process.env.REACT_APP_VIDEOSERVER_URL
      }/coturnService?bioSessionId=${encodeURIComponent(sessionId)}`;

      // eslint-disable-next-line
      console.log('@@@ BioserverVideo.initFaceCaptureClient', {
        faceCaptureOptions,
      });

      const client = await BioserverVideo.initFaceCaptureClient(
        faceCaptureOptions,
      );
      runInAction(() => {
        this.client = client;
      });

      initTimeout = setTimeout(() => {
        this.client.start(this.videoStream);
      }, ARBITARY_CAMERA_INITIALIZATION_DELAY);
    } catch (error) {
      console.warn(error); // eslint-disable-line
    } finally {
      runInAction(() => {
        this.isLoading = false;
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
      this.videoStream = null;
      this.challengeInProgress = false;
      this.challengePending = false;
      this.phoneNotVertical = false;
      this.renderBorders = true;
    } catch (error) {
      console.warn(error); // eslint-disable-line
    }
  };
}

export default new LivenessCameraStore();
