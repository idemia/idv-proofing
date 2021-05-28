import React, { useState } from 'react';
import { JsonFormatter } from 'react-json-formatter';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { RawJsonWrapper, StyledClipboardBtn } from '@components/Modal/style';
import { useTheme } from '@emotion/react';

const RawJson = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();

  const successCopy = () => setCopied(true);

  return (
    <RawJsonWrapper>
      <JsonFormatter json={data} JsonStyle={theme.jsonStyle} tabWidth={2} />
      <CopyToClipboard text={data} onCopy={successCopy}>
        <StyledClipboardBtn>
          <img
            src={copied ? '/images/check.svg' : '/images/copy.svg'}
            alt="copy"
          />
        </StyledClipboardBtn>
      </CopyToClipboard>
    </RawJsonWrapper>
  );
};

export default RawJson;
