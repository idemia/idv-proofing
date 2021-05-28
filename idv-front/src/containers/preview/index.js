import React, { useState, useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import map from 'lodash/map';
import { HEADER_TYPES } from '@components/Header/style';
import Content from '@components/Content';
import Text from '@components/HeadingText';
import Button from '@components/Button';

import DoubleButtonWrapper from '@components/DoubleButtonWrapper';
import Layout from '@components/Layout';
import Loader, { SIZE } from '@components/Loader';
import { mergeMethods } from '@utils/mergeMethods';
import PendingAuthorization from '@components/PendingAuthorization';
import { DOC_SIDES } from '@constants';

import * as Styled from '@containers/preview/style';
import {
  IdInfoContainer,
  IdInfoWrapper,
  IdInfoElement,
  IdInfoFieldTitle,
  IdInfoFieldData,
} from '@containers/summary/style';
import routerStore from '@stores/routerStore';

const CONFIG = {
  [DOC_SIDES.BACK]: {
    exampleImage: '/images/exampleBarCode.jpg',
  },
  [DOC_SIDES.FRONT]: {
    exampleImage: '/images/exampleFront.jpg',
  },
  [DOC_SIDES.INSIDE_PAGE]: {
    exampleImage: 'images/examplePassport.jpg',
  },
};

const Preview = ({
  applicationStore: {
    checkBrowserCompatibilityBeforeRender,
    getNextRoute,
    wizardStepCount,
    currentWizardStep,
  },
  documentStore: {
    getCurrentSideResults,
    initSession,
    getCapturedResults,
    fetchingCaptureResults,
    docType,
    showCapturedImageOutlines,
    setDocSide,
  },
  documentCameraStore: { retakePhoto },
}) => {
  const [captureResults, setCaptureResults] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [rotatedHeight, setRotatedHeight] = useState(0);
  const imageRef = useRef(null);
  const outlineRef = useRef(null);
  const outlineSvgRef = useRef(null);
  const imageWrapperRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const isDeviceCompatible = await checkBrowserCompatibilityBeforeRender();
      if (isDeviceCompatible) {
        await initSession();
        await getCapturedResults();
        setCaptureResults(getCurrentSideResults());
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = `data:image/jpeg;base64, ${captureResults?.image}`;
    }
    // rotateOutline();
    setIsRotating(false);
  }, [captureResults.image, imageRef]);

  const { documentInfo, identity } = mergeMethods(captureResults.rules || []);

  const handleRotation = async () => {
    const newRotation = rotation + 90 === 360 ? 0 : rotation + 90;
    setRotation(newRotation);
    handleImageLoad();
  };

  const nextStep = () => {
    routerStore.push(getNextRoute());
    setDocSide(currentWizardStep + 1);
  };

  const handleImageLoad = () => {
    if (showCapturedImageOutlines && captureResults.corners) {
      const { current: image } = imageRef;
      const { current: outline } = outlineRef;
      const { current: svg } = outlineSvgRef;
      const { corners } = captureResults;

      svg.style.width = image.offsetWidth;
      svg.style.height = image.offsetHeight;

      setOriginalHeight(image.offsetHeight);

      const calculatedRatio = image.offsetWidth / image.offsetHeight;

      setRatio(calculatedRatio);
      setRotatedHeight(image.offsetWidth * calculatedRatio);

      const coefW = image.offsetWidth / image.naturalWidth;
      const coefH = image.offsetHeight / image.naturalHeight;
      const points = corners
        .map(p => `${p[0] * coefW},${p[1] * coefH}`)
        .join(' ');
      outline.setAttribute('points', points);
    }
  };

  useEffect(() => {
    // listen for screen orientation change
    window.addEventListener('resize', handleImageLoad);
    return () => window.removeEventListener('resize', handleImageLoad);
  }, []);

  const renderSection = (section, first = false) => (
    <IdInfoContainer fullwidth={1} mt={first ? '0' : null}>
      <IdInfoWrapper>
        {map(section, (entry, key) => {
          if (typeof entry === 'string') {
            return (
              <IdInfoElement width="50%" noColumnMobile={1} key={key}>
                <IdInfoFieldTitle>
                  <FormattedMessage id={`document_fields.${key}`} />
                </IdInfoFieldTitle>
                <IdInfoFieldData>{entry}</IdInfoFieldData>
              </IdInfoElement>
            );
          }

          return null;
        })}
      </IdInfoWrapper>
    </IdInfoContainer>
  );

  if (fetchingCaptureResults || !captureResults)
    return (
      <Layout type={HEADER_TYPES.LOCK}>
        <PendingAuthorization />
      </Layout>
    );

  return (
    <Layout
      noFillHeight
      type={HEADER_TYPES.STEPS}
      activeStep={currentWizardStep + 1}
      stepCount={wizardStepCount}
    >
      {captureResults && captureResults.status === 'TIMEOUT' ? (
        <>
          <Content noPaddingBottom>
            <Text>
              <FormattedMessage
                id={`preview.header.${captureResults?.side?.name}`}
              />
            </Text>
            <Text>
              <FormattedMessage
                id={`preview.verif_status.${captureResults.status}`}
              />
            </Text>
          </Content>

          <Content centerHorizontal bottomDivider>
            <Styled.SmallText>
              <FormattedMessage id="preview.example" />
            </Styled.SmallText>
            <Styled.ExampleImage
              src={CONFIG[captureResults?.side?.name].exampleImage}
              alt="example-front"
            />
          </Content>
        </>
      ) : (
        <>
          <Content noPaddingBottom>
            <Text>
              <FormattedMessage
                id={`preview.extracted.${docType}.${captureResults?.side?.name}`}
              />
            </Text>
            <Styled.SmallText>
              <FormattedMessage id={`preview.incorrect.${docType}`} />
            </Styled.SmallText>
          </Content>
          <Content bottomDivider>
            {renderSection(documentInfo, true)}
            {renderSection(identity)}
          </Content>
        </>
      )}

      {captureResults?.image && (
        <Content>
          <Styled.BoxLine>
            <FormattedMessage id="preview.your_photo" />
            <Button
              outlined
              smaller
              icon="/images/rotate.png"
              onClick={handleRotation}
            >
              <FormattedMessage id="preview.rotate" />
            </Button>
          </Styled.BoxLine>

          <Styled.ImageRotationWrapper
            ref={imageWrapperRef}
            setHeight={
              rotation === 90 || rotation === 270
                ? rotatedHeight
                : originalHeight
            }
          >
            <Styled.TakenImageWrapper rotation={rotation} ratio={ratio}>
              {isRotating && <Loader cover size={SIZE.SMALL} />}
              {showCapturedImageOutlines && (
                <Styled.CapturedImageOutline ref={outlineSvgRef}>
                  <polygon
                    ref={outlineRef}
                    points="0,0"
                    stroke="#ac85df"
                    fill="rgba(67, 0, 153, 0.5)"
                    strokeLinejoin="round"
                    strokeWidth="10"
                  />
                </Styled.CapturedImageOutline>
              )}
              <Styled.TakenImage
                ref={imageRef}
                onLoad={handleImageLoad}
                alt="taken-image"
              />
            </Styled.TakenImageWrapper>
          </Styled.ImageRotationWrapper>
        </Content>
      )}

      <Content>
        <DoubleButtonWrapper>
          <Button onClick={retakePhoto} outlined fullwidth>
            <FormattedMessage id="preview.retake" />
          </Button>
          {captureResults?.status !== 'TIMEOUT' && (
            <Button onClick={nextStep} fullwidth>
              <FormattedMessage id="instructions.continue" />
            </Button>
          )}
        </DoubleButtonWrapper>
      </Content>
    </Layout>
  );
};

export default inject(
  'applicationStore',
  'documentStore',
  'documentCameraStore',
  'applicationStore',
)(observer(Preview));
