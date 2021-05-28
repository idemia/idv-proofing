import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import HeadingText from '@components/HeadingText';
import { HEADER_TYPES } from '@components/Header/style';
import Content from '@components/Content';
import { size } from '@styles/breakpoints';
import QRCode from 'qrcode.react';
import * as Styled from '@containers/redirectToPhone/style';
import { useWindowSize } from '@utils/useWindowSize';
import Loader from '@components/Loader';
import Layout from '@components/Layout';

const RedirectToPhone = inject('applicationStore')(
  observer(({ applicationStore: { initQRpage, qrURL, isLoading } }) => {
    const windowSize = useWindowSize();

    useEffect(() => {
      initQRpage();
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
            <FormattedMessage id="redirect.header_text" />
          </HeadingText>
          <Styled.ImagesWrapper>
            <Styled.InstructionImage
              src="/images/scanQr.svg"
              alt="Scan qr code"
            />
            {isLoading || !qrURL ? (
              <Loader />
            ) : (
              <QRCode value={qrURL} size={280} renderAs="svg" />
            )}
          </Styled.ImagesWrapper>
        </Content>
      </Layout>
    );
  }),
);

export default RedirectToPhone;
