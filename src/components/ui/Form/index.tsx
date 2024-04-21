/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */

import styled from '@emotion/styled';
import { withProperties } from '@src/utils/type';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import {
  Controller,
  FormProvider,
  FormState,
  useForm,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import * as yup from 'yup';

// import tw from 'twin.macro';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import Button from '../Button';
import useDebouncedCallback from '@src/hooks/useDebouncedCallback';
import DirtyFormContext from '@src/components/Router/DirtyFormContext';

yup.setLocale({
  mixed: {
    default: 'This field is invalid.',
    required: 'This field is required.',
  },
  string: {
    email: 'Please provide a valid email address.',
    url: 'Please provide a valid URL.',
  },
});
enum SubmitMode {
  onSubmitButton = 'onSubmitButton',
  onChangeDebounced = 'onChangeDebounced',
}

type Value = string | number | boolean | DefaultValues;
interface DefaultValues {
  [key: string]: Value | Value[];
}

export interface FormProps {
  className?: string;
  children?: any;
  /**  Specify when onSubmit is called. */
  submitMode?: SubmitMode;
  onSubmit?: (
    values: any,
    defaultValues?: any,
    formState?: FormState<any>,
    formHandlers?: UseFormReturn<any>
  ) => any;
  validationSchema?: yup.Lazy<any> | yup.ObjectSchema<any>;
  defaultValues?: any;
  mode?: 'onBlur' | 'onSubmit' | 'onChange' | undefined;
  showUnsavedChangesDialog?: boolean;
}

interface FieldLabelProps {
  title: any;
  className?: string;
}

interface FormComponent extends React.FC<FormProps> {
  Field: any;
  FieldLabel: React.FC<FieldLabelProps>;
  ErrorMessage: React.FunctionComponent<any>;
  Status: React.FunctionComponent<any>;
}

interface Errors {
  [key: string]: string;
}

interface FormOptions {
  submitMode?: SubmitMode;
  onSubmit?: (
    values: any,
    defaultValues?: any,
    formState?: FormState<any>,
    formHandlers?: UseFormReturn<any>
  ) => any;
  formId: string;
  imageUpload: { [key: string]: boolean };
  setImageUpload: React.Dispatch<{ [key: string]: any }>;
}

export const FormOptionsContext = React.createContext<FormOptions | any>({});

const Form: FormComponent = ({
  mode = 'onSubmit',
  validationSchema,
  submitMode = SubmitMode.onSubmitButton,
  defaultValues = {},
  showUnsavedChangesDialog,
  ...props
}: FormProps) => {
  const formHandlers = useForm<any>({
    mode,
    resolver: yupResolver(validationSchema!),
    defaultValues,
  });
  React.useEffect(() => {
    // Don't reset if dirty
    // The reality is this should only reset if any of the fields this form cares
    // about have changed - not any field in defaultValues

    if (defaultValues && !formHandlers.formState.isDirty) {
      formHandlers.reset(defaultValues);
    }
  }, [formHandlers.reset, JSON.stringify(defaultValues)]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // this part is for stopping parent forms to trigger their submit
    if (event) {
      // sometimes not true, e.g. React Native
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (typeof event.stopPropagation === 'function') {
        // prevent any outer forms from receiving the event too
        event.stopPropagation();
      }
    }
    return formHandlers.handleSubmit(async (values) => {
      // const values = formHandlers.getValues({ nest: true })
      try {
        // values && formHandlers.reset(flatObject(values))
        props.onSubmit &&
          (await props.onSubmit(
            values,
            defaultValues,
            formHandlers.formState,
            formHandlers
          ));
        const formValues = formHandlers.getValues();
        formHandlers.reset(formValues);
      } catch (e: any) {
        console.info('SUBMIT ERROR: ', typeof e, ' >', e, '<');
        if (e instanceof SubmitError && e.errors) {
          Object.keys(e.errors).map((name) => formHandlers.setError(name, e));
        } else {
          formHandlers.setError('_', e, e.toString());
        }
      }
    })(event);
  };

  // create state for uploading image
  const [imageUpload, setImageUpload] = React.useState({});

  const formRef = React.useRef<HTMLFormElement>(null);
  const [formId] = React.useId();

  // read dirty form context
  const { forms, setForms } = React.useContext(DirtyFormContext);

  // update dirty form context when dirty state changes
  React.useEffect(() => {
    if (showUnsavedChangesDialog) {
      // update dirty state in context
      setForms({
        ...forms,
        [formId]: {
          dirty: formHandlers.formState.isDirty,
          isSubmitting: formHandlers.formState.isSubmitting,
          submit: onSubmit,
          reset: formHandlers.reset,
          triggerValidation: formHandlers.trigger,
        },
      });
    }

    // form unmount
    return () => {
      const newState = { ...forms };
      delete newState[formId];
      setForms(newState);
    };
  }, [formHandlers.formState.isDirty, formHandlers.formState.isSubmitting]);

  return (
    <FormOptionsContext.Provider
      value={{ submitMode, onSubmit, formId, imageUpload, setImageUpload }}
    >
      <FormProvider {...formHandlers}>
        <form {...props} id={formId} onSubmit={onSubmit} ref={formRef}>
          {props.children}
        </form>
      </FormProvider>
    </FormOptionsContext.Provider>
  );
};

export class SubmitError extends Error {
  errors: Errors;

  constructor(errors: Errors) {
    super('SubmitError');
    this.name = 'SubmitError'; // (2)
    this.errors = errors;
  }
}

Form.FieldLabel = ({ title, className }) => (
  <label
    className={`block text-sm font-semibold leading-6 text-gray-900 ${className}`}
  >
    {title}
  </label>
);

interface FieldProps {
  name: string;
  component: any;
  errors: any;
  onChange?: any;
  className?: string;
  type?: string;
}

Form.Field = styled(
  ({ name, className, component, errors, ...props }: FieldProps) => {
    const { formState } = useFormContext();
    const contextErrors = formState.errors;

    return (
      <div className={`flex flex-col ${className}`}>
        <Form.Field.Input
          {...props}
          name={name}
          component={component}
          onChange={props.onChange}
        />
        {props.type !== 'hidden' && (
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }: any) => {
              message = message || contextErrors[name]?.message || '';

              return <p className='error-message'>{message}</p>;
            }}
          />
        )}
      </div>
    );
  }
)``;

