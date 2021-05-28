import styled from '@emotion/styled';
import { breakpoint } from '@styles/breakpoints';

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 210px);
  gap: 15px 15px;
  margin-top: 20px;

  @media screen and ${breakpoint.md} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const OptionsItem = styled.button`
  text-align: left;
  align-self: stretch;
  border-radius: 5px;
  box-shadow: 0 0 8px 0 rgba(16, 16, 16, 0.1);
  border: solid 1px ${({ theme }) => theme.colors.borderColorPrimary};
  background-color: #fff;
  padding: 28px 15px;
  cursor: pointer;
  transition: box-shadow 0.2s linear, transform 0.4s ease-in-out;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 0 12px 0 rgba(16, 16, 16, 0.4);
    transform: scale(1.02);
  }
  &:focus {
    outline: none;
  }
`;

export const OptionFlag = styled.p`
  font-size: 48px;
  @media screen and ${breakpoint.md} {
    font-size: 36px;
  }
`;

export const OptionMethods = styled.p`
  margin-top: 20px;
  font-size: 20px;
  line-height: 1.5;

  @media screen and ${breakpoint.md} {
    font-size: 16px;
  }
`;
