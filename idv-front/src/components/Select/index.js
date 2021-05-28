import React from 'react';
import { SelectElement, GenericSelect, Label } from '@components/Select/style';
import PropTypes from 'prop-types';

const Select = ({ children, id, label, name, value, onChange, mb }) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <SelectElement mb={mb}>
        <GenericSelect id={id} name={name} value={value} onChange={onChange}>
          <option value="">-</option>
          {children}
        </GenericSelect>
      </SelectElement>
    </>
  );
};

Select.defaultProps = {
  mb: '0',
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  mb: PropTypes.string,
};

export default Select;
