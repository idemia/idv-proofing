import React, { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  IdInfoElement,
  IdInfoFieldTitle,
  IdInfoFieldData,
} from '@containers/summary/style';

const InfoElement = ({ item, translationKey }) => {
  const value = useMemo(() => {
    if (Array.isArray(item)) {
      return item.map(i => `${i.value} `);
    }
    return item.value;
  }, [item]);

  return (
    <IdInfoElement>
      <IdInfoFieldTitle>
        <FormattedMessage
          id={`summary.identity_information.${translationKey}`}
        />
      </IdInfoFieldTitle>
      <IdInfoFieldData>{value}</IdInfoFieldData>
    </IdInfoElement>
  );
};

export default memo(InfoElement);
