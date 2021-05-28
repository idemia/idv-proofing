import styled from '@emotion/styled';
import { breakpoint } from '@styles/breakpoints';
import { Text } from 'rebass';

export const FONT_SIZE = {
  LARGE: 44,
  MEDIUM: 32,
  NORMAL: 24,
  SMALL: 18,
};

export default styled(Text)`
  font-size: ${({ fontsize }) => fontsize || FONT_SIZE.LARGE}px;
  line-height: ${({ fontsize }) => (fontsize || FONT_SIZE.LARGE) * 1.4545}px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  max-width: 800px;

  ${({ theme, textColor }) => {
    let color = theme.colors.headingColor;
    switch (textColor) {
      case 'success':
        color = theme.colors.success;
        break;
      case 'warning':
        color = theme.colors.warning;
        break;
      case 'processing':
        color = theme.colors.processing;
        break;
      case 'error':
        color = theme.colors.error;
        break;
      default:
        color = theme.colors.headingColor;
    }
    return `color: ${color}`;
  }};

  @media screen and ${breakpoint.md}${({ forceLandscapeMobile }) =>
  forceLandscapeMobile && ', (orientation: landscape)'}{
    font-size: ${({ fontsize }) =>
      !fontsize || fontsize > 22 ? 22 : fontsize}px;
    max-width: none;
    line-height: 30px;
  }

  ${({ forceSmallerLandscape }) =>
    forceSmallerLandscape &&
    `
    @media screen and (orientation: landscape) {
      font-size: ${({ fontsize }) =>
        !fontsize || fontsize > 22 - 3 ? 22 - 3 : fontsize}px;
      line-height: 27px;
    }
  `}
`;
