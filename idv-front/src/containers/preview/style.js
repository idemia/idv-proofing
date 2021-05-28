import styled from '@emotion/styled';
import { Box, Text } from 'rebass';

export const SmallText = styled(Text)`
  color: ${({ theme }) => theme.colors.subTextColor};
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 15px;
`;

export const ExampleImage = styled.img`
  display: block;
`;

export const BoxLine = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const ImageRotationWrapper = styled.div`
  overflow: hidden;
  height: ${({ setHeight }) => setHeight}px;
`;

export const TakenImageWrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  transform: rotate(${({ rotation }) => rotation}deg)
    ${({ ratio, rotation }) => {
      if (rotation === 90 || rotation === 270) {
        return `scale(${ratio}) translateY(-${ratio * 100}vw)`;
      }

      return null;
    }};
`;
export const TakenImage = styled.img`
  width: 100%;
  display: block;
`;

export const CapturedImageOutline = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
`;
