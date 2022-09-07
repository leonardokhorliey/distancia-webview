import * as NearAPI from 'near-api-js';
import { getConfig } from './constants';

export const Wallet = async () => {
    const { WalletConnection, keyStores, connect} = NearAPI;

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    const config = {...getConfig('testnet'), keyStore}

    const near = await connect(config);

    const wallet = new WalletConnection(near)

    

    return wallet;
}

export const Contract = (account) => {
    const contract_ = new NearAPI.Contract(account,
        process.env.REACT_APP_CONTRACT_ADDRESS || "ea-kazi.eakazi.testnet",
        {
            viewMethods: [],
            changeMethods: ["create_course", "enroll_for_course", "mint_certificate_to_trainee", "create_job","apply_to_job", "confirm_job_employment", "pay_wage", "end_job_employment"],
            sender: account
        });

    return contract_
}

export const parseNear = (amount) => {
    return NearAPI.utils.format.parseNearAmount(amount);
}



