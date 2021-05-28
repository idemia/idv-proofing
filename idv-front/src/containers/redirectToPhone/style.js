import styled from '@emotion/styled';
import { breakpoint } from '@styles/breakpoints';

export const ImagesWrapper = styled.div`
  display: flex;
  max-width: 800px;
  margin-top: 50px;

  @media screen and ${breakpoint.md} {
    flex-direction: column;
    align-items: center;
  }
`;

export const InstructionImage = styled.img`
  margin-right: 100px;
  @media screen and ${breakpoint.md} {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;
