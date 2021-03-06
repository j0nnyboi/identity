/// <reference types="node" />
import { AccountInfo, PublicKey } from "@safecoin/web3.js";
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare enum State {
    ACTIVE = "ACTIVE",
    REVOKED = "REVOKED",
    FROZEN = "FROZEN"
}
export declare class GatewayToken {
    readonly issuingGatekeeper: PublicKey;
    readonly gatekeeperNetwork: PublicKey;
    readonly owner: PublicKey;
    readonly state: State;
    readonly publicKey: PublicKey;
    readonly programId: PublicKey;
    readonly expiryTime?: number | undefined;
    constructor(issuingGatekeeper: PublicKey, gatekeeperNetwork: PublicKey, owner: PublicKey, state: State, publicKey: PublicKey, programId: PublicKey, expiryTime?: number | undefined);
    isValid(): boolean;
    private hasExpired;
    static fromAccount(accountInfo: AccountInfo<Buffer>, key: PublicKey): GatewayToken;
    update({ state, expiryTime, }: {
        state: State;
        expiryTime?: number;
    }): GatewayToken;
}
export declare type ProgramAccountResponse = {
    pubkey: PublicKey;
    account: AccountInfo<Buffer>;
};
