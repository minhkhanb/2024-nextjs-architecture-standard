/* eslint-disable @typescript-eslint/no-explicit-any */

import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';

const IconProps = (props: any): string => `
  color: inherit;
  ${props.spin ? 'animation: icon-loading 2s linear infinite;' : ''}
`;

const icon = (c: any, zoom?: number, css?: SerializedStyles) => {
  return styled(c)`
    height: 1rem;
    ${zoom ? `transform : scale(${zoom});` : ''}
    ${(props) => IconProps(props)}
    ${css}
  `;
};

// import { ReactComponent as spinner } from '@src/images/spinner.svg';
import spinner from '@src/assets/images/icons/spinner.svg';
export const Spinner = icon(
  spinner,
  1,
  css`
    animation: icon-loading 2s linear infinite;
  `
);
