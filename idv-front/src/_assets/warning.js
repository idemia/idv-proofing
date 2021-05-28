/* eslint-disable */
import React from 'react';

const Warning = ({ fill, height, width, ...props }) => (
  <svg
    width={width || '24'}
    height={height || '24'}
    viewBox="0 0 24 24"
    {...props}
  >
    <g fill="none" fillRule="evenodd">
      <g>
        <g>
          <g transform="translate(-97 -238) translate(97 234) translate(0 4)">
            <circle cx="12" cy="12" r="12" fill={fill || '#D6BE00'} />
            <path
              fill="#FFF"
              d="M10.88 7.68h1.935v5.76H10.88V7.68zm0 7.672c0-.268.094-.493.282-.674.188-.18.417-.27.686-.27.268 0 .497.09.685.27.188.18.282.406.282.674 0 .27-.094.498-.282.686-.188.188-.417.282-.685.282-.27 0-.498-.094-.686-.282-.188-.188-.282-.417-.282-.686z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default Warning;
