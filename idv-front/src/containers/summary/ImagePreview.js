import React from 'react';
import PropTypes from 'prop-types';
import {
  ImagePreviewWrapper,
  ImagePreviewElement,
} from '@containers/summary/style';

const ImagePreview = ({ img1, img2, single, fullColor }) => {
  return (
    <ImagePreviewWrapper>
      <ImagePreviewElement
        blackAndWhite={fullColor ? 0 : 1}
        src={img1}
        alt="First captured image preview"
        single={single ? 1 : 0}
      />
      {!single && img2 ? (
        <ImagePreviewElement src={img2} alt="Second captured image preview" />
      ) : null}
    </ImagePreviewWrapper>
  );
};

ImagePreview.defaultProps = {
  single: false,
  img2: null,
  fullColor: false,
};

ImagePreview.propTypes = {
  img1: PropTypes.any.isRequired,
  img2: (props, propName, componentName) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (!props.single && !props[propName]) {
      return new Error(`Missing prop ${propName} inside ${componentName}.`);
    }

    return null;
  },
  single: PropTypes.bool,
  fullColor: PropTypes.bool,
};

export default ImagePreview;
