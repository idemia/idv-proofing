/*
  This is only Demo App, here's no authentication layer between front and API.
  We recommend to add some kind of authentication and make all requests more secure.
*/
import React, { useEffect, lazy, Suspense } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

import GlobalStyle, { Loading } from '@styles/globalStyles';
import { ThemeProvider } from '@emotion/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from '@styles/theme';
import { history } from '@app/history';
import routes from '@routes';

const HomePage = lazy(() => import('@containers/home'));
const RedirectToPhone = lazy(() => import('@containers/redirectToPhone'));
const WaitForComplete = lazy(() => import('@containers/wait'));
const PlaceId = lazy(() => import('@containers/placeYourId'));
const GetId = lazy(() => import('@containers/getYourId'));
const DocumentSideCaptureInstructions = lazy(() =>
  import('@containers/documentSideCaptureInstructions'),
);
const DocumentCamera = lazy(() => import('@containers/documentCamera'));
const LivenessCamera = lazy(() => import('@containers/livenessCamera'));
const Preview = lazy(() => import('@containers/preview'));
const LoadingScreen = lazy(() => import('@containers/loading'));
const ErrorScreen = lazy(() => import('@components/Error'));
const ReturnToDesktop = lazy(() => import('@containers/returnToDesktop'));
const Incompetible = lazy(() => import('@containers/incompatible'));
const LivenessInstructions = lazy(() =>
  import('@containers/livenessInstructions'),
);
const Summary = lazy(() => import('@containers/summary'));
const Modal = lazy(() => import('@components/Modal'));

const App = ({ documentCameraStore: { setIsRetry } }) => {
  useEffect(() => {
    history.listen(location => {
      if (history.action === 'POP') {
        if (location.pathname === '/camera') {
          setIsRetry();
        }
      }
    });
  });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Suspense fallback="">
        <Modal />
      </Suspense>
      <Router history={history}>
        <Suspense
          fallback={
            <Loading>
              <FormattedMessage id="loading" />
            </Loading>
          }
        >
          <Switch>
            <Route exact path={routes.root} component={HomePage} />
            <Route exact path={routes.redirect} component={RedirectToPhone} />
            <Route exact path={routes.wait} component={WaitForComplete} />
            <Route exact path={routes.placeId} component={PlaceId} />
            <Route exact path={routes.getId} component={GetId} />
            <Route
              exact
              path={routes.frontId}
              component={props => (
                <DocumentSideCaptureInstructions {...props} side="front" />
              )}
            />
            <Route
              exact
              path={routes.backId}
              component={props => (
                <DocumentSideCaptureInstructions {...props} side="back" />
              )}
            />
            <Route exact path={routes.camera} component={DocumentCamera} />
            <Route
              exact
              path={routes.livenessCamera}
              component={LivenessCamera}
            />
            <Route exact path={routes.preview} component={Preview} />
            <Route exact path={routes.loading} component={LoadingScreen} />
            <Route exact path={routes.error} component={ErrorScreen} />
            <Route
              exact
              path={routes.returnToDesktop}
              component={ReturnToDesktop}
            />
            <Route exact path={routes.incompatible} component={Incompetible} />
            <Route
              exact
              path={routes.livenessInstructions}
              component={LivenessInstructions}
            />
            <Route exact path={routes.summary} component={Summary} />
            <Redirect from="*" to={routes.root} />
          </Switch>
        </Suspense>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </ThemeProvider>
  );
};

export default inject('documentCameraStore')(observer(App));
