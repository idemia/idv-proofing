import styled from '@emotion/styled';
import { Box, Text } from 'rebass';
import { breakpoint } from '@styles/breakpoints';
import { css } from '@emotion/react';

export const HEADER_TYPES = {
  LOCK: 'lock',
  SINGLE: 'single',
  STEPS: 'steps',
  BUTTON: 'button',
  DB_BUTTON_CAMERA: 'db_button_camera',
};

export const HeaderBox = styled.header`
  position: relative;
  padding: 0 24px;
  height: ${({ theme }) => theme.header.height.desktop};
  box-shadow: 0 2px 4px 0 ${({ theme }) => theme.colors.shadowColorPrimary};
  display: flex;
  align-items: center;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.classicWhite};

  @media screen and ${breakpoint.md} {
    padding: 0 12px;
    height: ${({ theme }) => theme.header.height.mobile};
  }

  @media screen and (max-device-width: 1000px) and (orientation: landscape) {
    padding: 0 12px;
    height: ${({ theme }) => theme.header.height.mobile};
  }

  ${({ hideOnLandscape }) =>
    hideOnLandscape
      ? css`
          @media screen and (orientation: landscape) {
            display: none;
          }
        `
      : null}
`;

export const Logo = styled.img`
  height: 35px;
  cursor: pointer;

  @media screen and ${breakpoint.md} {
    height: 18px;
  }

  @media screen and (max-device-width: 1000px) and (orientation: landscape) {
    height: 18px;
  }
`;

export const LockImg = styled.img`
  height: 32px;
  margin-right: 12px;
  @media screen and ${breakpoint.md} {
    height: 16px;
    margin-right: 5px;
  }

  @media screen and (max-device-width: 1000px) and (orientation: landscape) {
    height: 16px;
    margin-right: 5px;
  }
`;

export const LockText = styled(Text)`
  @media screen and ${breakpoint.md} {
    height: 10px;
    font-size: 9px;
  }

  @media screen and (max-device-width: 1000px) and (orientation: landscape) {
    height: 10px;
    font-size: 9px;
  }
`;

export const HeaderRightSide = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  flex: 1;
`;

export const HeaderLeftSide = styled(Box)`
  display: flex;
  flex: 1;
  margin-right: auto;
  ${({ type }) => type === HEADER_TYPES.SINGLE && 'justify-content: center'}
`;

export const StepsWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 150px;

  &:after {
    content: '';
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.colors.headerStepsPast};
    opacity: 0.1;
    position: absolute;
    left: 0;
    top: 50%;
    z-index: 1;
  }
`;

export const Step = styled(Box)`
  width: 25px;
  height: 25px;
  background: ${({ futureStep, theme }) =>
    futureStep ? theme.colors.headerStepsFuture : theme.colors.headerStepsPast};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.headerStepsFontColor};
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  img {
    margin-top: 4px;
  }
`;
