import React from 'react';

import { Label, Input, Wrapper } from '@components/Input/style';
import { PropTypes } from 'prop-types';

const Field = ({ label, name, id, onChange, error, mb, type }) => {
  return (
    <Wrapper mb={mb}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        name={name}
        id={id}
        onChange={onChange}
        error={error}
      />
    </Wrapper>
  );
};

Field.defaultProps = {
  error: 'init',
  mb: '0',
  type: 'text',
};

Field.propTypes = {
  error: PropTypes.oneOf(['init', 'valid', 'error']),
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  /**
   * Define margin below Field
   * @example 10px
   */
  mb: PropTypes.string,
  type: PropTypes.string,
};

export default Field;
