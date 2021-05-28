import styled from '@emotion/styled';
import { Box } from 'rebass';

export default styled(Box)`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 30px;
  margin: 0 auto;
  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth}`}
`;
