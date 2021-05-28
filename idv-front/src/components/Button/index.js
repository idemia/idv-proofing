import React from 'react';
import * as Styled from '@components/Button/style';
import PropTypes from 'prop-types';

const Button = ({
  children,
  outlined,
  icon,
  iconOnRight,
  onClick,
  fullwidth,
  disabled,
  smaller,
  mt,
  as,
  to,
  hideOnPortrait,
  href,
}) => (
  <Styled.Button
    type={!as || as === 'button' ? 'button' : ''}
    href={href}
    outlined={outlined}
    onClick={onClick}
    fullwidth={fullwidth}
    smaller={smaller}
    disabled={disabled}
    mt={mt}
    as={as}
    to={to}
    hideOnPortrait={hideOnPortrait}
  >
    {icon && !iconOnRight && <Styled.Icon src={icon} alt="icon" />}
    {children}
    {icon && iconOnRight && <Styled.Icon src={icon} alt="icon" iconOnRight />}
  </Styled.Button>
);

Button.defaultProps = {
  outlined: false,
  icon: null,
  iconOnRight: false,
  fullwidth: false,
  disabled: false,
  smaller: false,
  hideOnPortrait: false,
  /**
   * Define margin above the component
   * @example '10px'
   */
  mt: '0',
  onClick: () => {},
  /**
   * Describes what html tag it is
   * @example 'button', 'a', 'submit'
   */
  as: null,
  to: null,
  href: null,
};

Button.propTypes = {
  outlined: PropTypes.bool,
  icon: PropTypes.any,
  iconOnRight: PropTypes.bool,
  onClick: PropTypes.func,
  fullwidth: PropTypes.bool,
  disabled: PropTypes.bool,
  smaller: PropTypes.bool,
  hideOnPortrait: PropTypes.bool,
  mt: PropTypes.string,
  as: PropTypes.any,
  to: PropTypes.string,
  href: PropTypes.string,
};

export default Button;
