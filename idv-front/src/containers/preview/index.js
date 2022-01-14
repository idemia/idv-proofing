/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { HEADER_TYPES } from '@components/Header/style';
import Content from '@components/Content';
import Text from '@components/HeadingText';
import Button from '@components/Button';

import DoubleButtonWrapper from '@components/DoubleButtonWrapper';
import Layout from '@components/Layout';
import Loader, { SIZE } from '@components/Loader';
import routes from '@routes';

import * as Styled from '@containers/preview/style';
import routerStore from '@stores/routerStore';

const SHOW_CAPTURE_OUTLINES = true;

const ImagePreview = ({ image, corners }) => {
  const imageRef = useRef(null);
  const outlineRef = useRef(null);
  const outlineSvgRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [rotatedHeight, setRotatedHeight] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [ratio, setRatio] = useState(0);

  const handleImageLoad = () => {
    const { current: imageElement } = imageRef;
    setOriginalHeight(imageElement.offsetHeight);

    if (!SHOW_CAPTURE_OUTLINES) {
      return;
    }

    if (!corners) {
      return;
    }

    const { current: outline } = outlineRef;
    const { current: svg } = outlineSvgRef;

    svg.style.width = imageElement.offsetWidth;
    svg.style.height = imageElement.offsetHeight;

    const calculatedRatio =
      imageElement.offsetWidth / imageElement.offsetHeight;

    setRatio(calculatedRatio);
    setRotatedHeight(imageElement.offsetWidth * calculatedRatio);

    const coefW = imageElement.offsetWidth / imageElement.naturalWidth;
    const coefH = imageElement.offsetHeight / imageElement.naturalHeight;
    const points = corners
      .map((p) => `${p[0] * coefW},${p[1] * coefH}`)
      .join(' ');
    outline.setAttribute('points', points);
  };

  const handleRotation = async () => {
    const newRotation = rotation + 90 === 360 ? 0 : rotation + 90;
    setRotation(newRotation);
    handleImageLoad();
  };

  useEffect(() => {
    // listen for screen orientation change
    window.addEventListener('resize', handleImageLoad);
    return () => window.removeEventListener('resize', handleImageLoad);
  }, [handleImageLoad]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = `data:image/jpeg;base64, ${image}`;
    }
    // rotateOutline();
    setIsRotating(false);
  }, [imageRef, image]);

  return (
    <div>
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
          rotation === 90 || rotation === 270 ? rotatedHeight : originalHeight
        }
      >
        <Styled.TakenImageWrapper rotation={rotation} ratio={ratio}>
          {isRotating && <Loader cover size={SIZE.SMALL} />}
          {SHOW_CAPTURE_OUTLINES && (
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
    </div>
  );
};

const Preview = ({
  applicationStore: {
    checkBrowserCompatibilityBeforeRender,
    wizardStepCount,
    currentWizardStep,
    getNextRoute,
  },
  documentStore: { initSession },
  documentCameraStore: { retakePhoto, doc },
}) => {
  useEffect(() => {
    const init = async () => {
      const isDeviceCompatible = await checkBrowserCompatibilityBeforeRender();
      if (isDeviceCompatible) {
        await initSession();
      }
    };

    init();
  }, []);

  const nextStep = () => {
    getNextRoute();
    routerStore.push(routes.livenessInstructions);
  };

  useEffect(() => {
    // If doc captures are not available, retake photo
    if (!doc) {
      retakePhoto();
    }
  }, [doc]);

  if (!doc) {
    return null;
  }

  const { captures, status } = doc;

  if (status !== 'DONE') {
    return (
      <Layout
        noFillHeight
        type={HEADER_TYPES.STEPS}
        activeStep={currentWizardStep + 1}
        stepCount={wizardStepCount}
      >
        <>
          <Content noPaddingBottom>
            <Text>
              <FormattedMessage id={`preview.verif_status.${status}`} />
            </Text>
          </Content>
        </>
      </Layout>
    );
  }

  return (
    <Layout
      noFillHeight
      type={HEADER_TYPES.STEPS}
      activeStep={currentWizardStep + 1}
      stepCount={wizardStepCount}
    >
      <Content>
        <DoubleButtonWrapper>
          <Button onClick={retakePhoto} outlined fullwidth>
            <FormattedMessage id="preview.retake" />
          </Button>
          {status !== 'TIMEOUT' && (
            <Button onClick={nextStep} fullwidth>
              <FormattedMessage id="instructions.continue" />
            </Button>
          )}
        </DoubleButtonWrapper>
      </Content>

      {captures.map((capture) => (
        <div key={capture.id}>
          {capture?.image && <ImagePreview image={capture.image} />}
        </div>
      ))}
    </Layout>
  );
};

export default inject(
  'applicationStore',
  'documentStore',
  'documentCameraStore',
  'applicationStore',
)(observer(Preview));
