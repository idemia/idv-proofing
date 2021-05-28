import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { HEADER_TYPES } from '@components/Header/style';
import HeadingText, { FONT_SIZE } from '@components/HeadingText';
import Content from '@components/Content';
import { Text } from 'rebass';

import Button from '@components/Button';
import ButtonWrapper from '@components/ButtonAbsWrapper';
import DoubleButtonWrapper from '@components/DoubleButtonWrapper';
import Layout from '@components/Layout';
import routes from '@routes';

import * as Styled from '@components/Error/style';

const ErrorScreen = ({ buttonAction, buttonText, error, reportEnabled }) => {
  const theme = useTheme();
  const history = useHistory();

  useEffect(() => {
    if (!error) {
      history.push(routes.root);
    }
  }, []);

  if (!error) return null;

  return (
    <Layout type={HEADER_TYPES.LOCK}>
      <Content fill={1} center={1}>
        <Styled.ErrorIcon src="/images/no.svg" alt="error-icon" mb="25px" />
        <HeadingText fontsize={FONT_SIZE.SMALL} textAlign="center">
          {error.msg}
        </HeadingText>
        <Text my={15} textAlign="center" lineHeight={theme.lineHeights.normal}>
          {error.extendedMsg}
        </Text>
        <ButtonWrapper>
          <Content noBg>
            <DoubleButtonWrapper
              column
              conditionalSingleButton={!reportEnabled}
            >
              <Button fullwidth onClick={buttonAction}>
                {buttonText || <FormattedMessage id="error.try_again" />}
              </Button>
              {reportEnabled && (
                <Button outlined fullwidth>
                  <FormattedMessage id="error.issue" />
                </Button>
              )}
            </DoubleButtonWrapper>
          </Content>
        </ButtonWrapper>
      </Content>
    </Layout>
  );
};

ErrorScreen.defaultProps = {
  reportEnabled: false,
  buttonText: null,
};

ErrorScreen.propTypes = {
  error: PropTypes.shape({
    msg: PropTypes.string,
    extendedMsg: PropTypes.string,
  }).isRequired,
  reportEnabled: PropTypes.bool,
  buttonAction: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
};

export default ErrorScreen;
