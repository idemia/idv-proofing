import React, { useEffect, useRef, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { NavLink, useHistory } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { FormattedMessage } from 'react-intl';

import Layout from '@components/Layout';
import { useWindowSize } from '@utils/useWindowSize';
import { HEADER_TYPES } from '@components/Header/style';
import { size } from '@styles/breakpoints';
import HeadingText, { FONT_SIZE } from '@components/HeadingText';
import Loading, { LOADING_TYPE } from '@containers/loading';
import ErrorScreen from '@components/Error';
import {
  TabsContainer,
  TabItem,
  ScrollabelWrapper,
  TabPanelBox,
  OverallSubTextWithIcon,
  NextStepsWrapper,
} from '@containers/summary/style';
import routes from '@routes';

import SummaryElement from '@containers/summary/SummaryElement';
import OverallScore from '@containers/summary/OverallScore';
import DocAuthSection from '@containers/summary/DocAuthSection';
import IdInfoSection from '@containers/summary/IdInfoSection';
import ImagePreview from '@containers/summary/ImagePreview';
import Button from '@components/Button';
import RawJson from '@components/Modal/modalContents/RawJson';

const scrollTo = ev => {
  document
    .querySelector(`[data-panel-name="${ev.target.dataset.tabName}-panel"`)
    .scrollIntoView({ behavior: 'smooth' });
};

const Summary = ({
  routerStore,
  modalStore,
  summaryStore: {
    isLoading,
    summary,
    initSummary,
    error,
    reset,
    proofDownloadURL,
    onFido,
    selfieImageURL,
    overallScore,
    selfie,
    idDocument,
    identityInformationStatus,
  },
}) => {
  const history = useHistory();
  const windowSize = useWindowSize();
  const docAuthRef = useRef(null);
  const [docExpanded, setDocExpanded] = useState(false);
  const selfieRef = useRef(null);
  const [selfieExpanded, setSelfieExpanded] = useState(false);
  const idInfoRef = useRef(null);
  const [idInfoExpanded, setIdInfoExpanded] = useState(false);
  const overallRef = useRef(null);
  const wrapperRef = useRef(null);

  const setActive = useCallback(
    debounce(() => {
      if (
        wrapperRef.current &&
        docAuthRef.current &&
        selfieRef.current &&
        idInfoRef.current &&
        overallRef.current
      ) {
        const OFFSET = -100;

        const elements = document.querySelectorAll(`.tab`);
        elements.forEach(el => el.classList.remove('active-tab'));
        if (
          overallRef.current.offsetTop <=
          wrapperRef.current.scrollTop - OFFSET
        ) {
          document
            .querySelector(`[data-tab-name="overall"]`)
            .classList.add('active-tab');
          return;
        }

        if (
          idInfoRef.current.offsetTop <=
          wrapperRef.current.scrollTop - OFFSET
        ) {
          document
            .querySelector(`[data-tab-name="id-info"]`)
            .classList.add('active-tab');
          return;
        }

        if (
          selfieRef.current.offsetTop <=
          wrapperRef.current.scrollTop - OFFSET
        ) {
          document
            .querySelector(`[data-tab-name="selfie"]`)
            .classList.add('active-tab');
          return;
        }

        if (
          docAuthRef.current.offsetTop <=
          wrapperRef.current.scrollTop - OFFSET
        ) {
          document
            .querySelector(`[data-tab-name="doc-auth"]`)
            .classList.add('active-tab');
        }
      }
    }, 100),
  );

  useEffect(() => {
    setActive();
  }, [wrapperRef, docAuthRef, selfieRef, idInfoRef, overallRef]);

  useEffect(() => {
    const init = async () => {
      await initSummary();
    };

    init();

    return () => {
      reset();
    };
  }, []);

  if (error) {
    return (
      <ErrorScreen
        error={error}
        buttonAction={() => history.push(routes.root)}
      />
    );
  }

  if (isLoading || !Object.keys(summary).length) {
    return <Loading type={LOADING_TYPE.AUTH} onFido={onFido} />;
  }

  return (
    <Layout
      noFillHeight
      type={
        size.md < windowSize.width ? HEADER_TYPES.LOCK : HEADER_TYPES.BUTTON
      }
      buttonCallback={() => routerStore.push(routes.root)}
    >
      <TabsContainer>
        <TabItem
          className="tab active-tab"
          data-tab-name="doc-auth"
          onClick={scrollTo}
        >
          <FormattedMessage id="summary.tabs.doc_auth" />
        </TabItem>
        <TabItem className="tab" data-tab-name="selfie" onClick={scrollTo}>
          <FormattedMessage id="summary.tabs.selfie" />
        </TabItem>
        <TabItem className="tab" data-tab-name="id-info" onClick={scrollTo}>
          <FormattedMessage id="summary.tabs.id_info" />
        </TabItem>
        <TabItem className="tab" data-tab-name="overall" onClick={scrollTo}>
          <FormattedMessage id="summary.tabs.overall" />
        </TabItem>
      </TabsContainer>
      <ScrollabelWrapper ref={wrapperRef} onScroll={setActive}>
        {idDocument.evidenceStatus?.status !== 'PROCESSING' ? (
          <SummaryElement
            ref={docAuthRef}
            panelName="doc-auth-panel"
            headerIcon="/images/idCard.svg"
            headingMsg="summary.doc_auth"
            status={idDocument.evidenceStatus.status}
            expanded={docExpanded}
            onExpand={setDocExpanded}
          >
            <DocAuthSection />
          </SummaryElement>
        ) : null}
        <SummaryElement
          ref={selfieRef}
          panelName="selfie-panel"
          headerIcon="/images/livenessHigh.svg"
          headingMsg="summary.selfie"
          status={selfie.evidenceStatus.status}
          expanded={selfieExpanded}
          onExpand={setSelfieExpanded}
        >
          <ImagePreview img1={selfieImageURL} fullColor single />
        </SummaryElement>

        <SummaryElement
          ref={idInfoRef}
          panelName="id-info-panel"
          headerIcon="/images/data.svg"
          headingMsg="summary.id_info"
          status={
            idDocument.evidenceStatus?.status === 'ADJUDICATION'
              ? 'ADJUDICATION'
              : identityInformationStatus
          }
          expanded={idInfoExpanded}
          onExpand={setIdInfoExpanded}
        >
          <IdInfoSection />
        </SummaryElement>

        <TabPanelBox ref={overallRef} data-panel-name="overall-panel">
          <OverallScore grade={overallScore} />
        </TabPanelBox>
        <TabPanelBox>
          <NextStepsWrapper>
            <HeadingText mt="12px" fontsize={FONT_SIZE.NORMAL}>
              <FormattedMessage id="summary.next_steps" />
            </HeadingText>
            <OverallSubTextWithIcon>
              <FormattedMessage id="summary.next_steps_more" />
            </OverallSubTextWithIcon>
            <Button
              as="a"
              onClick={() =>
                modalStore.showModal(
                  <RawJson data={JSON.stringify(summary)} />,
                  'modal.raw_json',
                )
              }
              fullwidth
              outlined
            >
              <FormattedMessage id="summary.next_steps_json" />
            </Button>

            <Button as="a" href={proofDownloadURL} fullwidth outlined>
              <FormattedMessage id="summary.download_proof" />
            </Button>
            <Button as={NavLink} to={routes.root} fullwidth outlined>
              <FormattedMessage id="summary.next_steps_end" />
            </Button>
          </NextStepsWrapper>
        </TabPanelBox>
      </ScrollabelWrapper>
    </Layout>
  );
};

export default inject(
  'routerStore',
  'modalStore',
  'summaryStore',
)(observer(Summary));
