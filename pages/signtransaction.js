import React, { useState, useEffect } from "react";
import { Wallet, Contract, parseNear, formatNear } from "../utils/nearconfig";
import Head from "next/head";
import Notifier from "../components/notifier";



export default function SignTransaction() {
    const [functionName, setFunctionName] = useState('')
    const [signer, setSigner] = useState('')
    const [requiresNear, setRequiresNear] = useState('N')
    const [parameters, setParameters] = useState('')
    const [wallet, setWallet] = useState()
    const [accountId, setAccountId] = useState('')
    const [gasAmount, setGasAmount] = useState('30')
    const [processing, setProcessing] = useState(false)
    const [doneTransaction, setDoneTransaction] = useState(false);
    const [rejected, setRejected] = useState(false)
    const [failedTransaction, setFailedTransaction] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        setFunctionName(searchParams.get("transaction"))
        setRequiresNear(searchParams.get(requiresNear))
        setParameters(searchParams.get("args"))

        Wallet().then((tx) => {
            if (!tx.isSignedIn()) {
                tx.requestSignIn(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "main.distancia.testnet", // contract requesting access
                    "Distancia App"
                );
                return;
            }

            setWallet(tx);
            setAccountId(tx.getAccountId());
            
        }).catch((e) => {
            console.log(e.message)
            setLoggedIn(false);
        });
    }, [])


    // const handleUpdateExpense = async (args) => {
    //     let { expenseId, newDate, newAmount } = args;
    //     console.log(newAmount)
    //     // setToast("Updating Expense ...");
    //     // setIsToastLive(true);
    //     try {
    //     if (!newAmount) {
    //       await Contract(wallet.account()).updateExpenseCompletionDate({expenseId, newDate}); 
    //       alert("Other way")
    //     } else if (!newDate) {
    //       await Contract(wallet.account()).updateExpenseAmount({expenseId, newAmount});
    //     } else {
    //       await Contract(wallet.account()).updateExpenseCompletionDate({expenseId, newDate});
    //       alert("Done date")
    //       await Contract(wallet.account()).updateExpenseAmount({expenseId, newAmount});
    //       alert("Done amount")
    //     } 
        
    //     // await getExpenses(wallet);
    //     // setIsToastLive(false);
    //     alert("Expense updated Successfully");
    //     } catch(e) {alert(e.message)}
    // }


    const watchAdCompletely = async (args) => {
        let { ad_key } = args;
        let gas = (Number(gasAmount) * 1e12).toString();
        await Contract(wallet.account()).ad_watched({ ad_key }, gas)
        
    }

    const convertDistancia = async (args) => {
        let { distancia_amount } = args;
        let gas = (Number(gasAmount) * 1e12).toString();
        await Contract(wallet.account()).convert_distancia({ distancia_amount, milestone_cleared: false }, gas)
        
    }

    const clearMilestone = async (args) => {
        let { milestone_key } = args;
        let gas = (Number(gasAmount) * 1e12).toString();
        await Contract(wallet.account()).clear_milestone({ 
            milestone_key
            }, gas)
    }

    
    
    const functions = {
        'ad_watched' : watchAdCompletely,
        'clear_milestone' : clearMilestone,
        'convert_distancia' : convertDistancia,
    }

    const handleConfirm = async () => {
        setProcessing(true);

        try {
            if(Number(gasAmount) < 10) {
                alert("Gas value must be at least 10 Tgas. 35 and above are likely to be optimal.");
                return;
            }
            let args = JSON.parse(parameters)
            console.log(args)
            const func = functions[functionName]
            console.log(func)
            await func(args)
    
            console.log("Done")
            setProcessing(false)
            setDoneTransaction(true)

        } catch (e) {
            alert(e.message);
            console.log(e.message)
            setFailedTransaction(true);
            setProcessing(false)
            
        }
        
    }

    const handleReject = async () => {
        setDoneTransaction(true);
        setRejected(true)
    }

    return (
        <div id="app-path">
            {processing && <Notifier />}
            {failedTransaction && <Notifier isError={true} />}
            <Head>
                <title>Sign Transaction</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div id="header">
                <p>Confirm BlockChain Transaction</p>
            </div>

            {doneTransaction || failedTransaction ? <div id="info-section-fail">
                <h1>
                    {failedTransaction ? `Transaction Failed with error` : rejected ? 'Transaction Rejected' : 'Transaction Completed'}
                </h1>

                {doneTransaction && <button>
                    OK
                </button>}

                {failedTransaction && <button onClick={() => setFailedTransaction(false)}>
                    Retry
                </button>}

            </div> : 
            <div id="info-section">
                <h1>
                    Distancia wants to call a BlockChain transaction with your account.
                </h1>
                <h4>Please confirm</h4>

                <div id="details-section">
                    <h3>Transaction Details</h3>
                    <div id="transaction-details">
                        <div>
                            <h5>Smart Contract Address</h5>
                            <p>{process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "main.distancia.testnet"}</p>
                        </div>
                        <div>
                            <h5>Function</h5>
                            <p>{functionName}</p>
                        </div>
                        <div>
                            <h5>Signer Account Id</h5>
                            <p>{accountId}</p>
                        </div>
                        <div id="gas-area">
                            <h5>Gas Amount (Tgas)</h5>
                            <input type="number" name="gas" value={gasAmount} max="300" min="10" onChange={e => setGasAmount(e.target.value)}/>
                            <a href="https://docs.near.org/concepts/basics/transactions/gas">What is gas?</a>
                        </div>

                    </div>
                    

                    {requiresNear === 'T' && 
                    <div>
                        <input type="number" min="0.01" placeholder="Enter value to be sent"/>
                        <select>
                            <option value= "yNEAR">yNEAR</option>
                            <option value= "NEAR">NEAR</option>
                        </select>
                    </div>}
                </div>
                
                <div id="cta">
                    
                    <button onClick={handleReject}>
                        Reject
                    </button>
                    <button onClick={handleConfirm}>
                        Confirm
                    </button>
                </div>

            </div>}

            
            


            <div id="footer">
                <div>
                <p>This page is part of Distancia confirmation policy. Read more here</p>
                <p>Copyright. Distancia 2022</p>
                </div>
                
            </div>
            
        </div>
    )
}