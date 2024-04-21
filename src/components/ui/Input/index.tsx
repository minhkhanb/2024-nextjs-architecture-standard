/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { withProperties } from '@src/utils/type';
import { css } from '@emotion/react';

const Input = React.forwardRef<HTMLInputElement, any>(
  ({ className, ...props }, ref) => {
    props.name === 'email' && console.log('props: ', props, className);
    return (
      <input
        className={`
          w-full
          h-10
          px-2
          py-2
          rounded
          appearance-none
          block
          text-base
          border
          border-gray-500/50
          font-light
          text-input
          leading-tight
          outline-none
          focus:border-teal-500/50
          focus-visible:outline-none
          focus:shadow
      `}
        css={css`
          &::placeholder {
            opacity: 1;
          }
          &:disabled {
            opacity: 0.4;
          }
        `}
        ref={ref}
        {...props}
      />
    );
  }
);

export default withProperties(Input, {});
