import styled from '@emotion/styled';

export const CameraContainer = styled.video`
  flex: 2;
  background-color: #ddd;
  height: 100%;
  object-fit: cover;

  @media screen and (orientation: landscape) {
    height: auto;
    width: 100%;
  }
`;

export const CameraBorders = styled.div`
  position: absolute;
`;
