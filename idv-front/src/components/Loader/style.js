import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const Wrapper = styled.div`
  ${({ cover, theme }) =>
    cover
      ? css`
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${theme.colors.loaderOverlayBackground};
          z-index: 999;
        `
      : null}
`;

export const Icon = styled.img`
  display: block;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;
