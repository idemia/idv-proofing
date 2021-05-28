import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { HEADER_TYPES } from '@components/Header/style';
import PendingAuthorization from '@components/PendingAuthorization';
import routes from '@routes';
import Layout from '@components/Layout';
import Loader, { SIZE } from '@components/Loader';
import ErrorScreen from '@components/Error';
import CameraBorders from '@components/LivenessCameraBorders';
import HoldPhoneVertically from '@components/HoldPhoneVertically';
import CameraLoaderOveraly from '@components/CameraLoaderOverlay';

import {
  CameraContainer,
  CameraWrapper,
} from '@containers/livenessCamera/style';

const Camera = ({
  applicationStore: { checkBrowserCompatibilityBeforeRender },
  livenessCameraStore: {
    error,
    initialized,
    isLoading,
    initCamera,
    resetCameraStore,
    pending,
    renderBorders,
    cameraFrameMessage,
    phoneNotVertical,
    challengePending,
    challengeInProgress,
    showFaceOutline,
  },
  livenessStore: { fetchingChallengeResults },
}) => {
  const history = useHistory();
  const intl = useIntl();
  const videoOutput = useRef();

  useEffect(() => {
    const init = async () => {
      const isDeviceCompatible = await checkBrowserCompatibilityBeforeRender();
      if (isDeviceCompatible) {
        await initCamera(videoOutput.current, intl);
      }
    };

    init();
  }, [videoOutput]);

  useEffect(() => {
    return () => {
      resetCameraStore();
    };
  }, []);

  if (error) {
    return <ErrorScreen error={error} buttonAction={history.goBack} />;
  }

  return (
    <Layout
      type={pending ? HEADER_TYPES.BUTTON : HEADER_TYPES.DB_BUTTON_CAMERA}
      buttonTwoCallback={() => history.goBack()}
      buttonCallback={() => history.push(routes.root)}
      hideHeaderOnLandscape
    >
      {pending ? (
        <PendingAuthorization />
      ) : (
        <>
          {!initialized || (isLoading && <Loader size={SIZE.LARGE} cover />)}

          <CSSTransition
            in={phoneNotVertical && cameraFrameMessage?.length > 0}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <HoldPhoneVertically message={cameraFrameMessage} />
          </CSSTransition>

          <CSSTransition
            in={challengePending || fetchingChallengeResults}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <CameraLoaderOveraly message="camera.frame.loading" />
          </CSSTransition>

          <CSSTransition
            in={renderBorders && !challengePending}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <CameraBorders
              message={cameraFrameMessage}
              showFaceOutline={showFaceOutline}
              elevated={challengeInProgress}
            />
          </CSSTransition>

          <CameraWrapper>
            <CameraContainer
              id="camera-video-container"
              ref={videoOutput}
              muted
              playsInline
              autoPlay
            />
          </CameraWrapper>
        </>
      )}
    </Layout>
  );
};

export default inject(
  'applicationStore',
  'livenessCameraStore',
  'livenessStore',
)(observer(Camera));
