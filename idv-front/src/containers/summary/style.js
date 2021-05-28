import styled from '@emotion/styled';
import { Box, Text } from 'rebass';
import { breakpoint } from '@styles/breakpoints';
import { css } from '@emotion/react';

export const TabsContainer = styled(Box)`
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media screen and ${breakpoint.md} {
    overflow-x: auto;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: nowrap;
  }
`;

export const TabItem = styled(Box)`
  border-bottom: 4px solid ${({ theme }) => theme.colors.summaryTabInactive};
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  flex: 1;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.summaryTabInactive};
  font-size: 18px;

  @media screen and ${breakpoint.md} {
    padding: 0 15px;
    min-width: 120px;
    flex: 1 0 auto;
    font-size: 14px;
  }
`;

export const ScrollabelWrapper = styled(Box)`
  max-height: calc(var(--vh, 1vh) * 100 - 145px);
  overflow-y: auto;
  position: relative;
  scroll-behavior: smooth;

  @media screen and ${breakpoint.md} {
    max-height: calc(var(--vh, 1vh) * 100 - 95px);
  }
`;

export const TabPanelBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderOrSeparator};
  padding: 35px;

  @media screen and ${breakpoint.md} {
    padding: 35px 0;
  }
`;

export const VerificationWrapper = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

export const DocSectionContainer = styled(Box)`
  display: flex;
  align-items: flex-start;
  margin: 10px -10px 0;
  justify-content: center;
  width: ${({ width }) => width || '100%'};
  margin-bottom: ${({ separated }) => (separated ? '30px' : 0)};

  @media screen and ${breakpoint.md} {
    flex-direction: column;
    width: 100%;
    margin: 0;
  }
`;

export const DocSectionHeader = styled(Box)`
  font-size: 18px;
  line-height: 20px;
  margin: 16px 0;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const DocSectionWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ width }) => width || '100%'};
  margin: 0 10px;

  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    margin-right: 0;
  }

  @media screen and ${breakpoint.md} {
    margin: 15px 0 0 0;
    width: 100%;
  }
`;

export const DocSectionElementWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
  & > * {
    width: ${({ col }) =>
      col ? `calc(${100 / 3}% - 20px)` : `calc(100% - 20px)`};
  }

  @media screen and ${breakpoint.md} {
    & > * {
      width: 100%;
    }
    margin: 0;
    width: 100%;
  }
`;

export const DocSectionElement = styled(Box)`
  display: flex;
  border-top: 1px solid
    ${({ disabled, theme }) =>
      disabled
        ? theme.colors.borderOrSeparatorDisabled
        : theme.colors.borderOrSeparator};
  border-bottom: 1px solid
    ${({ disabled, theme }) =>
      disabled
        ? theme.colors.borderOrSeparatorDisabled
        : theme.colors.borderOrSeparator};
  padding: 5px 12px;
  justify-content: space-between;
  align-items: center;
  margin: 12px 10px;
  ${({ disabled, theme }) =>
    disabled && `color: ${theme.colors.borderOrSeparatorDisabled}`};

  @media screen and ${breakpoint.md} {
    width: 100%;
    margin: 0;
    border-bottom: none;
    border-color: ${({ theme }) => theme.colors.borderOrSeparator};

    &:last-of-type {
      border-bottom: 1px solid ${({ theme }) => theme.colors.borderOrSeparator};
    }
  }
`;

export const DocSectionElementTitle = styled(Text)`
  line-height: 24px;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.semiBold};
`;

export const DocSectionElementInfo = styled(Text)`
  line-height: 18px;
  font-size: 12px;
`;

export const DocSectionElementColumn = styled.div`
  flex: 1;
`;

export const DocSectionElementStatus = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 10px;
`;

export const DocSectionElementStatusIcon = styled(Box)`
  width: 16px;
  height: 16px;
  margin-left: 8px;
  position: relative;
`;

export const StatusTooltip = styled(Box)`
  position: absolute;
  width: 200px;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.classicWhite};
  border: 2px solid ${({ theme }) => theme.colors.borderOrSeparator};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.borderOrSeparator};
  line-height: 18px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s linear;
  z-index: 10;
  box-shadow: 0 0 12px 0 ${({ theme }) => theme.colors.shadowColorPrimary};

  @media screen and ${breakpoint.md} {
    left: auto;
    transform: none;
    right: 0;
  }
`;

export const StatusHoverWrapper = styled(Box)`
  &:hover + div {
    opacity: 1;
    visibility: visible;
  }
`;
export const ImagePreviewWrapper = styled(Box)`
  display: flex;
  align-items: flex-start;
  max-width: 60%;
  margin-top: 25px;
  justify-content: center;

  @media screen and ${breakpoint.md} {
    max-width: unset;
    margin: 25px 10px 0;
  }
`;

export const ImagePreviewElement = styled.img`
  flex: 1;
  max-width: calc(50% - 5px);
  /* max-height: ${({ single }) => (single ? 'unset' : '210px')}; */

  &:first-of-type {
    margin-right: 5px;
  }

  &:last-of-type {
    margin-left: 5px;
  }

  ${({ blackAndWhite }) =>
    blackAndWhite
      ? css`
          filter: grayscale(100%);
        `
      : null}
`;

export const IdInfoContainer = styled(Box)`
  width: ${({ fullwidth }) => (fullwidth ? '100%' : '90%')};
  margin-top: ${({ mt }) => mt || '25px'};
`;

export const IdInfoWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px 0;
`;

export const IdInfoElement = styled(Box)`
  width: calc(${({ width }) => width || '25%'} - 20px);
  margin: 20px 10px;

  ${({ noColumnMobile }) =>
    !noColumnMobile &&
    `
  @media screen and ${breakpoint.md} {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 20px 0;
  }
  `}
`;

export const IdInfoFieldTitle = styled(Text)`
  font-size: 12px;
  line-height: 18px;
`;

export const IdInfoFieldData = styled(Text)`
  font-size: 16px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  word-break: break-word;
`;

export const OverallSubTextWithIcon = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 21px;
  line-height: 27px;
  color: ${({ theme }) => theme.colors.borderOrSeparator};
  margin-top: 10px;
`;

export const NextStepsWrapper = styled(Box)`
  text-align: center;
  width: 40%;
  padding: 0 20px;

  & > a {
    margin-bottom: 16px;
  }
  & > a:first-of-type {
    margin-top: 24px;
  }
  & > a:last-of-type {
    margin-bottom: 0;
  }

  @media screen and ${breakpoint.md} {
    width: 100%;
  }
`;

export const AnimationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const MeterWrapper = styled(Box)`
  position: relative;
  width: 390px;
  max-width: 100%;
  padding: 0 20px;
  margin: 15px auto 0;
`;

export const MeterScoring = styled.img`
  z-index: 11;
  position: relative;
  width: 100%;
`;

export const Pointer = styled(Box)`
  position: absolute;
  z-index: 12;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.classicBlack};
  bottom: 0;
  left: 50%;
  transfrom: translateX(-50%);

  &:after {
    content: '';
    width: 5px;
    height: 80px;
    border-radius: 3px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform-origin: bottom center;
    transform: translateX(-50%) rotate(${({ angle }) => angle || -78}deg);
    background: ${({ theme }) => theme.colors.classicBlack};
  }
`;

export const IssueItem = styled.div`
  font-weight: 600;
`;
