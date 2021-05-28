import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { IntlProvider } from 'react-intl';

import * as stores from '@stores';
import smoothscroll from 'smoothscroll-polyfill';
import App from './App';
import * as serviceWorker from './serviceWorker';

// --- LANGUAGE SETUP ---
// Files with translations
import en from './translations/en.json';

const language = (navigator.browserLanguage || navigator.language).split(
  /[-_]/,
)[0];

const translations = { en };
// --- !LANGUAGE SETUP ---

smoothscroll.polyfill();

ReactDOM.render(
  <IntlProvider
    locale={language}
    messages={translations[language] || translations.en}
  >
    <Provider {...stores}>
      <App />
    </Provider>
  </IntlProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
