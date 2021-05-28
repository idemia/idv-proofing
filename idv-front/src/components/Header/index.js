import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'rebass';
import { FormattedMessage } from 'react-intl';
import { routerStore } from '@stores';
import Button from '@components/Button';
import HeaderSteps from '@components/Header/HeaderSteps';

import * as Styled from '@components/Header/style';

const { HEADER_TYPES } = Styled;

const Header = ({
  type,
  activeStep,
  stepCount,
  buttonCallback,
  messageId,
  buttonTwoCallback,
  messageTwoId,
  hideOnLandscape,
}) => {
  const renderRightSide = () => {
    switch (type) {
      case HEADER_TYPES.SINGLE:
        return null;
      case HEADER_TYPES.LOCK:
        return (
          <Flex alignItems="center">
            <Styled.LockImg src="/images/lockSmall.svg" alt="lock-small" />
            <Styled.LockText>
              <FormattedMessage id="header.informations_safe" />
            </Styled.LockText>
          </Flex>
        );
      case HEADER_TYPES.STEPS:
        return <HeaderSteps activeStep={activeStep} stepCount={stepCount} />;
      case HEADER_TYPES.BUTTON:
        return (
          <Button outlined smaller onClick={buttonCallback}>
            <FormattedMessage id={messageId} />
          </Button>
        );
      case HEADER_TYPES.DB_BUTTON_CAMERA:
        return (
          <Button
            outlined
            smaller
            onClick={buttonCallback}
            icon="/images/questionMark.svg"
          >
            <FormattedMessage id={messageId} />
          </Button>
        );
      default:
        return null;
    }
  };

  const renderLeftSide = () => {
    if (type === HEADER_TYPES.DB_BUTTON_CAMERA) {
      return (
        <Button outlined smaller onClick={buttonTwoCallback}>
          <FormattedMessage id={messageTwoId} />
        </Button>
      );
    }
    return (
      <Styled.Logo
        src="/images/idvLogo.svg"
        alt="IDV"
        onClick={() => routerStore.push('/')}
      />
    );
  };

  return (
    <Styled.HeaderBox type={type} hideOnLandscape={hideOnLandscape ? 1 : 0}>
      <Styled.HeaderLeftSide type={type}>
        {renderLeftSide()}
      </Styled.HeaderLeftSide>
      {type !== HEADER_TYPES.SINGLE && (
        <Styled.HeaderRightSide>{renderRightSide()}</Styled.HeaderRightSide>
      )}
    </Styled.HeaderBox>
  );
};

Header.defaultProps = {
  type: 'lock',
  activeStep: 0,
  stepCount: 0,
  buttonCallback: () => {},
  buttonTwoCallback: () => {},
  messageId: 'header.end',
  messageTwoId: 'header.go_back',
  hideOnLandscape: false,
};

Header.propTypes = {
  type: PropTypes.oneOf(Object.values(HEADER_TYPES)),
  activeStep: PropTypes.number,
  /**
   * Total number of steps
   * @example 3
   */
  stepCount: PropTypes.number,
  /**
   * Callback function for right side button
   * @example () => {}
   */
  buttonCallback: PropTypes.func,
  /**
   * Callback function for left side button
   * @example () => {}
   */
  buttonTwoCallback: PropTypes.func,
  messageId: PropTypes.string,
  messageTwoId: PropTypes.string,
  hideOnLandscape: PropTypes.bool,
};

export default Header;
