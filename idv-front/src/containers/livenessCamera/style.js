import styled from '@emotion/styled';
import { breakpoint } from '@styles/breakpoints';

export const CameraContainer = styled.video`
  background-color: #ddd;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  position: absolute;
  object-fit: cover;
  height: calc(var(--vh, 1vh) * 100 - 100px); // 100px is a header height;
  transform: scale(-1, 1);

  @media screen and ${breakpoint.md} {
    height: calc(var(--vh, 1vh) * 100 - 50px); // 50px is a header height;
  }
`;

export const CameraBorders = styled.div`
  position: absolute;
`;

export const CameraWrapper = styled.div`
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  position: absolute;
`;
