import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.classicWhite};
  z-index: 30;

  > span {
    display: block;
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin-top: 15px;
    font-size: 24px;
  }
`;
