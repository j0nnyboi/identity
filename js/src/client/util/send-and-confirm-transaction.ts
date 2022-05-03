import { sendAndConfirmTransaction as realSendAndConfirmTransaction } from '@safecoin/web3.js';
import {
  Account,
  Connection,
  Transaction,
  TransactionSignature,
} from '@safecoin/web3.js';

export function sendAndConfirmTransaction(
  title: string,
  connection: Connection,
  transaction: Transaction,
  ...signers: Array<Account>
): Promise<TransactionSignature> {
  console.log('Sending transaction ' + title);
  return realSendAndConfirmTransaction(connection, transaction, signers, {
    skipPreflight: false,
    commitment: 'recent',
    preflightCommitment: 'recent',
  });
}
