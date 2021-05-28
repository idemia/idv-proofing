import styled from '@emotion/styled';
import { Text } from 'rebass';
import { css } from '@emotion/react';

const maskMargin = 0.85;

export const Wrapper = styled.div`
  position: absolute;
  z-index: 5;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  > svg {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const Mask = styled.div`
  position: absolute;
  top: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const MaskBorder = styled.div`
  width: ${maskMargin * 100}%;
  max-height: ${maskMargin * 100}%;

  // Calculations for drawing document borders on camera view, according to ISO/IEC 7810 standards
  // https://en.wikipedia.org/wiki/ISO/IEC_7810
  ${({ docFormat }) => {
    switch (docFormat) {
      case 'ID1':
        return css`
          max-width: calc(85.6 / 53.98 * 100vh);
          height: calc(53.98 / 85.6 * 100vw);

          @media (orientation: portrait) {
            max-width: calc(53.98 / 85.6 * 100vh);
            height: calc(85.6 / 53.98 * 100vw);
          }
        `;

      case 'ID2':
        return css`
          max-width: calc(105 / 74 * 100vh);
          height: calc(74 / 100 * 100vw);
          @media (orientation: portrait) {
            max-width: calc(74 / 100 * 100vh);
            height: calc(105 / 74 * 100vw);
          }
        `;

      case 'ID3':
        return css`
          max-width: calc(125 / 88 * 100vh);
          height: calc(88 / 125 * 100vw);
          @media (orientation: portrait) {
            max-width: calc(88 / 125 * 100vh);
            height: calc(125 / 88 * 100vw);
          }
        `;

      default:
        return null;
    }
  }}

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  border: 5px solid white;
  border-radius: 15px;
  background: transparent;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.75);
  position: relative;
`;

export const Message = styled(Text)`
  color: ${({ theme }) => theme.colors.classicWhite};
  font-size: 28px;
  transform: rotate(90deg);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;

  @media screen and (orientation: landscape) {
    transform: rotate(0);
  }
`;
