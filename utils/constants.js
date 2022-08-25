export const getConfig = (env) => {
    return ['production', 'mainnet'].includes(env) ? 
        {
            networkId: 'mainnet',
            nodeUrl: 'https://rpc.mainnet.near.org',
            walletUrl: 'https://wallet.near.org',
            helperUrl: 'https://helper.mainnet.near.org',
            explorerUrl: 'https://explorer.mainnet.near.org',
        } : (
        ['testnet', 'development'].includes(env) ? {
            networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
            walletUrl: 'https://wallet.testnet.near.org',
            helperUrl: 'https://helper.testnet.near.org',
            explorerUrl: 'https://explorer.testnet.near.org',
        } : null
    )
}