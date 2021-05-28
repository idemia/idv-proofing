import React, { useEffect, useState } from 'react';
import routes from '@routes';
import { inject, observer } from 'mobx-react';
import { HEADER_TYPES } from '@components/Header/style';
import Layout from '@components/Layout';
import { FormattedMessage } from 'react-intl';
import Content from '@components/Content';
import Text from '@components/HeadingText';
import Lottie from 'react-lottie';
import Button from '@components/Button';
import ButtonWrapper from '@components/ButtonAbsWrapper';
import DoubleButtonWrapper from '@components/DoubleButtonWrapper';
import Loader from '@components/Loader';
import LivenessAnimation1 from '@assets/animations/liveness-1.json';
import LivenessAnimation2 from '@assets/animations/liveness-2.json';
import LivenessAnimation3 from '@assets/animations/liveness-3.json';
import NetworkChecker from '@components/NetworkChecker';
import { LIVENESS_TYPES } from '@constants';

const STEPS = [
  {
    animation: LivenessAnimation1,
    heading: 'liveness.step1',
    btn1: 'liveness.skip',
    btn2: 'liveness.next',
  },
  {
    animation: LivenessAnimation2,
    heading: 'liveness.step2',
    btn1: 'liveness.skip',
    btn2: 'liveness.next',
  },
  {
    animation: LivenessAnimation3,
    heading: 'liveness.step3',
    btn1: 'liveness.skip',
    btn2: 'liveness.ready',
  },
];

const LivenessInstructions = ({
  applicationStore: {
    checkingNetworkConnection,
    weakNetworkConnection,
    networkChecked,
    networkConnectionDetails,
    currentWizardStep,
    wizardStepCount,
    checkNetworkConnection,
  },
  livenessStore: { initLivenessSession, isLoading, initialized, livenessType },
  routerStore,
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    checkNetworkConnection('bioserver');
  }, []);

  useEffect(() => {
    const init = async () => {
      await initLivenessSession();
    };

    if (
      networkConnectionDetails?.checkType === 'bioserver' &&
      !weakNetworkConnection
    )
      init();
  }, [weakNetworkConnection]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: STEPS[step].animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
  };

  const advance = (skip = false) => {
    if (
      step === STEPS.length - 1 ||
      skip ||
      (livenessType === LIVENESS_TYPES.PASSIVE && step === 1)
    ) {
      routerStore.push(routes.livenessCamera);
    } else setStep(step + 1);
  };

  if (
    checkingNetworkConnection ||
    weakNetworkConnection ||
    !networkChecked ||
    !initialized
  ) {
    return <NetworkChecker type="bioserver" />;
  }

  return (
    <Layout
      type={HEADER_TYPES.STEPS}
      activeStep={currentWizardStep + 1}
      stepCount={wizardStepCount}
      rowReverse
    >
      {isLoading || !initialized ? <Loader cover /> : null}
      <Content>
        <Text forceLandscapeMobile forceSmallerLandscape>
          <FormattedMessage id={STEPS[step].heading} />
        </Text>
      </Content>
      <Lottie
        options={defaultOptions}
        isStopped={false}
        isPaused={false}
        height="100%"
        style={{
          zIndex: 1,
          padding: '15px 0',
        }}
      />
      <ButtonWrapper>
        <Content noBg>
          <DoubleButtonWrapper>
            <Button outlined fullwidth onClick={() => advance(true)}>
              <FormattedMessage id={STEPS[step].btn1} />
            </Button>
            <Button fullwidth onClick={() => advance()}>
              <FormattedMessage
                id={
                  livenessType === LIVENESS_TYPES.PASSIVE && step === 1
                    ? STEPS[2].btn2
                    : STEPS[step].btn2
                }
              />
            </Button>
          </DoubleButtonWrapper>
        </Content>
      </ButtonWrapper>
    </Layout>
  );
};

export default inject(
  'applicationStore',
  'routerStore',
  'livenessStore',
)(observer(LivenessInstructions));
