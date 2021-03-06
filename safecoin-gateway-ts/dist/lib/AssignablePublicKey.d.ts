import { Assignable } from "./solanaBorsh";
import { PublicKey } from "@safecoin/web3.js";
/**
 * A Borsh-compatible public key object
 *
 * The pattern for these objects is to have their properties dynamically
 * assigned by borsh.decode, as opposed to via a constructor.
 *
 * The imperative assignment operator (!) is used to avoid Typescript
 * complaining about the above.
 */
export declare class AssignablePublicKey extends Assignable {
    bytes: number[];
    toPublicKey(): PublicKey;
    toString(): string;
    static parse(pubkey: string): AssignablePublicKey;
    static fromPublicKey(publicKey: PublicKey): AssignablePublicKey;
    static empty(): AssignablePublicKey;
}
