import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TabPanelBox, AnimationWrapper } from '@containers/summary/style';
import HeadingText, { FONT_SIZE } from '@components/HeadingText';
import VerificationStatus from '@containers/summary/VerificationStatus';
import Button from '@components/Button';
import '@containers/summary/animationsStyle.css';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

const SummaryElement = React.forwardRef(
  (
    { headerIcon, status, headingMsg, expanded, children, panelName, onExpand },
    ref,
  ) => {
    return (
      <TabPanelBox ref={ref} data-panel-name={panelName}>
        <img src={headerIcon} alt="id-card" />
        <HeadingText mt="12px" fontsize={FONT_SIZE.NORMAL}>
          <FormattedMessage id={headingMsg} />
        </HeadingText>
        <VerificationStatus status={status} />

        {status !== 'ADJUDICATION' ? (
          <Button
            icon={
              expanded ? '/images/chevronUp.svg' : '/images/chevronDown.svg'
            }
            iconOnRight
            outlined
            smaller
            mt="12px"
            onClick={() => onExpand(!expanded)}
          >
            <FormattedMessage id="summary.more_details" />
          </Button>
        ) : null}
        <CSSTransition
          in={expanded}
          classNames="dropdown-animation"
          timeout={500}
          unmountOnExit
        >
          <AnimationWrapper>{children}</AnimationWrapper>
        </CSSTransition>
      </TabPanelBox>
    );
  },
);

SummaryElement.propTypes = {
  headerIcon: PropTypes.any.isRequired,
  status: PropTypes.oneOf([
    'ADJUDICATION',
    'VERIFIED',
    'NOT_VERIFIED',
    'INVALID',
  ]).isRequired,
  headingMsg: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  panelName: PropTypes.string.isRequired,
  onExpand: PropTypes.func.isRequired,
};

export default SummaryElement;
