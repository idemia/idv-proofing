import styled from '@emotion/styled';

export default styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  ${({ hideOnLandscape }) =>
    hideOnLandscape &&
    `
    @media screen and (orientation: landscape) {
      display: none;
    }
  `}
`;
