"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatekeeperExists = exports.getGatewayToken = exports.removeAccountChangeListener = exports.onGatewayTokenChange = exports.findGatewayToken = exports.findGatewayTokens = exports.dataToGatewayToken = exports.getGatewayTokenAddressForOwnerAndGatekeeperNetwork = exports.getGatekeeperAccountAddress = void 0;
const web3_js_1 = require("@safecoin/web3.js");
const constants_1 = require("./constants");
const types_1 = require("../types");
const GatewayTokenData_1 = require("./GatewayTokenData");
/**
 * Derive the address of the gatekeeper PDA for this gatekeeper
 * @param authority The gatekeeper
 * @param network The network
 */
const getGatekeeperAccountAddress = (authority, network) => __awaiter(void 0, void 0, void 0, function* () {
    const publicKeyNonce = yield web3_js_1.PublicKey.findProgramAddress([
        authority.toBuffer(),
        network.toBuffer(),
        Buffer.from(constants_1.GATEKEEPER_NONCE_SEED_STRING, "utf8"),
    ], constants_1.PROGRAM_ID);
    return publicKeyNonce[0];
});
exports.getGatekeeperAccountAddress = getGatekeeperAccountAddress;
/**
 * Derive the address of the gateway token PDA for this owner address and optional seed.
 * @param owner The owner of the gateway token
 * @param gatekeeperNetwork The network of the gateway token
 * @param seed An 8-byte seed array, used to add multiple tokens to the same owner. Must be unique to each token, if present
 */
const getGatewayTokenAddressForOwnerAndGatekeeperNetwork = (owner, gatekeeperNetwork, seed) => __awaiter(void 0, void 0, void 0, function* () {
    const additionalSeed = seed
        ? Buffer.from(seed)
        : Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
    if (additionalSeed.length != 8) {
        throw new Error("Additional Seed has length " +
            additionalSeed.length +
            " instead of 8 when calling getGatewayTokenAddressForOwnerAndGatekeeperNetwork.");
    }
    const seeds = [
        owner.toBuffer(),
        Buffer.from(constants_1.GATEWAY_TOKEN_ADDRESS_SEED, "utf8"),
        additionalSeed,
        gatekeeperNetwork.toBuffer(),
    ];
    const publicKeyNonce = yield web3_js_1.PublicKey.findProgramAddress(seeds, constants_1.PROGRAM_ID);
    return publicKeyNonce[0];
});
exports.getGatewayTokenAddressForOwnerAndGatekeeperNetwork = getGatewayTokenAddressForOwnerAndGatekeeperNetwork;
// Based on solana/integration-lib/src/state.rs
// If the optional the parent-gateway-token field is populated, this value will be
// 34 (2 + 32) instead. TODO IDCOM-320 restructure the gateway token accounts to put
// all optional values at the end of the struct to simplify account parsing a little
const GATEWAY_TOKEN_ACCOUNT_OWNER_FIELD_OFFSET = 2;
// As above, if optional fields are present, this will differ. TODO IDCOM-320 fixes this
const GATEWAY_TOKEN_ACCOUNT_GATEKEEPER_NETWORK_FIELD_OFFSET = 35;
function fromGatewayTokenState(state) {
    if (!!state.active)
        return types_1.State.ACTIVE;
    if (!!state.revoked)
        return types_1.State.REVOKED;
    if (!!state.frozen)
        return types_1.State.FROZEN;
    throw new Error("Unrecognised state " + JSON.stringify(state));
}
const dataToGatewayToken = (data, publicKey) => {
    var _a;
    return new types_1.GatewayToken(data.issuingGatekeeper.toPublicKey(), data.gatekeeperNetwork.toPublicKey(), data.owner.toPublicKey(), fromGatewayTokenState(data.state), publicKey, constants_1.PROGRAM_ID, (_a = data.expiry) === null || _a === void 0 ? void 0 : _a.toNumber());
};
exports.dataToGatewayToken = dataToGatewayToken;
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
const findGatewayTokens = (connection, owner, gatekeeperNetwork, includeRevoked = false) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerFilter = {
        memcmp: {
            offset: GATEWAY_TOKEN_ACCOUNT_OWNER_FIELD_OFFSET,
            bytes: owner.toBase58(),
        },
    };
    const gatekeeperNetworkFilter = {
        memcmp: {
            offset: GATEWAY_TOKEN_ACCOUNT_GATEKEEPER_NETWORK_FIELD_OFFSET,
            bytes: gatekeeperNetwork === null || gatekeeperNetwork === void 0 ? void 0 : gatekeeperNetwork.toBase58(),
        },
    };
    const filters = [ownerFilter, gatekeeperNetworkFilter];
    const accountsResponse = yield connection.getProgramAccounts(constants_1.PROGRAM_ID, {
        filters,
    });
    if (!accountsResponse)
        return [];
    const toGatewayToken = ({ pubkey, account, }) => (0, exports.dataToGatewayToken)(GatewayTokenData_1.GatewayTokenData.fromAccount(account.data), pubkey);
    return accountsResponse
        .map(toGatewayToken)
        .filter((gatewayToken) => gatewayToken.state !== types_1.State.REVOKED || includeRevoked);
});
exports.findGatewayTokens = findGatewayTokens;
/**
 * Get a gateway token for the owner and network, if it exists.
 * @param connection A solana connection object
 * @param owner The token owner
 * @param gatekeeperNetwork The network to find a token for
 * @returns Promise<GatewayToken | null> An unrevoked token, if one exists for the owner
 */
