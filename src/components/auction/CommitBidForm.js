/* eslint-disable no-console */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset, FieldsetTitle, Label, Input } from 'styles/formStyles';
import Button from 'styles/buttonStyles';

export default function CommitBidForm({ bidderDeposit, onSubmit }) {
  const { register, handleSubmit, errors } = useForm();
  console.log('BidderInvites form errors', errors);

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

      <Button type='submit'>Commit bid</Button>
    </form>
  );
}
