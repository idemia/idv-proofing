import styled from '@emotion/styled';
import { Box } from 'rebass';
import { breakpoint } from '@styles/breakpoints';

export const AbsolutePage = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  z-index: 1001;
  background: ${({ theme }) => theme.colors.classicWhite};
`;

export const ModalHeader = styled(Box)`
  display: flex;
  height: 90px;
  position: relative;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 2px 4px 0 ${({ theme }) => theme.colors.shadowColorPrimary};
  line-height: 44px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  @media screen and ${breakpoint.md}, (orientation: landscape) {
    font-size: 16px;
    height: 50px;
    line-height: 22px;
  }
`;

export const CloseButton = styled.img`
  width: 50px;
  height: 50px;
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;

  @media screen and ${breakpoint.md}, (orientation: landscape) {
    width: 25px;
    height: 25px;
  }
`;

export const RawJsonWrapper = styled(Box)`
  height: calc(var(--vh, 1vh) * 100 - 90px);
  width: 100%;
  padding: 15px;
  background: ${({ theme }) => theme.colors.jsonModalBackground};
  overflow-y: auto;
  line-height: 1.25;
  @media screen and ${breakpoint.md}, (orientation: landscape) {
    height: calc(var(--vh, 1vh) * 100 - 50px);
  }
`;

export const StyledClipboardBtn = styled(Box)`
  position: absolute;
  bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 15px;
  width: 50px;
  height: 50px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 2px 4px 0 ${({ theme }) => theme.colors.shadowColorPrimary};
  border-radius: 50%;
  cursor: pointer;
`;

export const InformationWrapper = styled(Box)`
  width: 60%;
  margin: 0 auto;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ pb }) => pb && `padding-bottom: ${pb};`}

  @media screen and ${breakpoint.md} {
    width: 100%;
    padding: 20px;
  }
`;

export const InformationText = styled.p`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 20px;
  width: 100%;
`;

export const InputWrapper = styled(Box)`
  width: 50%;
  margin: 0 auto;
  padding: 50px;

  @media screen and ${breakpoint.md} {
    width: 100%;
    padding: 20px;
  }
`;
