import React from 'react';
import { StepsWrapper, Step } from '@components/Header/style';

const HeaderSteps = ({ activeStep, stepCount }) => {
  return (
    <StepsWrapper>
      {Array.from({ length: stepCount }, (_, i) => i + 1).map(step => (
        <Step key={step} futureStep={step > activeStep}>
          {step < activeStep ? (
            <img src="/images/checkmark.svg" alt="checkmark" />
          ) : (
            step
          )}
        </Step>
      ))}
    </StepsWrapper>
  );
};

export default HeaderSteps;
