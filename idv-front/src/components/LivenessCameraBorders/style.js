import styled from '@emotion/styled';
import { Text } from 'rebass';

export const Wrapper = styled.div`
  position: absolute;
  z-index: 999999999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  ${({ elevated }) => elevated && 'background-color: rgba(0, 0, 0, 0.6);'}

  transistion: background 0.3s linear;

  > img {
    position: absolute;
    left: 50%;
    top: 50%;
    display: block;
    transform: translate(-50%, -50%);
    width: 75%;
  }
`;

export const Message = styled(Text)`
  color: ${({ theme }) => theme.colors.classicWhite};
  font-size: 28px;
  position: absolute;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  width: ${({ elevated }) => (elevated ? '75%' : '50%')};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
