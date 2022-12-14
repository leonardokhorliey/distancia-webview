import React, { useState, useEffect } from "react";
import { Wallet } from "../utils/nearconfig";
import {Axios} from 'axios';
import Head from "next/head";


export default function ConnectWallet() {
    const [wallet, setWallet] = useState();
    const [userId, setUserId] = useState('');
    const [connected, setConnected] = useState(false);
    const [failedConnect, setFailedConnect] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setUserId(searchParams.get('user_id'));

        connectWallet(searchParams.get('user_id'))
    }, [])


    const connectWallet = (userId) => {
        Wallet().then(async (tx) => {
            if (!tx.isSignedIn()) {
                tx.requestSignIn(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "main.distancia.testnet", // contract requesting access
                    "Distancia App"
                );
                return;
            }

            setWallet(tx);
            const apiUrl = process.env.NEXT_PUBLIC_WALLET_ADDRESS_ENDPOINT;
            if (apiUrl) await new Axios().post(process.env.NEXT_PUBLIC_WALLET_ADDRESS_ENDPOINT, {
                user_id: userId,
                account_id: tx.getAccountId()
            }); 
            setConnected(true);
        }).catch((e) => {
            console.log(e.message)
            setFailedConnect(true);
        });
    }


    

    return (
        <div id="app-path">
            <Head>
                <title>NEAR Wallet Connection</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div id="header">
                <p>Connect Wallet</p>
            </div>

            <div id="info-section">
                <div id= "fail-connect">
                {connected || failedConnect ? <>
                    <h1>
                        {failedConnect ? 'Failed to connect to NEAR Wallet': `Successfully connected wallet with address ${wallet.getAccountId()} to Distancia`}
                    </h1>

                    <button onClick= {() => failedConnect ? connectWallet(userId) : alert('done')}>
                        {failedConnect ? 'Retry' : 'OK'}
                    </button></>
                 : <p>Attempting to connect wallet ...</p>}
                </div>
                
                    

            </div>

            
            


            <div id="footer">
                <div>
                <p>This page is part of Distancia confirmation policy. Read more here</p>
                <p>Copyright. Distancia 2022</p>
                </div>
                
            </div>
            
        </div>
    )
}