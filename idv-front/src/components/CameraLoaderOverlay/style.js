import styled from '@emotion/styled';
import { Box, Text } from 'rebass';

export const Overlay = styled(Box)`
  position: absolute;
  width: 70%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.livenessSpinnerBackground};
  border-radius: 15px;
  z-index: 9999999999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
  flex-direction: column;
`;

export const Message = styled(Text)`
  color: ${({ theme }) => theme.colors.classicWhite};
  font-size: 18px;
  line-height: 24px;
`;

export const Loader = styled(Box)`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.livenessSpinnerSecondary};
  border-right: 4px solid ${({ theme }) => theme.colors.livenessSpinnerPrimary};
  animation: spin 1s linear infinite;
  will-change: transform;
  margin-bottom: 15px;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
