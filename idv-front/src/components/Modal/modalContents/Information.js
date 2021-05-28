import React from 'react';
import { InformationWrapper, InformationText } from '@components/Modal/style';
import { FormattedMessage } from 'react-intl';

const Information = () => {
  return (
    <InformationWrapper>
      <InformationText>
        <FormattedMessage id="modal.information_part1" />
      </InformationText>
      <InformationText>
        <FormattedMessage id="modal.information_part2" />
      </InformationText>
      <InformationText>
        <FormattedMessage id="modal.information_part3" />
      </InformationText>
      <InformationText>
        <FormattedMessage id="modal.information_part4" />
      </InformationText>
      <InformationText>
        <FormattedMessage id="modal.information_part5" />
      </InformationText>
      <InformationText>
        <FormattedMessage id="modal.information_part6" />
      </InformationText>
      <InformationText>
        <FormattedMessage id="modal.information_part7" />
      </InformationText>
    </InformationWrapper>
  );
};

export default Information;
