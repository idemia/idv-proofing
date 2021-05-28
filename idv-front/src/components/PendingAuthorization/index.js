import React from 'react';
import { FormattedMessage } from 'react-intl';
import Loader, { SIZE } from '@components/Loader';
import { Wrapper } from '@components/PendingAuthorization/style';

const PendingAuthorization = () => (
  <Wrapper>
    <Loader size={SIZE.LARGE} />
    <span>
      <FormattedMessage id="camera.authenticating" />
      <small>
        <FormattedMessage id="camera.verifying" />
      </small>
    </span>
  </Wrapper>
);

export default PendingAuthorization;
