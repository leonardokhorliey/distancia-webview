import React, { useState, useEffect } from "react";
import { Wallet, Contract } from "../utils/nearconfig";

export default function SignTransaction() {
    const [functionName, setFunctionName] = useState('')
    const [signer, setSigner] = useState('')
    const [requiresNear, setRequiresNear] = useState('N')
    const [parameters, setParameters] = useState('')
    const [wallet, setWallet] = useState()
    const [accountId, setAccountId] = useState('')

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        setFunctionName(searchParams.get("transaction"))
        setRequiresNear(searchParams.get(requiresNear))
        setParameters(searchParams.get("args"))

        Wallet().then((tx) => {
            if (!tx.isSignedIn()) {
                tx.requestSignIn();
                return;
            }

            setWallet(tx);
            setAccountId(tx.getAccountId());   
        }).catch((e) => {
            console.log(e.message)
            setLoggedIn(false);
        });
    })


    const handleUpdateExpense = async (args) => {
        let { expenseId, newDate, newAmount } = args;
        console.log(newAmount)
        // setToast("Updating Expense ...");
        // setIsToastLive(true);
        try {
        if (!newAmount) {
          await Contract(wallet.account()).updateExpenseCompletionDate({expenseId, newDate}); 
          alert("Other way")
        } else if (!newDate) {
          await Contract(wallet.account()).updateExpenseAmount({expenseId, newAmount});
        } else {
          await Contract(wallet.account()).updateExpenseCompletionDate({expenseId, newDate});
          alert("Done date")
          await Contract(wallet.account()).updateExpenseAmount({expenseId, newAmount});
          alert("Done amount")
        } 
        
        // await getExpenses(wallet);
        // setIsToastLive(false);
        alert("Expense updated Successfully");
        } catch(e) {alert(e.message)}
    }

    
    const functions = {
        'get_users' : handleUpdateExpense
    }

    const handleConfirm = async () => {
        let args = JSON.parse(parameters)
        console.log(args)
        const func = functions['get_users']
        await func(args)

        console.log("Done")
    }

    return (
        <div>
            <div>
                <p>Confirm BlockChain Trainsaction</p>
            </div>

            <div>
                <h1>
                    EA-Kazi wants to call a BlockChain transaction with your account. 
                    Please confirm.
                </h1>

                <h3>Transaction Details</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Function
                            </td>
                            <td>
                                {functionName}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Arguments
                            </td>
                            <td>
                                {parameters}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Signer Account Id
                            </td>
                            <td>
                                {accountId}
                            </td>
                        </tr>
                    </tbody>
                    
                </table>

                {requiresNear && 
                <div>
                    <input type="number" min="0.01" placeholder="Enter value to be sent"/>
                    <select>
                        <option value= "yNEAR">yNEAR</option>
                        <option value= "yNEAR">NEAR</option>
                    </select>
                </div>}

            </div>
            <button onClick={handleConfirm}>
                Confirm
            </button>
            <div>
                <p>This page is part of EA Kazi confirmation policy. Read more here</p>
                <p>Copyright. EA-Kazi 2022</p>
            </div>
            <button onClick={() => wallet.signOut()}>
                Sign Out
            </button>
        </div>
    )
}