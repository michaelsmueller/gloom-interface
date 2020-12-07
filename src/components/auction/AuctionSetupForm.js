/* eslint-disable no-console */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset, FieldsetTitle, Label, Input, Select } from 'styles/formStyles';
import Button from 'styles/buttonStyles';
import tokenList from 'data/tokenList.json';

export default function AuctionSetupForm({ onSubmit }) {
  const { register, handleSubmit, errors } = useForm();
  console.log('tokenList', tokenList);
  console.log('AuctionSetup form errors', errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <FieldsetTitle>Asset to auction</FieldsetTitle>
        <Label htmlFor='amount'>
          Amount (tokens):
          <Input type='number' step='0.001' min='0' id='amount' name='amount' ref={register} />
        </Label>
        <Label htmlFor='token'>
          ERC-20 token:
          <Select id='token' name='token' ref={register}>
            {tokenList.map(token => (
              <option key={token.symbol} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </Select>
        </Label>
      </Fieldset>

      <Fieldset>
        <FieldsetTitle>Auction period</FieldsetTitle>
        <Label htmlFor='start-date'>
          Start date & time:
          <Input type='datetime-local' id='start-date' name='startDate' ref={register} />
        </Label>
        <Label htmlFor='end-date'>
          End date & time:
          <Input type='datetime-local' id='end-date' name='endDate' ref={register} />
        </Label>
      </Fieldset>

      <Button type='submit'>Set up auction</Button>
    </form>
  );
}
