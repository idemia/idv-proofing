import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Overlay,
  Message,
  Loader,
} from '@components/CameraLoaderOverlay/style';

const CameraLoaderOverlay = ({ message }) => {
  return (
    <Overlay>
      <Loader />
      <Message>
        <FormattedMessage id={message} />
      </Message>
    </Overlay>
  );
};

CameraLoaderOverlay.propTypes = {
  message: PropTypes.string.isRequired,
};

export default CameraLoaderOverlay;
