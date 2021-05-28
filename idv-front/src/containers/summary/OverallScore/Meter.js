import React from 'react';
import { MeterWrapper, MeterScoring, Pointer } from '@containers/summary/style';
import PropTypes from 'prop-types';

const GRADES = {
  LOA0: -78,
  LOA1: -39,
  LOA2: 30,
  LOA3: 78,
};

const Meter = ({ grade }) => {
  return (
    <MeterWrapper>
      <MeterScoring src="/images/halfCircle.svg" alt="Score meter" />
      <Pointer angle={GRADES[grade]} />
    </MeterWrapper>
  );
};

Meter.propTypes = {
  grade: PropTypes.oneOf(Object.keys(GRADES)).isRequired,
};

export default Meter;
