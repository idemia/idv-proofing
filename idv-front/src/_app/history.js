import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import routerStore from '@stores/routerStore';

const browserHistory = createBrowserHistory();

export const history = syncHistoryWithStore(browserHistory, routerStore);
