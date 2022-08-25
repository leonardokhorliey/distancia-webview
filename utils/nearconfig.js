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
        process.env.REACT_APP_CONTRACT_ADDRESS || "expenses.leonard0.testnet",
        {
            viewMethods: [],
            changeMethods: ["createNewExpense", "getAllExpenses", "updateExpenseCompletionDate", "updateExpenseAmount","removeExpense", "deleteExpense", "clearExpense"],
            sender: account
        });

    return contract_
}



