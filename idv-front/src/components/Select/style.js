import styled from '@emotion/styled';

const resetSelectStyle = `
  appearance: none;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  cursor: inherit;

  z-index: 1;

  &::-ms-expand {
    display: none;
  }

  outline: none;
`;

export const GenericSelect = styled.select`
  ${resetSelectStyle}
  padding: 10px 12px;
  grid-area: select;
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fontWeights.semiBold};
  background-color: ${({ theme }) => theme.colors.classicWhite};
  line-height: 18px;
`;

export const SelectElement = styled.div`
  display: grid;
  grid-template-areas: 'select';
  align-items: center;
  position: relative;

  border: 1px solid ${({ theme }) => theme.colors.borderColorPrimary};
  border-radius: 4px;
  overflow: hidden;
  &::after {
    grid-area: select;
  }

  cursor: pointer;

  &::after {
    content: '';
    grid-area: select;
    justify-self: end;
    width: 12px;
    height: 12px;
    border: 2px solid ${({ theme }) => theme.colors.borderColorPrimary};
    border-top: none;
    border-right: none;
    transform: rotate(-45deg) translateY(-5px);
    margin-right: 12px;
    z-index: 1;
  }

  ${({ mb }) => mb && `margin-bottom: ${mb};`}
`;

export const Label = styled.label`
  font-size: 16px;
  display: block;
  margin-bottom: 10px;
`;
