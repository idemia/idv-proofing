import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { HEADER_TYPES } from '@components/Header/style';
import routes from '@routes';
import InsidePassportAnimation from '@assets/animations/doc-scan-passport.json';
import FrontIdAnimation from '@assets/animations/doc-scan-front-doc.json';
import BackIdAnimation from '@assets/animations/doc-scan-back-doc.json';
import Wizard from '@components/Wizard';
import { DOC_TYPE } from '@constants';

const CONFIG = {
  [DOC_TYPE.PASSPORT]: {
    animation: InsidePassportAnimation,
  },
  [DOC_TYPE.IDENTITY_CARD]: {
    animation: FrontIdAnimation,
  },
  [DOC_TYPE.DRIVING_LICENSE]: {
    animation: FrontIdAnimation,
  },
};

const button = {
  title: 'instructions.continue',
  navigateTo: {
    pathname: routes.camera,
    state: { nextRoute: routes.preview },
  },
};

// Same component for both ID and Driver License
const DocumentSideCaptureInstructions = ({
  applicationStore: { checkBrowserCompatibilityBeforeRender },
  documentStore: { initSession, docType },
  applicationStore: { wizardStepCount, currentWizardStep },
  side,
}) => {
  useEffect(() => {
    const init = async () => {
      await checkBrowserCompatibilityBeforeRender();
      await initSession();
    };

    init();
  }, []);

  const message = useMemo(
    () => ({
      heading: docType && `instructions.${side}.${docType}`,
      subText: docType && `instructions.${side}.${docType}_additional`,
    }),
    [docType, side],
  );

  const header = useMemo(
    () => ({
      type: HEADER_TYPES.STEPS,
      activeStep: currentWizardStep + 1,
      stepCount: wizardStepCount,
    }),
    [currentWizardStep, wizardStepCount],
  );

  return (
    <Wizard
      header={header}
      button={button}
      message={message}
      animation={
        side === 'front' ? CONFIG[docType]?.animation : BackIdAnimation
      }
    />
  );
};

DocumentSideCaptureInstructions.propTypes = {
  side: PropTypes.oneOf(['front', 'back']).isRequired,
};

export default inject(
  'applicationStore',
  'documentStore',
  'applicationStore',
)(observer(DocumentSideCaptureInstructions));
