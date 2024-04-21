'use client';

import React from 'react';
import Logo from '@src/assets/images/pokemon/001.png';
import { css } from '@emotion/react';
import { Form, Input } from '@src/components/ui';
import MainForm from '@src/components/MainForm';
import { DefaultValues } from 'react-hook-form';
import Image from 'next/image';

interface LoginField {
  email: string;
  password: string;
}

const defaultValues: DefaultValues<LoginField> = {
  email: '',
  password: '',
};

const Page = () => {
  return (
    <main
      className='relative flex flex-1 flex-col overflow-hidden px-4 py-8 sm:px-6 lg:px-8'
      css={css`
        background: aliceblue;
      `}
    >
      <div className='relative flex flex-1 flex-col items-center justify-center pb-16 pt-12'>
        <Image src={Logo.src} alt='Logo' width={80} height={80} />
        <h1 className='sr-only'>Log in to your Tailwind UI account</h1>
        <MainForm className='w-full max-w-sm' defaultValues={defaultValues}>
          <Form.FieldLabel title='Email address' />
          <Form.Field
            className='w-full mb-4'
            name='email'
            type='email'
            placeholder='Email address'
            component={Input}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              console.log('evt: ', evt.target.value)
            }
          />

          <Form.FieldLabel title='Password' />
          <Form.Field
            className='w-full mb-6'
            name='password'
            type='password'
            placeholder='Password'
            component={Input}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              console.log('evt: ', evt.target.value)
            }
          />

          <button className='inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full'>
            <span>Sign in to account</span>
          </button>
          <input type='hidden' name='remember' value='true' />
          <p className='mt-8 text-center'>
            <a href='/password/reset' className='text-sm hover:underline'>
              Forgot password?
            </a>
          </p>
        </MainForm>
      </div>
      <footer className='relative shrink-0'>
        <div className='space-y-4 text-sm text-gray-900 sm:flex sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0'>
          <p className='text-center sm:text-left'>
            Don&quot;t have an account?
          </p>
          <a
            className='inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 text-slate-900 ring-1 ring-slate-900/10 hover:ring-slate-900/20'
            href='/all-access'
          >
            <span>
              Get access <span aria-hidden='true'>→</span>
            </span>
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Page;
