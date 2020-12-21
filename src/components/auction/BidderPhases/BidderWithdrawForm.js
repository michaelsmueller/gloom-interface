import React from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset, FieldsetTitle, Label, Input } from 'styles/formStyles';
import { Button } from 'styles/buttonStyles';

export default function BidderWithdrawForm({ bidderDeposit, onSubmit }) {
  const { handleSubmit } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <FieldsetTitle>Bidder deposit</FieldsetTitle>
        <Label htmlFor='amount'>
          <div>Amount (ETH):</div>
          <Input type='number' value={bidderDeposit} id='bidder-deposit' name='bidderDeposit' readOnly />
        </Label>
      </Fieldset>
      <Button type='submit'>Withdraw deposit</Button>
    </form>
  );
}
