import { Assignable, Enum } from "./solanaBorsh";
import { PublicKey, TransactionInstruction } from "@safecoin/web3.js";
import { GatewayTokenState } from "./GatewayTokenData";
/**
 * Creates instructions to send to the gateway program.
 *
 * Must match solana/program/src/instruction.rs
 */
declare class AddGatekeeper extends Assignable {
}
declare class IssueVanilla extends Assignable {
    seed?: Uint8Array;
    expireTime?: number;
}
declare class SetState extends Assignable {
    state: GatewayTokenState;
}
declare class UpdateExpiry extends Assignable {
    expireTime: number;
}
declare class RevokeGatekeeper extends Assignable {
}
export declare class GatewayInstruction extends Enum {
    addGatekeeper?: AddGatekeeper;
    issueVanilla?: IssueVanilla;
    setState?: SetState;
    updateExpiry?: UpdateExpiry;
    revokeGatekeeper?: RevokeGatekeeper;
    static addGatekeeper(): GatewayInstruction;
    static issueVanilla(seed?: Uint8Array, expireTime?: number): GatewayInstruction;
    static revoke(): GatewayInstruction;
    static freeze(): GatewayInstruction;
    static unfreeze(): GatewayInstruction;
    static updateExpiry(expireTime: number): GatewayInstruction;
    static revokeGatekeeper(): GatewayInstruction;
}
/**
 * Add a gatekeeper to a gatekeeper network.
 * Returns a Solana instruction that must be signed by the gatekeeper network authority.
 *
 * @param payer The payer of the transaction (used to pay rent into the gatekeeper account)
 * @param gatekeeperAccount An uninitialised gatekeeper account PDA. The address must be derived via getGatekeeperAccountKeyFromGatekeeperAuthority()
 * @param gatekeeperAuthority The gatekeeper to add to the network
 * @param network The gatekeeper network that the account is being added to.
 */
export declare function addGatekeeper(payer: PublicKey, gatekeeperAccount: PublicKey, gatekeeperAuthority: PublicKey, network: PublicKey): TransactionInstruction;
/**
 * Removes a gatekeeper from a gatekeeper network.
 * Returns a Solana instruction that must be signed by the gatekeeper network authority.
 *
 * @param funds_to The account the gatekeeper account's rent goes to
 * @param gatekeeperAccount The gatekeeper account PDA. The address must be derived via getGatekeeperAccountKeyFromGatekeeperAuthority()
 * @param gatekeeperAuthority The gatekeeper to remove from the network
 * @param network The gatekeeper network that the account is being removed from.
 */
export declare function revokeGatekeeper(funds_to: PublicKey, gatekeeperAccount: PublicKey, gatekeeperAuthority: PublicKey, network: PublicKey): TransactionInstruction;
/**
 * Issue a gateway token to the owner publicKey. This is a 'vanilla' token, in that it does not
 * rely on any other accounts (e.g. identity accounts) to validate.
 * Returns a Solana instruction that must be signed by the gatekeeper authority.
 * @param gatewayTokenAccount An uninitialised gateway token account PDA. The address must be derived via getGatewayTokenAddressForOwnerAndGatekeeperNetwork
 * @param payer The payer of the transaction (used to pay rent into the gatekeeper account).
 * @param gatekeeperAccount The account in the gatekeeper network of the gatekeeper issuing the token
 * @param owner The recipient of the token
 * @param gatekeeperAuthority The gatekeeper issuing the token
 * @param gatekeeperNetwork The network that the gatekeeper belongs to
 * @param seed An 8-byte seed array, used to add multiple tokens to the same owner. Must be unique to each token, if present
 * @param expireTime The unix timestamp at which the token is no longer valid
 */
export declare function issueVanilla(gatewayTokenAccount: PublicKey, payer: PublicKey, gatekeeperAccount: PublicKey, owner: PublicKey, gatekeeperAuthority: PublicKey, gatekeeperNetwork: PublicKey, seed?: Uint8Array, expireTime?: number): TransactionInstruction;
/**
 * Revoke a gateway token.
 * Returns a Solana instruction that must be signed by the gatekeeper authority.
 * @param gatewayTokenAccount The gateway token to revoke
 * @param gatekeeperAuthority The gatekeeper revoking the token (must be in the same network as the issuing gatekeeper)
 * @param gatekeeperAccount The account in the gatekeeper network of the gatekeeper revoking the token
 */
export declare function revoke(gatewayTokenAccount: PublicKey, gatekeeperAuthority: PublicKey, gatekeeperAccount: PublicKey): TransactionInstruction;
/**
 * Freeze a gateway token.
 * Returns a Solana instruction that must be signed by the gatekeeper authority.
 * @param gatewayTokenAccount The gateway token to freeze
 * @param gatekeeperAuthority The gatekeeper freezing the token (must be equal to the issuing gatekeeper)
 * @param gatekeeperAccount The account in the gatekeeper network of the gatekeeper freezing the token
 */
export declare function freeze(gatewayTokenAccount: PublicKey, gatekeeperAuthority: PublicKey, gatekeeperAccount: PublicKey): TransactionInstruction;
/**
 * Unfreeze a gateway token.
 * Returns a Solana instruction that must be signed by the gatekeeper authority.
 * @param gatewayTokenAccount The gateway token to unfreeze
 * @param gatekeeperAuthority The gatekeeper unfreezing the token (must be equal to the issuing gatekeeper)
 * @param gatekeeperAccount The account in the gatekeeper network of the gatekeeper unfreezing the token
 */
export declare function unfreeze(gatewayTokenAccount: PublicKey, gatekeeperAuthority: PublicKey, gatekeeperAccount: PublicKey): TransactionInstruction;
/**
 * Update the expiry time of a gateway token.
 * Returns a Solana instruction that must be signed by the gatekeeper authority.
 * @param gatewayTokenAccount The gateway token to be updated (must have an expiry time)
 * @param gatekeeperAuthority The gatekeeper (must be equal to the issuing gatekeeper)
 * @param gatekeeperAccount The account in the gatekeeper network of the gatekeeper
 * @param expireTime The new expiry time
 */
export declare function updateExpiry(gatewayTokenAccount: PublicKey, gatekeeperAuthority: PublicKey, gatekeeperAccount: PublicKey, expireTime: number): TransactionInstruction;
export {};
