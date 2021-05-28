import styled from '@emotion/styled';

const Page = styled.div`
  min-height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  background: ${({ backgroundColor, theme }) =>
    backgroundColor || theme.colors.classicWhite};
  display: flex;
  flex-direction: column;
`;

export default Page;
