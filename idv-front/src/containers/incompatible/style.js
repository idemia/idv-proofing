import styled from '@emotion/styled';
import { breakpoint } from '@styles/breakpoints';

export const CompatibleDevices = styled.ul`
  display: flex;
  margin-top: 30px;
  flex-wrap: wrap;

  > li {
    margin-right: 30px;
    display: flex;
    align-items: center;

    span {
      display: block;
      margin-left: 15px;
      font-weight: ${({ theme }) => theme.fontWeights.bold};
    }

    small {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
      padding-top: 3px;
    }
  }

  img {
    display: block;
    height: 100px;
  }

  @media screen and ${breakpoint.md} {
    > li {
      width: 100%;
      flex-direction: column;
      margin-right: 0;
      margin-bottom: 30px;

      span {
        margin-left: 0;
        margin-top: 10px;
      }
    }
  }
`;
