import React from 'react';
import Page from '@components/Page';
import Header from '@components/Header';
import FillHeightWrapper from '@components/FillHeightWrapper';

const Layout = ({
  noFillHeight,
  children,
  hideHeaderOnLandscape,
  rowReverse,
  ...props
}) => {
  return (
    <Page>
      <Header hideOnLandscape={hideHeaderOnLandscape} {...props} />
      {!noFillHeight ? (
        <FillHeightWrapper
          fullHeight={hideHeaderOnLandscape ? 1 : 0}
          rowReverse={rowReverse}
        >
          {children}
        </FillHeightWrapper>
      ) : (
        children
      )}
    </Page>
  );
};

export default Layout;
