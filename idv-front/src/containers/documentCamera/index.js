import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { useIntl } from 'react-intl';
import { HEADER_TYPES } from '@components/Header/style';
import PendingAuthorization from '@components/PendingAuthorization';
import routes from '@routes';
import Layout from '@components/Layout';
import Loader, { SIZE } from '@components/Loader';
import ErrorScreen from '@components/Error';
import CameraBorders from '@components/DocumentCameraBorders';

import * as Styled from '@containers/documentCamera/style';
import { useHistory } from 'react-router';

const Camera = ({
  applicationStore: { checkBrowserCompatibilityBeforeRender },
  documentCameraStore: {
    cameraFrameMessage,
    error,
    initialized,
    isLoading,
    initCamera,
    resetCameraStore,
    renderBorders,
    pending,
  },
  documentStore: { docFormat, backToFirstSide },
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

    if (!pending) init();
  }, [pending]);

  useEffect(
    () => () => {
      resetCameraStore();
    },
    [],
  );

  if (error) {
    return <ErrorScreen error={error} buttonAction={history.goBack} />;
  }

  return (
    <Layout
      type={pending ? HEADER_TYPES.BUTTON : HEADER_TYPES.DB_BUTTON_CAMERA}
      buttonTwoCallback={backToFirstSide}
      buttonCallback={() => history.push(routes.root)}
      hideHeaderOnLandscape
    >
      {pending ? (
        <PendingAuthorization />
      ) : (
        <>
          {!initialized || (isLoading && <Loader size={SIZE.LARGE} cover />)}

          {renderBorders && docFormat && (
            <CameraBorders format={docFormat} message={cameraFrameMessage} />
          )}
          <Styled.CameraContainer
            ref={videoOutput}
            muted
            playsInline
            autoPlay
          />
        </>
      )}
    </Layout>
  );
};

export default inject(
  'applicationStore',
  'documentCameraStore',
  'documentStore',
)(observer(Camera));
