/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset, FieldsetTitle, Label, Input } from 'styles/formStyles';
import Button from 'styles/buttonStyles';
import { getPasswordStrength } from 'utils/validate';

export default function CommitBidForm({ bidderDeposit, onSubmit }) {
  const { register, handleSubmit, watch, errors } = useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordShown, setPasswordShown] = useState(false);
  const password = useRef({});
  password.current = watch('password', '');
  console.log('BidderInvites form errors', errors);

  const handlePasswordChange = ({ target }) => {
    const strength = getPasswordStrength(target.value);
    setPasswordStrength(strength);
  };

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
        <FieldsetTitle>Bid</FieldsetTitle>
        <Label htmlFor='bid'>
          Amount (ETH):
          <Input
            type='number'
            step='0.001'
            min='0'
            id='bid'
            name='bid'
            ref={register({ required: 'You must specify a bid' })}
          />
          {errors.bid && <p>{errors.bid.message}</p>}
        </Label>
      </Fieldset>

      <Fieldset>
        <FieldsetTitle>Password</FieldsetTitle>
        <em>
          This password will be used to hide your bid. We will not store it, nor can it be recovered. If you lose this
          password, you will not be able to reveal your bid and you will lose your deposit.
        </em>
        <Label htmlFor='password'>
          Password:
          <Input
            type={passwordShown ? 'text' : 'password'}
            id='password'
            name='password'
            onChange={handlePasswordChange}
            ref={register({
              required: 'You must specify a password',
              validate: value => getPasswordStrength(value) > 2 || 'Password is too weak',
            })}
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
          <pre>strength: {passwordStrength}</pre>
          {errors.password && <p>{errors.password.message}</p>}
        </Label>
        <Label htmlFor='salt'>
          Repeat password:
          <Input
            type='password'
            id='password_repeat'
            name='passwordRepeat'
            ref={register({ validate: value => value === password.current || 'Passwords do not match' })}
          />
          {errors.passwordRepeat && <p>{errors.passwordRepeat.message}</p>}
        </Label>
      </Fieldset>

      <Button type='submit'>Commit bid</Button>
    </form>
  );
}
