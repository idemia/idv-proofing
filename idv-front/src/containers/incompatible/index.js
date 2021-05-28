import React from 'react';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import HeadingText, { FONT_SIZE } from '@components/HeadingText';
import { HEADER_TYPES } from '@components/Header/style';
import Content from '@components/Content';
import { size } from '@styles/breakpoints';
import { useWindowSize } from '@utils/useWindowSize';

import { CompatibleDevices } from '@containers/incompatible/style';
import Layout from '@components/Layout';
import routes from '@routes';

const LOGOS = {
  AndroidLogo: 'android.svg',
  iOSLogo: 'ios.svg',
  MobileSafari: 'safari.svg',
  Edge: 'edge.svg',
  Chrome: 'chrome.svg',
  Firefox: 'firefox.svg',
  Opera: 'opera.svg',
  SamsungBrowser: 'samsung-browser.svg',
};

const Incompatible = ({
  applicationStore: { incomatibleMessage, supportedList, unsupported },
}) => {
  const windowSize = useWindowSize();

  if (!incomatibleMessage || !supportedList.length) {
    return <Redirect to={routes.root} />;
  }

  const supportedBrowsersList = () =>
    supportedList.map(item => (
      <li key={`supported-item_${item.name}`}>
        <img
          src={`/images/logos/${LOGOS[item.name.replace(' ', '')]}`}
          alt={item.name}
        />
        <span>{item.name}</span>
        <small>
          {item.minimumVersion ? ` (version: >${item.minimumVersion})` : null}
        </small>
      </li>
    ));

  const supportedOsList = () =>
    supportedList.map(item => (
      <li key={`supported-item_${item}`}>
        <img src={`/images/logos/${LOGOS[`${item}Logo`]}`} alt={item} />
        <span>{item}</span>
      </li>
    ));

  const renderSupportedList = () => {
    if (unsupported === 'os') return supportedOsList();
    return supportedBrowsersList();
  };

  return (
    <Layout
      noFillHeight
      type={
        size.md < windowSize.width ? HEADER_TYPES.LOCK : HEADER_TYPES.SINGLE
      }
    >
      <Content>
        <HeadingText fontsize={FONT_SIZE.NORMAL} mb={30}>
          {incomatibleMessage}
        </HeadingText>
        <FormattedMessage id="incompatible.info" values={{ unsupported }} />

        <CompatibleDevices>
          {supportedList.length > 0 ? renderSupportedList() : null}
        </CompatibleDevices>
      </Content>
    </Layout>
  );
};

export default inject('applicationStore')(observer(Incompatible));
