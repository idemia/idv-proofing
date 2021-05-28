import React from 'react';
import HeadingText, { FONT_SIZE } from '@components/HeadingText';
import { FormattedMessage } from 'react-intl';
import { OverallSubTextWithIcon } from '@containers/summary/style';
import Warning from '@assets/warning';
import Meter from '@containers/summary/OverallScore/Meter';
import Information from '@components/Modal/modalContents/Information';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

const OverallScoreSection = ({ grade, modalStore }) => {
  return (
    <>
      <HeadingText mt="12px" fontsize={FONT_SIZE.NORMAL}>
        <FormattedMessage id="summary.overall" />
      </HeadingText>
      <OverallSubTextWithIcon>
        <FormattedMessage id="summary.overall_subtext" />
        <Warning
          height={16}
          width={16}
          fill="#4a4a4a"
          style={{ marginLeft: '5px' }}
          onClick={() =>
            modalStore.showModal(
              <Information information="modal.information" />,
              'modal.information_title',
            )
          }
        />
      </OverallSubTextWithIcon>
      <Meter grade={grade} />
    </>
  );
};

OverallScoreSection.propTypes = {
  grade: PropTypes.oneOf(['LOA0', 'LOA1', 'LOA2', 'LOA3']).isRequired,
};

export default inject('modalStore')(observer(OverallScoreSection));
