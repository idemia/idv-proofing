import React from 'react';
import PropTypes from 'prop-types';
import { Wrapper, Icon } from '@components/Loader/style';

export const SIZE = {
  LARGE: 64,
  MEDIUM: 50,
  NORMAL: 38,
  SMALL: 20,
};

const Loader = ({ cover, size }) => (
  <Wrapper cover={cover}>
    <Icon alt="loading" src="/images/loader.svg" size={size} />
  </Wrapper>
);

Loader.defaultProps = {
  cover: false,
  size: SIZE.NORMAL,
};

Loader.propTypes = {
  /**
   * Define if Loader should covered parent node
   * @example true
   */
  cover: PropTypes.bool,
  size: PropTypes.oneOf(Object.values(SIZE)),
};

export default Loader;
