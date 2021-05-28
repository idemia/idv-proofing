import React, { useState, useCallback } from 'react';
import HeadingText, { FONT_SIZE } from '@components/HeadingText';
import SubText, { FONT_SIZE as SUB_FONT_SIZE } from '@components/SubText';
import { FormattedMessage } from 'react-intl';
import Input from '@components/Input';
import Button from '@components/Button';
import RegexTests from '@utils/regexTests';
import { InformationWrapper, InputWrapper } from '@components/Modal/style';
import debounce from 'lodash/debounce';
import SuccessIcon from '@assets/success';

const SendProofFile = () => {
  const [value, setValue] = useState('');
  const [formError, setFormError] = useState('init');
  const [showSuccess, setShowSuccess] = useState(false);

  const submitForm = () => {
    // send request
    setShowSuccess(true);
  };

  const validate = useCallback(
    debounce(val => {
      if (RegexTests.emailCheck(val)) setFormError('valid');
      else setFormError('error');
    }, 500),
    [],
  );

  const setAndValidate = e => {
    setValue(e.target.value);
    validate(e.target.value);
  };

  return (
    <>
      {showSuccess && (
        <InformationWrapper pb="0">
          <SuccessIcon
            width="75px"
            height="75px"
            style={{ marginBottom: '15px' }}
          />
          <HeadingText
            textColor="success"
            fontsize={FONT_SIZE.NORMAL}
            textAlign="center"
          >
            <FormattedMessage id="modal.send_proof.link" />
          </HeadingText>
          <SubText fontsize={SUB_FONT_SIZE.SMALL} textAlign="center" mt="10px">
            <FormattedMessage id="modal.send_proof.details" />
          </SubText>
        </InformationWrapper>
      )}
      <InputWrapper>
        <Input
          label={<FormattedMessage id="modal.send_proof.email_label" />}
          name="email"
          id="email"
          value={value}
          error={formError}
          onChange={e => setAndValidate(e)}
        />
        <Button
          fullwidth
          mt="35px"
          disabled={formError === 'init' || formError === 'error'}
          onClick={submitForm}
        >
          <FormattedMessage id="modal.send_proof.button" />
        </Button>
      </InputWrapper>
    </>
  );
};

export default SendProofFile;
