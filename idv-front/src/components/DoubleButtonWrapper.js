import styled from '@emotion/styled';
import { Box } from 'rebass';

export default styled(Box)`
  display: flex;
  margin: 0 -8px;
  align-self: stretch;

  & * {
    margin: 0 8px;
  }

  ${({ column, conditionalSingleButton }) =>
    column &&
    `
    flex-direction: column;
    margin: 0;
    & button, a {
      margin: 0;
    }

    & *:first-of-type {
      margin-bottom: ${conditionalSingleButton ? 0 : '15px'};
    }
  `}
`;
