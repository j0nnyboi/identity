import { Commitment, Connection, PublicKey } from "@safecoin/web3.js";
import { GatewayToken } from "../types";
import { GatewayTokenData } from "./GatewayTokenData";
/**
 * Derive the address of the gatekeeper PDA for this gatekeeper
 * @param authority The gatekeeper
 * @param network The network
 */
export declare const getGatekeeperAccountAddress: (authority: PublicKey, network: PublicKey) => Promise<PublicKey>;
/**
 * Derive the address of the gateway token PDA for this owner address and optional seed.
 * @param owner The owner of the gateway token
 * @param gatekeeperNetwork The network of the gateway token
 * @param seed An 8-byte seed array, used to add multiple tokens to the same owner. Must be unique to each token, if present
 */
export declare const getGatewayTokenAddressForOwnerAndGatekeeperNetwork: (owner: PublicKey, gatekeeperNetwork: PublicKey, seed?: Uint8Array | undefined) => Promise<PublicKey>;
export declare const dataToGatewayToken: (data: GatewayTokenData, publicKey: PublicKey) => GatewayToken;
/**
 * Find all gateway tokens for a user on a gatekeeper network, optionally filtering out revoked tokens.
 *
 * Warning - this uses the Solana getProgramAccounts RPC endpoint, which is inefficient and may be
 * blocked by some RPC services.
 *
 * @param connection A solana connection object
 * @param owner The token owner
 * @param gatekeeperNetwork The network to find a token for
 * @param {boolean=false} includeRevoked If false (default), filter out revoked tokens
 * @returns {Promise<GatewayToken[]>} All tokens for the owner
 */
export declare const findGatewayTokens: (connection: Connection, owner: PublicKey, gatekeeperNetwork: PublicKey, includeRevoked?: boolean) => Promise<GatewayToken[]>;
/**
 * Get a gateway token for the owner and network, if it exists.
 * @param connection A solana connection object
 * @param owner The token owner
 * @param gatekeeperNetwork The network to find a token for
 * @returns Promise<GatewayToken | null> An unrevoked token, if one exists for the owner
 */
export declare const findGatewayToken: (connection: Connection, owner: PublicKey, gatekeeperNetwork: PublicKey) => Promise<GatewayToken | null>;
/**
 * Register a callback to be called whenever a gateway token changes state
 * @param connection A solana connection object
 * @param gatewayTokenAddress The address of the gateway token
 * @param callback The callback to register
 * @param commitment The solana commitment level at which to register gateway token changes. Defaults to 'confirmed'
 * @return The subscription id
 */
export declare const onGatewayTokenChange: (connection: Connection, gatewayTokenAddress: PublicKey, callback: (gatewayToken: GatewayToken) => void, commitment?: Commitment) => number;
/**
 * Stops listening to gateway state changes
 * @param connection A solana connection object
 * @param id The subscription id to deregister
 */
export declare const removeAccountChangeListener: (connection: Connection, id: number) => Promise<void>;
/**
 * Lookup the gateway token at a given address
 * @param connection A solana connection object
 * @param gatewayTokenAddress The address of the gateway token
 */
export declare const getGatewayToken: (connection: Connection, gatewayTokenAddress: PublicKey) => Promise<GatewayToken | null>;
/**
 * Returns whether or not a gatekeeper exists from a network and authority
 * @param connection A solana connection
 * @param gatekeeperAuthority The authority of the gatekeeper
 * @param gatekeeperNetwork The network of the gatekeeper
 */
export declare const gatekeeperExists: (connection: Connection, gatekeeperAuthority: PublicKey, gatekeeperNetwork: PublicKey) => Promise<boolean>;