const findGatewayToken = (connection, owner, gatekeeperNetwork) => __awaiter(void 0, void 0, void 0, function* () {
    const gatewayTokenAddress = yield (0, exports.getGatewayTokenAddressForOwnerAndGatekeeperNetwork)(owner, gatekeeperNetwork);
    const account = yield connection.getAccountInfo(gatewayTokenAddress, constants_1.SOLANA_COMMITMENT);
    if (!account)
        return null;
    return (0, exports.dataToGatewayToken)(GatewayTokenData_1.GatewayTokenData.fromAccount(account.data), gatewayTokenAddress);
});
exports.findGatewayToken = findGatewayToken;
/**
 * Register a callback to be called whenever a gateway token changes state
 * @param connection A solana connection object
 * @param gatewayTokenAddress The address of the gateway token
 * @param callback The callback to register
 * @param commitment The solana commitment level at which to register gateway token changes. Defaults to 'confirmed'
 * @return The subscription id
 */
const onGatewayTokenChange = (connection, gatewayTokenAddress, callback, commitment = constants_1.SOLANA_COMMITMENT) => {
    const accountCallback = (accountInfo) => {
        const gatewayToken = (0, exports.dataToGatewayToken)(GatewayTokenData_1.GatewayTokenData.fromAccount(accountInfo.data), gatewayTokenAddress);
        callback(gatewayToken);
    };
    return connection.onAccountChange(gatewayTokenAddress, accountCallback, commitment);
};
exports.onGatewayTokenChange = onGatewayTokenChange;
/**
 * Stops listening to gateway state changes
 * @param connection A solana connection object
 * @param id The subscription id to deregister
 */
const removeAccountChangeListener = (connection, id) => connection.removeAccountChangeListener(id);
exports.removeAccountChangeListener = removeAccountChangeListener;
/**
 * Lookup the gateway token at a given address
 * @param connection A solana connection object
 * @param gatewayTokenAddress The address of the gateway token
 */
const getGatewayToken = (connection, gatewayTokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield connection.getAccountInfo(gatewayTokenAddress, constants_1.SOLANA_COMMITMENT);
    if (!account)
        return null;
    return (0, exports.dataToGatewayToken)(GatewayTokenData_1.GatewayTokenData.fromAccount(account.data), gatewayTokenAddress);
});
exports.getGatewayToken = getGatewayToken;
/**
 * Returns whether or not a gatekeeper exists from a network and authority
 * @param connection A solana connection
 * @param gatekeeperAuthority The authority of the gatekeeper
 * @param gatekeeperNetwork The network of the gatekeeper
 */
const gatekeeperExists = (connection, gatekeeperAuthority, gatekeeperNetwork) => __awaiter(void 0, void 0, void 0, function* () {
    const gatekeeperAccount = yield (0, exports.getGatekeeperAccountAddress)(gatekeeperAuthority, gatekeeperNetwork);
    const account = yield connection.getAccountInfo(gatekeeperAccount, constants_1.SOLANA_COMMITMENT);
    return account != null && account.owner == constants_1.PROGRAM_ID;
});
exports.gatekeeperExists = gatekeeperExists;
//# sourceMappingURL=util.js.map
