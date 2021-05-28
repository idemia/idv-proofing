import React from 'react';
import { FormattedMessage } from 'react-intl';
import { HEADER_TYPES } from '@components/Header/style';
import Text from '@components/HeadingText';
import CenterCenterWrapper from '@components/CenterCenterWrapper';
import Layout from '@components/Layout';
import { inject, observer } from 'mobx-react';

import * as Styled from '@containers/returnToDesktop/style';

const ReturnToDesktop = ({
  applicationStore: { currentWizardStep, wizardStepCount },
}) => (
  <Layout
    type={HEADER_TYPES.STEPS}
    activeStep={currentWizardStep + 1}
    stepCount={wizardStepCount}
  >
    <CenterCenterWrapper>
      <Styled.ReturnIcon
        src="/images/returnToDesktop.svg"
        alt="return-to-desktop-icon"
        mb="25px"
      />
      <Text>
        <FormattedMessage id="return.info" />
      </Text>
    </CenterCenterWrapper>
  </Layout>
);

export default inject('applicationStore')(observer(ReturnToDesktop));
