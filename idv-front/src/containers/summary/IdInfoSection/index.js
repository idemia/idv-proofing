import React from 'react';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';
import map from 'lodash/map';

import { IdInfoContainer, IdInfoWrapper } from '@containers/summary/style';
import InfoElement from '@containers/summary/IdInfoSection/InfoElement';

const IdInfoSection = ({ summaryStore: { idDocument } }) => {
  const idDocumentData = get(idDocument, 'idDocumentData.personalAttributes');

  if (!idDocumentData) return null;

  return (
    <IdInfoContainer>
      <IdInfoWrapper>
        {map(idDocumentData, (item, key) => (
          <InfoElement
            key={`info-element_${key}`}
            item={item}
            translationKey={key}
          />
        ))}
      </IdInfoWrapper>
    </IdInfoContainer>
  );
};

export default inject('summaryStore')(observer(IdInfoSection));
