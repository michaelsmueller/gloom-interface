/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset, FieldsetTitle, Label, Input } from 'styles/formStyles';
import Button from 'styles/buttonStyles';

export default function RevealBidForm({ bidderDeposit, onSubmit }) {
  const { register, handleSubmit, watch, errors } = useForm();
  const [passwordShown, setPasswordShown] = useState(false);
  const password = useRef({});
  password.current = watch('password', '');
  console.log('BidderInvites form errors', errors);

  const togglePasswordVisiblity = () => setPasswordShown(!passwordShown);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <FieldsetTitle>Bidder deposit</FieldsetTitle>
        <Label htmlFor='bidder-deposit'>
          Amount (ETH):
          <Input type='number' value={bidderDeposit} id='bidder-deposit' name='bidderDeposit' readOnly />
        </Label>
      </Fieldset>

      <Fieldset>
        <FieldsetTitle>Confirm bid</FieldsetTitle>
        <Label htmlFor='bid'>
          Amount (ETH):
          <Input
            type='number'
            step='0.001'
            min='0'
            id='bid'
            name='bid'
            ref={register({ required: 'You must specify your bid' })}
          />
          {errors.bid && <p>{errors.bid.message}</p>}
        </Label>
      </Fieldset>

      <Fieldset>
        <FieldsetTitle>Confirm password</FieldsetTitle>
        <Label htmlFor='password'>
          Password:
          <Input
            type={passwordShown ? 'text' : 'password'}
            id='password'
            name='password'
            ref={register({ required: 'You must specify your password' })}
          />
          <i
            role='button'
            onClick={togglePasswordVisiblity}
            onKeyDown={togglePasswordVisiblity}
            tabIndex={0}
            className='material-icons-round'
          >
            visibility
          </i>
          {errors.password && <p>{errors.password.message}</p>}
        </Label>
      </Fieldset>
      <Button type='submit'>Reveal bid</Button>
    </form>
  );
}
