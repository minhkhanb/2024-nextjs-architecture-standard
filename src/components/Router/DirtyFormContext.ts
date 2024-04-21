/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { UseFormTrigger } from 'react-hook-form/dist/types/form';

export interface DirtyFormStateInterface {
  dirty: boolean;
  isSubmitting: boolean;
  submit: any;
  reset: any;
  triggerValidation?: UseFormTrigger<any>;
}

interface DirtyForm {
  forms: { [key: string]: DirtyFormStateInterface };
  setForms: React.Dispatch<{ [key: string]: DirtyFormStateInterface }>;
}

const DirtyFormContext = React.createContext<DirtyForm>({
  forms: {},
  setForms: () => {},
});

export default DirtyFormContext;
