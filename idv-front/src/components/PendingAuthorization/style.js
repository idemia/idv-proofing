import styled from '@emotion/styled';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > span {
    display: block;
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin-top: 15px;
    font-size: 24px;

    small {
      display: block;
      font-weight: ${({ theme }) => theme.fontWeights.normal};
      margin-top: 10px;
      font-size: 13px;
    }
  }
`;
