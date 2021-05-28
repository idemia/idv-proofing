import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Content from '@components/Content';
import Text from '@components/HeadingText';
import SubText from '@components/SubText';
import Lottie from 'react-lottie';
import Button from '@components/Button';
import ButtonWrapper from '@components/ButtonAbsWrapper';
import Layout from '@components/Layout';
import PropTypes from 'prop-types';

const Wizard = ({
  header,
  message: { heading, subText },
  button: { title, navigateTo, action },
  animation,
}) => {
  const [doRedirect, setDoRedirect] = useState(false);

  useEffect(() => {
    return () => {
      setDoRedirect(false);
    };
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMin slice',
    },
  };

  const onButtonClickHandler = () => {
    if (typeof action === 'function') {
      action();
    }
    setDoRedirect(true);
  };

  if (doRedirect) {
    return <Redirect push to={navigateTo} />;
  }

  return (
    <Layout {...header} rowReverse>
      <Content forceLandscapeMobile>
        <Text forceLandscapeMobile forceSmallerLandscape>
          <FormattedMessage id={heading || 'placeholder'} />
        </Text>
        {subText && (
          <SubText mt="10px" forceLandscapeMobile forceSmallerLandscape>
            <FormattedMessage id={subText} />
          </SubText>
        )}
        <Button
          onClick={onButtonClickHandler}
          fullwidth
          hideOnPortrait
          height="100%"
          mt="auto"
        >
          <FormattedMessage id={title} />
        </Button>
      </Content>
      {animation && (
        <Lottie options={defaultOptions} isStopped={false} isPaused={false} />
      )}

      <ButtonWrapper hideOnLandscape>
        <Content noBg>
          <Button onClick={onButtonClickHandler} fullwidth>
            <FormattedMessage id={title} />
          </Button>
        </Content>
      </ButtonWrapper>
    </Layout>
  );
};

Wizard.defaultProps = {
  animation: null,
};

Wizard.propTypes = {
  header: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  button: PropTypes.object.isRequired,
  animation: PropTypes.object,
};

export default Wizard;
