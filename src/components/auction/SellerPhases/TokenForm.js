import React from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset, FieldsetTitle, Label, Input, Select } from 'styles/formStyles';
import { Button } from 'styles/buttonStyles';
// import tokenList from 'data/tokenListLocalhost.json';

import MikeToken from 'contracts/MikeToken.json';

const tokenList = [
  {
    symbol: 'MIKE',
    name: 'Mike',
    address: MikeToken.networks[1337].address,
  },
];

export default function TokenForm({ onSubmit }) {
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

      <Button type='submit'>Set up auction</Button>
    </form>
  );
}
