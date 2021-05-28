import React, { useMemo } from 'react';
import {
  DocSectionElementStatus,
  DocSectionElementStatusIcon,
  StatusHoverWrapper,
  StatusTooltip,
} from '@containers/summary/style';
import { FormattedMessage } from 'react-intl';

import WarningIcon from '@assets/warning';
import SuccessIcon from '@assets/success';
import ErrorIcon from '@assets/error';
import PropTypes from 'prop-types';

const DocElementStatus = ({ status }) => {
  const icon = useMemo(() => {
    switch (status) {
      case 'passed':
        return <SuccessIcon height={16} width={16} />;
      case 'unverified':
        return <WarningIcon height={16} width={16} />;
      case 'untested':
        return <WarningIcon height={16} width={16} fill="#bfbfbf" />;
      case 'failed':
        return <ErrorIcon height={16} width={16} />;
      default:
        return null;
    }
  }, [status]);

  return (
    <DocSectionElementStatus>
      <FormattedMessage id={`summary.doc_section.${status}`} />
      <DocSectionElementStatusIcon>
        <StatusHoverWrapper>{icon}</StatusHoverWrapper>
        <StatusTooltip>
          <FormattedMessage id={`summary.doc_section.tooltip.${status}`} />
        </StatusTooltip>
      </DocSectionElementStatusIcon>
    </DocSectionElementStatus>
  );
};

DocElementStatus.propTypes = {
  status: PropTypes.oneOf(['passed', 'unverified', 'untested', 'failed'])
    .isRequired,
};

export default DocElementStatus;
