import styled from '@emotion/styled';
import { breakpoint } from '@styles/breakpoints';
import { css } from '@emotion/react';

export default styled.div`
  height: calc(
    var(--vh, 1vh) * 100 - ${({ theme }) => theme.header.height.desktop}
  );
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ rowReverse }) =>
    rowReverse &&
    `
    @media screen and (orientation: landscape) {
      flex-direction: row-reverse;
      width: 100%;

      * > {
        flex: 1;
      }
    }

  `}

  @media screen and ${breakpoint.md} {
    height: calc(
      var(--vh, 1vh) * 100 - ${({ theme }) => theme.header.height.mobile}
    );
  }

  ${({ fullHeight }) => {
    if (fullHeight) {
      return css`
        @media screen and (orientation: landscape) {
          height: 85vh !important;
        }
      `;
    }
    return null;
  }}
`;
