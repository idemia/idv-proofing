import styled from '@emotion/styled';
import { Box } from 'rebass';

export const Input = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  border: 1px solid ${({ theme }) => theme.colors.borderColorPrimary};
  border-radius: 4px;
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  line-height: 18px;
  font-weight: ${({ theme }) => theme.fontWeights.semibBold};
  ${({ error, theme }) =>
    error === 'error' && `border-color: ${theme.colors.error};`}
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: none;
  }
  margin: 0;
`;

export const Label = styled.label`
  font-size: 16px;
  display: block;
  margin-bottom: 10px;
`;

export const Wrapper = styled(Box)``;
