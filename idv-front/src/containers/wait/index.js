import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import HeadingText from '@components/HeadingText';
import { HEADER_TYPES } from '@components/Header/style';
import Content from '@components/Content';
import { size } from '@styles/breakpoints';
import { useWindowSize } from '@utils/useWindowSize';
import Layout from '@components/Layout';

const WaitForComplete = ({
  applicationStore: { waitForMobileWizardFinish },
}) => {
  const windowSize = useWindowSize();

  useEffect(() => {
    const waitForWizard = async () => {
      await waitForMobileWizardFinish();
    };

    waitForWizard();
  }, []);

  return (
    <Layout
      noFillHeight
      type={
        size.md < windowSize.width ? HEADER_TYPES.LOCK : HEADER_TYPES.SINGLE
      }
    >
      <Content>
        <HeadingText>
          <FormattedMessage id="wait.header_text" />
        </HeadingText>
      </Content>
    </Layout>
  );
};

export default inject('applicationStore')(observer(WaitForComplete));
