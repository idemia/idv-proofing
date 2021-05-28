import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CSSTransition } from 'react-transition-group';
import { Wrapper, Message } from '@components/LivenessCameraBorders/style';

const LivenessCameraBorders = ({ message, showFaceOutline, elevated }) => (
  <Wrapper elevated={elevated && message && !showFaceOutline}>
    {message && (
      <Message elevated={elevated}>
        <FormattedMessage id={message} />
      </Message>
    )}

    <CSSTransition
      in={showFaceOutline}
      unmountOnExit
      classNames="fade"
      timeout={300}
    >
      <img src="/images/faceOutline.png" alt="face-outline" />
    </CSSTransition>
  </Wrapper>
);

LivenessCameraBorders.defaultProps = {
  message: null,
};

LivenessCameraBorders.propTypes = {
  message: PropTypes.string,
};

export default LivenessCameraBorders;
