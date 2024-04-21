/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { withProperties } from '@src/utils/type';
import { css } from '@emotion/react';
import Submit from '@src/components/ui/Button/Submit';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  inverted?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  as?: React.FC | string;
  onClick?: React.MouseEventHandler;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  as = 'button',
  ...props
}) => {
  const Btn = as as any;

  return (
    <Btn
      {...props}
      type={props.type || 'button'}
      css={css`
        :hover {
          opacity: 0.9;
        }
        :disabled {
          opacity: 0.7;
        }
      `}
      className={`inline-flex flex-row items-center justify-center cursor-pointer appearance-none outline-none whitespace-nowrap ${props.className}`}
    >
      {props.children}
    </Btn>
  );
};

export const BlueRounded: React.FC<ButtonProps> = ({
  inverted,
  className,
  children,
  ...props
}) => (
  <Button
    {...props}
    className={`hover:shadow-md ${className}`}
    css={css`
      border-radius: 9999px;
      color: ${inverted ? '#39A1B2' : '#fff'};
      background-color: ${inverted ? '#fff' : '#39A1B2'};
      padding: 0.5rem 1rem;
      min-height: 2.4rem;
      font-weight: 400;
    `}
  >
    {children}
  </Button>
);

export const WhiteRounded: React.FC<ButtonProps> = ({
  className,
  ...props
}) => (
  <BlueRounded
    inverted
    {...props}
    className={`border-2 border-color-white-button text-color-white-button ${className}`}
  />
);

export const Primary: React.FunctionComponent<
  ButtonProps & { primaryColor?: string }
> = ({ inverted, children, ...props }) => {
  // Todo get color from theme
  const color = props?.primaryColor;
  return (
    <BlueRounded
      {...props}
      css={css`
        color: ${inverted ? color : '#fff'};
        background-color: ${inverted ? '#fff' : color};
      `}
    >
      {children}
    </BlueRounded>
  );
};

export default withProperties(Button, {
  BlueRounded,
  WhiteRounded,
  Primary,
  Submit,
});