Form.Field.Input = styled(
  ({ name, component: Component, inputRef, ...props }: any) => {
    const { onSubmit, submitMode } = React.useContext(FormOptionsContext);
    const formHandlers = useFormContext();

    const onSubmitDebounced = useDebouncedCallback(async () => {
      // const values = formHandlers.getValues({ nest: true })
      submitMode === SubmitMode.onChangeDebounced && (await onSubmit());
    });

    const { control } = formHandlers;

    return (
      <Controller
        {...(inputRef ? { inputRef } : {})}
        name={name}
        control={control}
        render={({ field }) => (
          <Component
            {...field}
            {...props}
            onChange={(evt: any[]) => {
              onSubmitDebounced();
              field.onChange(evt);
              props?.onChange(evt);
            }}
          />
        )}
      />
    );
  }
)``;

interface SubmitButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  dirtyText?: string;
  cleanText?: string;
  children?: any;
  containerId?: string;
  className?: string;
  disabled?: boolean;
  hideOnClean?: boolean;
  button?: FunctionComponent;
  submitting?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  containerId,
  hideOnClean,
  submitting,
  ...props
}) => {
  const { formState } = useFormContext();
  const { formId, imageUpload } = React.useContext(FormOptionsContext);

  // is there any image uploading
  const isImageUploading =
    imageUpload && Object.values(imageUpload).includes(true);

  const { isSubmitting, isDirty, isValid, isSubmitted } = formState;

  if (!isDirty && hideOnClean) {
    return null;
  }

  const disabled =
    props.disabled ||
    isSubmitting ||
    (!isDirty && !isValid && isSubmitted) ||
    isImageUploading;

  const hasErrors = !isDirty && !isValid && isSubmitted && !isSubmitting;

  const children = (
    <Button.Submit
      dirty={isDirty}
      submitting={isSubmitting || !!submitting}
      disabled={disabled}
      formId={formId}
      {...props}
      className={`${hasErrors ? 'bg-color-error' : ''} ${props.className}`}
    />
  );

  if (containerId) {
    const el = document.getElementById(containerId);

    return el ? ReactDOM.createPortal(children, el) : null;
  } else {
    return children;
  }
};

interface FormErrorMessageProps {
  className?: string;
  message?: string;
}

Form.ErrorMessage = ({
  className,
  message = 'Please check required fields and errors in this form.',
}: FormErrorMessageProps) => {
  const { formState } = useFormContext();
  const { errors } = formState;

  let errorMessage = '';
  // Todo get error message
  if (Object.entries(errors).length > 0) {
    errorMessage = errors.root?.message ? errors.root.message : message;
  }

  if (!errorMessage || errorMessage.length === 0) {
    return null;
  }

  return (
    <div
      className={className}
      // css={css`
      //   ${tw`text-color-error my-2 mx-2`}
      // `}
    >
      {errorMessage}
    </div>
  );
};

Form.Status = (props: { className?: string }) => {
  // const { formState } = useFormContext();
  // const { isSubmitted, isDirty, isValid } = formState;
  // const isSaved = !isDirty && isSubmitted && isValid;

  return (
    <div
      // css={css`
      //   ${!isSaved && tw`opacity-0`}
      // `}
      className={`flex items-center bg-blue-1 text-blue-3 rounded-full py-2 px-3 transition-color duration-500 ${props.className}`}
    >
      {/*<img*/}
      {/*  alt='check'*/}
      {/*  className='pr-2 h-6'*/}
      {/*  src={require('@src/images/check.svg').default}*/}
      {/*/>*/}
      Changes saved!
    </div>
  );
};

export default withProperties(Form, { SubmitMode, SubmitButton });
