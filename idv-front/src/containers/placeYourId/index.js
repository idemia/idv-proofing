import React, { useEffect, useMemo } from 'react';
import { inject, observer } from 'mobx-react';
import { HEADER_TYPES } from '@components/Header/style';
import PlaceIdAnimation from '@assets/animations/doc-place-front-doc.json';
import NetworkChecker from '@components/NetworkChecker';
import routes from '@routes';
import Wizard from '@components/Wizard';
import { toast } from 'react-toastify';

const header = { type: HEADER_TYPES.LOCK };
const button = {
  title: 'instructions.im_good',
  navigateTo: { pathname: routes.frontId },
};

const PlaceId = ({
  applicationStore: {
    checkingNetworkConnection,
    initMobileWizard,
    weakNetworkConnection,
    networkConnectionDetails,
    checkNetworkConnection,
    networkChecked,
  },
  documentStore: { docType, isInitialized },
}) => {
  useEffect(() => {
    (async () => {
      try {
        await checkNetworkConnection();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Unknown error occurred during network check');
        }
      }
    })()
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await initMobileWizard();
    };

    if (
      networkConnectionDetails?.checkType === 'docserver' &&
      !weakNetworkConnection
    )
      initialize();
  }, [weakNetworkConnection]);

  const message = useMemo(
    () => ({
      heading: docType && `instructions.place_your.${docType}`,
      subText: docType && `instructions.place_your.${docType}_additional`,
    }),
    [docType],
  );

  if (
    checkingNetworkConnection ||
    weakNetworkConnection ||
    !networkChecked ||
    !isInitialized
  ) {
    return <NetworkChecker type="docserver" />;
  }

  return (
    <Wizard
      header={header}
      button={button}
      message={message}
      animation={PlaceIdAnimation}
    />
  );
};

export default inject('applicationStore', 'documentStore')(observer(PlaceId));
