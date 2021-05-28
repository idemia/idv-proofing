import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@emotion/react';
import HeadingText, { FONT_SIZE } from '@components/HeadingText';
import { HEADER_TYPES } from '@components/Header/style';
import Content from '@components/Content';
import Button from '@components/Button';
import Layout from '@components/Layout';

import Loader, { SIZE } from '@components/Loader';
import { Text, Image } from 'rebass';

const NetworkChecker = ({
  applicationStore: {
    checkingNetworkConnection,
    networkConnectionDetails,
    retestConnection,
    weakNetworkConnection,
    networkCheckError,
    networkConnectionHasBeenChecked,
  },
  type,
}) => {
  const theme = useTheme();

  if (checkingNetworkConnection || !networkConnectionHasBeenChecked) {
    return (
      <Layout type={HEADER_TYPES.LOCK}>
        <Content fill={1} center={1}>
          <Loader size={SIZE.LARGE} />
          <HeadingText fontsize={FONT_SIZE.SMALL} mt={15}>
            <FormattedMessage id="network_checker.checking" />
          </HeadingText>
        </Content>
      </Layout>
    );
  }

  if (weakNetworkConnection) {
    return (
      <Layout type={HEADER_TYPES.LOCK}>
        <Content fill={1} center={1}>
          {networkCheckError ? (
            <>
              <Image src="/images/no.svg" alt="error-icon" mb="25px" />

              <HeadingText
                fontsize={FONT_SIZE.SMALL}
                textAlign="center"
                mb="15px"
              >
                <FormattedMessage id="network_checker.error" />
              </HeadingText>
            </>
          ) : (
            <>
              <img src="/images/wifi.svg" alt="Weak internet connection" />
              <HeadingText fontsize={FONT_SIZE.SMALL} textAlign="center">
                <FormattedMessage id="network_checker.weak_signal" />
                <br />
                <Text as="span" color={theme.colors.error}>
                  ({networkConnectionDetails.upload}kb/s)
                </Text>
              </HeadingText>

              <Text
                my={15}
                textAlign="center"
                lineHeight={theme.lineHeights.normal}
              >
                <FormattedMessage id="network_checker.weak_info_start" />
                <strong>1500kb/s</strong>.<br />
                <FormattedMessage id="network_checker.weak_info_end" />
              </Text>
            </>
          )}

          <Button fullwidth onClick={() => retestConnection(type)}>
            <FormattedMessage id="network_checker.retest" />
          </Button>
        </Content>
      </Layout>
    );
  }

  return null;
};

NetworkChecker.propTypes = {
  type: PropTypes.oneOf(['docserver', 'bioserver']).isRequired,
};

export default inject('applicationStore')(observer(NetworkChecker));
