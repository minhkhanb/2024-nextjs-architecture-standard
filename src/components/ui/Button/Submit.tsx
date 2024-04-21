import React from 'react';
import { css } from '@emotion/react';
import Button from '@src/components/ui/Button/index';
import { Spinner } from '@src/components/Icons';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  submitting: boolean;
  dirty?: boolean;
  dirtyText?: string;
  cleanText?: string;
  hideOnClean?: boolean;
  formId?: string;
  inverted?: boolean;
  button?: React.FC;
}

const Submit: React.FunctionComponent<ButtonProps> = ({
  cleanText,
  dirtyText,
  hideOnClean,
  submitting,
  dirty,
  disabled,
  formId,
  button = Button.BlueRounded,
  ...props
}) => {
  const cleanTxt = cleanText || props.children || 'Close';
  const dirtyTxt = dirtyText || props.children || 'Save';

  let holdSpace = dirtyTxt;
  if (
    ((cleanTxt as string)?.length ?? 0) > ((dirtyTxt as string)?.length ?? 0)
  ) {
    holdSpace = cleanTxt;
  }

  const Btn = button;

  return (
    <Btn
      {...props}
      css={css`
        min-width: 8rem;
        white-space: nowrap;
        padding-right: 1rem;
        padding-left: 1rem;
        visibility: ${hideOnClean && !dirty && !submitting ? 'hidden' : ''};
        & div {
          top: -1px;
          position: relative;
        }
        &:disabled {
          cursor: auto;
        }
      `}
      className={`duration-200 transition-all flex-col relative ${props.className}`}
      type='submit'
      form={formId}
      disabled={disabled || submitting}
    >
      <>
        {
          <div
            className={`inline-flex m-auto ${!submitting && !dirty ? '' : 'hidden'}`}
            css={css`
              position: relative;
              height: 0;
            `}
          >
            {cleanTxt}
          </div>
        }
        {
          <div
            className={`inline-flex m-auto ${!submitting && dirty ? '' : 'hidden'}`}
            css={css`
              position: relative;
              height: 0;
            `}
          >
            {dirtyTxt}
          </div>
        }
        <Spinner
          alt='spinning'
          className={`spinner m-auto ${submitting ? 'visible' : 'invisible h-0'}`}
          css={css`
            position: absolute;
            height: 50%;
          `}
        />
        <div className='inline-flex invisible'>{holdSpace}</div>
      </>
    </Btn>
  );
};

export default Submit;
