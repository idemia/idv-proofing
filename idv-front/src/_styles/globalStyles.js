import React from 'react';
import { Global, css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import reset from 'emotion-reset';
import { useWindowSize } from '@utils/useWindowSize';

const GlobalStyle = () => {
  const { height } = useWindowSize();
  const theme = useTheme();

  return (
    <Global
      styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');
        ${reset}

        :root {
          --vh: ${`${height * 0.01}px` || '1vh'};
        }

        *,
        *:after,
        *:before {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          color: #000;
          font-family: ${theme.fontFamily.Montserrat};
        }

        a,
        a:visited {
          text-decoration: none;
        }

        strong {
          font-weight: ${theme.fontWeights.bold};
        }

        .active-tab {
          color: ${theme.colors.summaryTabActive} !important;
          border-bottom: 4px solid ${theme.colors.summaryTabActive} !important;
        }

        .fade-enter {
          opacity: 0;
          transform: scale(0.9);
        }
        .fade-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms, transform 300ms;
        }
        .fade-exit {
          opacity: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 300ms, transform 300ms;
        }
      `}
    />
  );
};

export default GlobalStyle;

export const Loading = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;
