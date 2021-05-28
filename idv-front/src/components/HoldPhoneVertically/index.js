import React from 'react';
import { Wrapper } from '@components/HoldPhoneVertically/style';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const HoldPhoneVertically = ({ message }) => (
  <Wrapper>
    <img src="/images/chevronsUp.png" alt="" />
    <span>{message && <FormattedMessage id={message} />}</span>
  </Wrapper>
);

HoldPhoneVertically.defaultProps = {
  message: null,
};

HoldPhoneVertically.propTypes = {
  message: PropTypes.string,
};

export default HoldPhoneVertically;
