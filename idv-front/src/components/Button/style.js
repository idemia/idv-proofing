import styled from '@emotion/styled';
import isPropValid from '@emotion/is-prop-valid';

export const Button = styled('button', {
  shouldForwardProp: isPropValid,
})`
  position: relative;
  background-color: ${({ outlined, theme }) =>
    outlined ? theme.colors.classicWhite : theme.colors.primary};
  font-size: ${({ smaller, theme }) =>
    smaller ? theme.fontSizes.buttonSmaller : theme.fontSizes.button}px;
  height: ${({ smaller }) => (smaller ? '30px' : '44px')};
  color: ${({ outlined, theme }) =>
    outlined ? theme.colors.primary : theme.colors.classicWhite};
  border: ${({ theme, outlined }) =>
    outlined ? `2px solid ${theme.colors.primary}` : 'none'};
  padding: 0 15px;
  border-radius: 22px;
  cursor: ${({ disabled }) => (!disabled ? 'pointer' : 'not-allowed')};
  transition: background-color 0.2s linear;
  width: ${({ fullwidth }) => (fullwidth ? '100%' : 'auto')};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.fontWeights.bold};;
  display: flex;
  font-family: inherit;
  align-items: center;
  justify-content: center;
  z-index: 10;
  outline: none;
  ${({ mt }) => mt && `margin-top: ${mt};`}
  ${({ disabled }) => disabled && 'opacity: 0.6;'}

  ${({ outlined, disabled, theme }) =>
    !outlined &&
    !disabled &&
    `&:hover {
    background-color: ${theme.colors.primary}CC;
  }`}

  ${({ hideOnPortrait }) =>
    hideOnPortrait &&
    `
    @media screen and (orientation: portrait) {
      display: none;
    }
  `}

`;

export const Icon = styled.img`
  height: 18px;
  width: 18px;
  margin-right: 5px;

  ${({ iconOnRight }) =>
    iconOnRight &&
    `
    margin-right: 0;
    margin-left: 5px;
  `}
`;
