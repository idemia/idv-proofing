import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Wrapper,
  Mask,
  MaskBorder,
  Message,
} from '@components/DocumentCameraBorders/style';

const DocumentCameraBorders = ({ format, message }) => (
  <Wrapper>
    <Mask>
      <MaskBorder docFormat={format}>
        {message ? (
          <Message docFormat={format}>
            <FormattedMessage id={message} />
          </Message>
        ) : null}
      </MaskBorder>
    </Mask>
    <svg id="doc-frame">
      <polygon
        points="0,0"
        stroke="#ac85df"
        fill="rgba(67, 0, 153, 0.5)"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  </Wrapper>
);

DocumentCameraBorders.defaultProps = {
  message: null,
};

DocumentCameraBorders.propTypes = {
  format: PropTypes.oneOf(['ID1', 'ID2', 'ID3']).isRequired,
  message: PropTypes.string,
};

export default DocumentCameraBorders;
