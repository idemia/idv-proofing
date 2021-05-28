import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { HEADER_TYPES } from '@components/Header/style';
import ProgressRing from '@components/ProgressRing';
import { observer, inject } from 'mobx-react';
import CenterCenterWrapper from '@components/CenterCenterWrapper';
import HeadingText from '@components/HeadingText';
import { FormattedMessage } from 'react-intl';
import SubText from '@components/SubText';
import Layout from '@components/Layout';
import { ARBITRARY_LOADING_PROGRESS_ANIMATION_TIMEOUT } from '@constants';

const PROGRESS_STEPS = [10, 15, 25, 49, 70, 82, 93, 96, 97, 100];

export const LOADING_TYPE = {
  AUTH: 'auth',
  UPLOAD: 'upload',
};

const waitFunc = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ARBITRARY_LOADING_PROGRESS_ANIMATION_TIMEOUT);
  });

let delay;

const LoadingScreen = ({
  applicationStore: {
    redirectToSummaryPage,
    currentWizardStep,
    wizardStepCount,
  },
  type,
  onFido,
}) => {
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(false);

  const progressingFunc = useCallback(async () => {
    // eslint-disable-next-line no-restricted-syntax
    for await (const step of PROGRESS_STEPS) {
      await waitFunc();
      if (isMounted.current) {
        setProgress(step);
      }
      if (type === 'upload' && step === 100) {
        redirectToSummaryPage();
      }
      if (type === 'auth' && step === 100) {
        delay = setTimeout(() => {
          if (isMounted.current) {
            setProgress(0);
            progressingFunc();
          }
        }, ARBITRARY_LOADING_PROGRESS_ANIMATION_TIMEOUT);
      }
    }
  }, []);

  useEffect(() => {
    progressingFunc();
    isMounted.current = true;

    return () => {
      clearTimeout(delay);
      isMounted.current = false;
    };
  }, []);

  return (
    <Layout
      type={type === LOADING_TYPE.AUTH ? HEADER_TYPES.LOCK : HEADER_TYPES.STEPS}
      activeStep={currentWizardStep + 1}
      stepCount={wizardStepCount}
    >
      <CenterCenterWrapper>
        <ProgressRing
          progress={progress}
          icon={
            type === LOADING_TYPE.AUTH
              ? '/images/lockColor.svg'
              : '/images/uploadIcon.svg'
          }
        />
        <HeadingText mt="15px" mb="10px">
          <FormattedMessage id={`loading.${type}`} />
        </HeadingText>
        <SubText>
          {onFido ? (
            <FormattedMessage id="loading.onfido" />
          ) : (
            <FormattedMessage id={`loading.${type}_info`} />
          )}
        </SubText>
      </CenterCenterWrapper>
    </Layout>
  );
};

LoadingScreen.defaultProps = {
  type: LOADING_TYPE.UPLOAD,
  onFido: false,
};

LoadingScreen.propTypes = {
  type: PropTypes.oneOf(Object.values(LOADING_TYPE)),
  onFido: PropTypes.bool,
};

export default inject('applicationStore')(observer(LoadingScreen));
