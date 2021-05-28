import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { size } from '@styles/breakpoints';
import HeadingText from '@components/HeadingText';
import SubText from '@components/SubText';
import { HEADER_TYPES } from '@components/Header/style';
import Content from '@components/Content';
import * as Styled from '@containers/home/style';
import { useWindowSize } from '@utils/useWindowSize';
import verifications from '@constants/verifications';
import Loader from '@components/Loader';
import Layout from '@components/Layout';
import DocumentFlagBox from './DocumentFlagBox';

const HomePage = ({
  applicationStore: {
    selectMethod,
    isLoading,
    reset: applicationStoreReset,
    initEmojis,
  },
  documentStore: { reset: documentStoreReset },
  summaryStore: { reset: summaryStoreReset },
  livenessStore: { reset: livenessStoreReset },
}) => {
  useEffect(() => {
    applicationStoreReset();
    documentStoreReset();
    summaryStoreReset();
    livenessStoreReset();
    initEmojis();
  }, []);

  const windowSize = useWindowSize();

  return (
    <Layout
      noFillHeight
      type={
        size.md < windowSize.width ? HEADER_TYPES.LOCK : HEADER_TYPES.SINGLE
      }
    >
      <Content>
        {isLoading ? <Loader cover /> : null}

        <HeadingText>
          <FormattedMessage id="home.welcome" /> {/* Always good morning? */}
        </HeadingText>
        <SubText>
          <FormattedMessage id="home.what_you_want_to_do" />
        </SubText>
        <Styled.OptionsGrid>
          {verifications.map((item, idx) => (
            <DocumentFlagBox
              key={idx}
              item={item}
              selectMethod={selectMethod}
            />
          ))}
        </Styled.OptionsGrid>
      </Content>
    </Layout>
  );
};

export default inject(
  'applicationStore',
  'documentStore',
  'summaryStore',
  'livenessStore',
)(observer(HomePage));
