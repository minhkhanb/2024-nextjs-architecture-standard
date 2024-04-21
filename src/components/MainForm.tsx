/* eslint-disable @typescript-eslint/no-explicit-any,  react-hooks/exhaustive-deps */

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Form, Input } from '@src/components/ui';
import { FormProps, SubmitError } from '@src/components/ui/Form';

interface Errors {
  [name: string]: string;
}

interface ValidationError {
  property: string;
  constraints: {
    [name: string]: string;
  };
}

function throwError(e: any): any {
  const error = e.graphQLErrors[0];

  if (!error) {
    throw new SubmitError({ _: e.message });
  }

  if (error.extensions?.exception?.validationErrors) {
    const errors = error.extensions.exception.validationErrors.reduce(
      (errors: Errors, validationError: ValidationError) => {
        const errorMessageKey = Object.keys(validationError.constraints)[0];
        const errorMessage =
          errorMessageKey && validationError.constraints[errorMessageKey];
        return {
          ...errors,
          [validationError.property]: errorMessage,
        };
      },
      {}
    );

    throw new SubmitError(errors);
  }

  if (error.message) {
    throw new SubmitError({
      _: error.message,
    });
  }
}

const useBeforeUnloadBrowserDialog = (dirty: boolean) => {
  const handleBeforeunload = (event: any) => {
    if (dirty) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  React.useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeunload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
    };
  }, [dirty]);
  return null;
};

const UnsavedChangesDialog: React.FC = () => {
  const formHandlers = useFormContext();
  const { formState } = formHandlers;
  const { isDirty } = formState;

  // on page change using browser
  useBeforeUnloadBrowserDialog(isDirty);

  return null;
};

const MainForm: React.FunctionComponent<FormProps> = ({
  showUnsavedChangesDialog,
  ...props
}) => (
  <Form
    {...props}
    showUnsavedChangesDialog={showUnsavedChangesDialog || false}
    onSubmit={async (values, defaultValues, formState, formHandlers) => {
      try {
        props.onSubmit &&
          (await props.onSubmit(
            values,
            defaultValues,
            formState,
            formHandlers
          ));
      } catch (e: any) {
        console.error('Apollo Form Error: ', e);

        if (e.name === 'SubmitError') {
          throw e;
        }

        // TODO: How do we show error if not e.graphQLErrors ?
        if (e.graphQLErrors) throwError(e);

        throw e;
      }
    }}
  >
    {showUnsavedChangesDialog && <UnsavedChangesDialog />}
    <Form.Field name='id' component={Input} type='hidden' className='hidden' />
    {props.children}
  </Form>
);

export default MainForm;
