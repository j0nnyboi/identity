/// <reference types="node" />
import { PublicKey } from "@safecoin/web3.js";
import { Assignable, Enum } from "./solanaBorsh";
import { AssignablePublicKey } from "./AssignablePublicKey";
import BN from "bn.js";
/**
 * The on-chain structure of a gateway token.
 * Matches: solana/integration-lib/src/state.rs
 *
 * The pattern for these objects is to have their properties dynamically
 * assigned by borsh.decode, as opposed to via a constructor.
 *
 * The imperative assignment operator (!) is used to avoid Typescript
 * complaining about the above.
 */
export declare class GatewayTokenData extends Assignable {
    owner: AssignablePublicKey;
    issuingGatekeeper: AssignablePublicKey;
    gatekeeperNetwork: AssignablePublicKey;
    state: GatewayTokenState;
    expiry?: BN;
    static fromAccount(accountData: Buffer): GatewayTokenData;
    forAuthority(authority: PublicKey): GatewayTokenData;
    static empty(owner?: PublicKey): GatewayTokenData;
}
export declare class Active extends Assignable {
}
export declare class Frozen extends Assignable {
}
export declare class Revoked extends Assignable {
}
export declare class GatewayTokenState extends Enum {
    active?: Active;
    frozen?: Frozen;
    revoked?: Revoked;
}
