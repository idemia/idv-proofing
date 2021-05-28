import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import * as Styled from '@components/ProgressRing/style';
import PropTypes from 'prop-types';

const ProgressRing = ({ progress, icon }) => {
  // calculation of the circumference of a circle (progress ring) according to the formula - 2π⋅r, where r is a radius of the circle
  const circumference = 36 * 2 * Math.PI;
  const [dashoffset, setDashoffset] = useState(circumference);
  const theme = useTheme();
  useEffect(() => {
    setDashoffset(circumference - (progress / 100) * circumference);
  }, [progress]);

  return (
    <Styled.Wrapper>
      <svg width="80" height="80">
        <Styled.Circle
          dashoffset={dashoffset}
          dasharray={circumference}
          stroke={theme.colors.progressRingPrimary}
          strokeWidth="4"
          fill="transparent"
          r="36"
          cx="40"
          cy="40"
        />
        <circle
          stroke={theme.colors.progressRingSecondary}
          strokeWidth="4"
          fill="transparent"
          r="36"
          cx="40"
          cy="40"
        />
      </svg>
      <Styled.IconWrapper src={icon} alt="loading-icon" />
    </Styled.Wrapper>
  );
};

ProgressRing.propTypes = {
  progress: PropTypes.number.isRequired,
  icon: PropTypes.any.isRequired,
};

export default ProgressRing;
