/* eslint-disable */

import React from 'react';
import { inject, observer } from 'mobx-react';
import map from 'lodash/map';
import { FormattedMessage } from 'react-intl';
import Loader, { SIZE } from '@components/Loader';
import {
  DocSectionContainer,
  DocSectionWrapper,
  DocSectionHeader,
  DocSectionElementWrapper,
  DocSectionElement,
  DocSectionElementTitle,
  DocSectionElementInfo,
  DocSectionElementColumn,
  IssueItem,
  IdInfoContainer,
  IdInfoElement,
  IdInfoFieldData,
  IdInfoFieldTitle,
  IdInfoWrapper,
} from '@containers/summary/style';

import ImagePreview from '@containers/summary/ImagePreview';

import DocElementStatus from '@containers/summary/DocAuthSection/DocElementStatus';

const DocAuthSection = ({
  summaryStore: {
    documentFrontImage,
    documentBackImage,
    documentAuthenticationDetails,
    twoSidesDocument,
    idDocument: {
      evidenceStatus: { errors },
      idDocumentData,
    },
  },
}) => (
  <>
    <IdInfoContainer>
      <IdInfoWrapper>
        {map(idDocumentData, (item, key) => {
          if (typeof item === 'string' && key !== 'barcode') {
            return (
              <IdInfoElement key={key}>
                <IdInfoFieldTitle>
                  <FormattedMessage
                    id={`summary.document_authentication.${key}`}
                  />
                </IdInfoFieldTitle>
                <IdInfoFieldData>
                  {key === 'barcode' ? item : item}
                </IdInfoFieldData>
              </IdInfoElement>
            );
          }
          return null;
        })}
      </IdInfoWrapper>
    </IdInfoContainer>

    <ImagePreview
      img1={documentFrontImage}
      img2={documentBackImage}
      single={!twoSidesDocument}
      fullColor
    />

    {errors && errors.length > 0 ? (
      <DocSectionContainer width="90%" separated>
        <DocSectionWrapper width="100%">
          <DocSectionHeader>Issues found</DocSectionHeader>

          {errors.map(err => (
            <IssueItem key={err.code}>
              {err.code}: {err.message}
            </IssueItem>
          ))}
        </DocSectionWrapper>
      </DocSectionContainer>
    ) : null}

    <DocSectionContainer width="90%">
      <DocSectionWrapper width="100%">
        <DocSectionHeader>Authentication</DocSectionHeader>

        <DocSectionElementWrapper col={3}>
          {documentAuthenticationDetails.map((item, index) => (
            <DocSectionElement
              key={`doc-auth-item_${index}`}
              disabled={item.status === 'untested' ? 1 : 0}
            >
              <DocSectionElementColumn>
                <DocSectionElementTitle>{item.text}</DocSectionElementTitle>
                <DocSectionElementInfo>
                  {item.description}
                </DocSectionElementInfo>
              </DocSectionElementColumn>
              <DocElementStatus status={item.status} />
            </DocSectionElement>
          ))}
        </DocSectionElementWrapper>
      </DocSectionWrapper>
    </DocSectionContainer>
  </>
);

export default inject(
  'documentStore',
  'summaryStore',
)(observer(DocAuthSection));
