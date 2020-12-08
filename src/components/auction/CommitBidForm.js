/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset, FieldsetTitle, Label, Input } from 'styles/formStyles';
import Button from 'styles/buttonStyles';
import { getPasswordStrength } from 'utils/validate';

export default function CommitBidForm({ bidderDeposit, onSubmit }) {
  const { register, handleSubmit, watch, errors } = useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const password = useRef({});
  password.current = watch('password', '');
  console.log('BidderInvites form errors', errors);

  const handleChange = ({ target }) => {
    setPasswordStrength(getPasswordStrength(target.value));
  };

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
          <Input type='number' step='0.001' min='0' id='bid' name='bid' ref={register} />
        </Label>
      </Fieldset>

      <Fieldset>
        <FieldsetTitle>Password</FieldsetTitle>
        <Label htmlFor='password'>
          Password:
          <Input
            type='password'
            id='password'
            name='password'
            onChange={handleChange}
            ref={register({
              required: 'You must specify a password',
              validate: value => getPasswordStrength(value) > 2 || 'Password is too weak',
            })}
          />
          <pre>strength: {passwordStrength}</pre>
          {errors.password && <em>{errors.password.message}</em>}
        </Label>
        <Label htmlFor='salt'>
          Repeat password:
          <Input
            type='password'
            id='password_repeat'
            name='passwordRepeat'
            ref={register({ validate: value => value === password.current || "Passwords don't match" })}
          />
          {errors.passwordRepeat && <em>{errors.passwordRepeat.message}</em>}
        </Label>
      </Fieldset>

      <Button type='submit'>Commit bid</Button>
    </form>
  );
}
