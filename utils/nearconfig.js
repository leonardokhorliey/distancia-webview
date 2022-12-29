import * as NearAPI from 'near-api-js';
import { getConfig } from './constants';

export const Wallet = async () => {
    const { WalletConnection, keyStores, connect} = NearAPI;

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    const config = {...getConfig(process.env.NEXT_PUBLIC_ENVIRONMENT || 'testnet'), keyStore}

    const near = await connect(config);

    const wallet = new WalletConnection(near)

    

    return wallet;
}

export const Contract = (account) => {
    const contract_ = new NearAPI.Contract(account,
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "main.distancia.testnet",
        {
            viewMethods: [],
            changeMethods: ["get_token_contract_owner", "ad_watched", "get_ads_watched", "get_distancia_price","clear_milestone", "convert_distancia"],
            sender: account
        });

    return contract_
}

export const parseNear = (amount) => {
    return NearAPI.utils.format.parseNearAmount(amount);
}

export const formatNear = (amount) => {
    return NearAPI.utils.format.formatNearAmount(amount);
}



