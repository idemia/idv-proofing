import styled from '@emotion/styled';
import { Box } from 'rebass';

export const Circle = styled.circle`
  transition: 0.4s stroke-dashoffset ease-out;
  will-change: stroke-dashoffset;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  stroke-dashoffset: ${({ dashoffset }) => dashoffset};
  stroke-dasharray: ${({ dasharray }) => `${dasharray} ${dasharray}`};
`;

export const Wrapper = styled(Box)`
  position: relative;
  width: 80px;
  height: 80px;
`;

export const IconWrapper = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
