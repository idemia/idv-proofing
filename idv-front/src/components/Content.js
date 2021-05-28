import { breakpoint } from '@styles/breakpoints';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const Content = styled.main`
  position: relative;
  width: 100%;
  padding: 50px 130px;
  display: flex;
  flex-direction: column;
  ${({ centerHorizontal }) => centerHorizontal && 'align-items: center;'}
  background: ${({ backgroundColor, theme }) =>
    backgroundColor || theme.colors.classicWhite};
  ${({ noBg }) => noBg && 'background: none;'}
  ${({ noPaddingBottom }) => noPaddingBottom && 'padding-bottom: 0;'}
  ${({ bottomDivider, theme }) =>
    bottomDivider &&
    `border-bottom: 1px solid ${theme.colors.borderColorPrimary};`}
  ${({ fill }) => fill && 'flex: 1;'}
  ${({ center }) =>
    center &&
    css`
      justify-content: center;
      align-items: center;
    `}

  @media screen and ${breakpoint.lg} {
    padding: 50px 50px;
    ${({ noPaddingBottom }) => noPaddingBottom && 'padding-bottom: 0;'}
  }

  @media screen and ${breakpoint.md}{
    padding: 27px 16px;
    ${({ noPaddingBottom }) => noPaddingBottom && 'padding-bottom: 0;'}
  }

  @media screen and (max-device-width: 1000px) and (orientation: landscape) {
    padding: 27px 16px;
    ${({ noPaddingBottom }) => noPaddingBottom && 'padding-bottom: 0;'}
  }

`;

export default Content;
