import styled from '@emotion/styled';
import { breakpoint } from '@styles/breakpoints';
import { Text } from 'rebass';

export const FONT_SIZE = {
  NORMAL: 24,
  SMALL: 18,
};

export default styled(Text)`
  font-size: ${({ fontsize }) => fontsize || FONT_SIZE.NORMAL}px;
  line-height: ${({ fontsize }) => (fontsize || FONT_SIZE.NORMAL) * 1.4545}px;
  color: ${({ theme }) => theme.colors.subTextColor};
  white-space: pre-wrap;

  @media screen and ${breakpoint.md}${({ forceLandscapeMobile }) =>
  forceLandscapeMobile && ', (orientation: landscape)'} {
    font-size: ${({ fontsize }) =>
      !fontsize || fontsize > 24 ? 16 : fontsize}px;
    line-height: ${({ fontsize }) =>
      !fontsize || fontsize > 24 ? 22 : fontsize * 1.4545}px;
  }

  ${({ forceSmallerLandscape, fontsize }) =>
    forceSmallerLandscape &&
    `
    @media screen and (orientation: landscape) {
      font-size: ${!fontsize || fontsize > 24 - 3 ? 16 - 3 : fontsize}px;
    line-height: ${
      !fontsize || fontsize > 24 - 3 ? 22 - 3 : fontsize * 1.4545
    }px;
    }
  `}
`;
