/// <reference types="node" />
import { Keypair, PublicKey } from '@safecoin/web3.js';
import { Config, SignCallback } from './utilities';
export { SignCallback, Config, DEFAULT_CONFIG } from './utilities';
export declare const prove: (key: PublicKey | Keypair, signer?: SignCallback | undefined, config?: Config) => Promise<Buffer>;
export declare const verifyStatic: (evidence: Buffer, publicKey: PublicKey) => void;
export declare const verify: (evidence: Buffer, publicKey: PublicKey, config?: Config) => Promise<void>;
