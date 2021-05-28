import React, { useMemo } from 'react';
import HeadingText, { FONT_SIZE } from '@components/HeadingText';
import { useTheme } from '@emotion/react';
import { FormattedMessage } from 'react-intl';
import WarningIcon from '@assets/warning';
import SuccessIcon from '@assets/success';
import Loader, { SIZE } from '@components/Loader';
import { VerificationWrapper } from '@containers/summary/style';
import PropTypes from 'prop-types';

const STATUS_TYPES = {
  VERIFIED: 'VERIFIED',
  NOT_VERIFIED: 'NOT_VERIFIED',
  INVALID: 'INVALID',
  ADJUDICATION: 'ADJUDICATION',
};

const VerificationStatus = ({ status }) => {
  const theme = useTheme();

  const statusOpts = useMemo(() => {
    switch (status) {
      case STATUS_TYPES.VERIFIED:
        return {
          icon: <SuccessIcon />,
          summaryId: 'summary.verified',
          type: 'success',
        };
      case STATUS_TYPES.NOT_VERIFIED:
        return {
          icon: <WarningIcon />,
          summaryId: 'summary.not_verified',
          type: 'warning',
        };
      case STATUS_TYPES.INVALID:
        return {
          icon: <WarningIcon fill={theme.colors.error} />,
          summaryId: 'summary.invalid',
          type: 'error',
        };
      case STATUS_TYPES.ADJUDICATION:
        return {
          icon: <Loader size={SIZE.SMALL} />,
          summaryId: 'summary.processing',
          type: 'processing',
        };
      default:
        return null;
    }
  }, [status]);

  if (!statusOpts) {
    return null;
  }

  return (
    <VerificationWrapper>
      {statusOpts.icon}
      <HeadingText
        fontsize={FONT_SIZE.NORMAL}
        textColor={statusOpts.type}
        ml="10px"
      >
        <FormattedMessage id={statusOpts.summaryId} />
      </HeadingText>
    </VerificationWrapper>
  );
};

VerificationStatus.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUS_TYPES)).isRequired,
};

export default VerificationStatus;
