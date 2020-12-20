import React from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset, FieldsetTitle, Label, Input, Select } from 'styles/formStyles';
import { Button } from 'styles/buttonStyles';
import tokenList from 'data/tokenListLocalhost.json';

export default function TokenAndDatesForm({ onSubmit }) {
  const { register, handleSubmit, errors } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <FieldsetTitle>Asset to auction</FieldsetTitle>
        <Label htmlFor='amount'>
          <div>Amount (tokens):</div>
          <Input
            type='number'
            step='1'
            min='0'
            id='amount'
            name='amount'
            ref={register({ required: 'You must specify an amount' })}
          />
          {errors.amount && <p>{errors.amount.message}</p>}
        </Label>
        <Label htmlFor='token'>
          <div>ERC-20 token:</div>
          <Select
            id='token'
            name='token'
            defaultValue='default'
            ref={register({ validate: value => value !== 'default' || 'You must select a token' })}
          >
            <option disabled value='default'>
              select a token
            </option>
            {tokenList.map(token => (
              <option key={token.symbol} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </Select>
          {errors.token && <p>{errors.token.message}</p>}
        </Label>
      </Fieldset>

      <Fieldset>
        <FieldsetTitle>Auction period</FieldsetTitle>
        <Label htmlFor='start-date'>
          <div>Start date & time:</div>
          <Input
            type='datetime-local'
            id='start-date'
            name='startDate'
            ref={register({ required: 'You must specify a start date & time' })}
          />
          {errors.startDate && <p>{errors.startDate.message}</p>}
        </Label>
        <Label htmlFor='end-date'>
          <div>End date & time:</div>
          <Input
            type='datetime-local'
            id='end-date'
            name='endDate'
            ref={register({ required: 'You must specify an end date & time' })}
          />
          {errors.endDate && <p>{errors.endDate.message}</p>}
        </Label>
      </Fieldset>

      <Button type='submit'>Set up auction</Button>
    </form>
  );
}
