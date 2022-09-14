#![allow(non_snake_case)]

use std::{
    env,
    str::FromStr,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use secp256k1::SecretKey;
use web3::{
    contract::{tokens::Tokenize, Contract, Options},
    transports::WebSocket,
    types::{Address, Bytes, SignedTransaction, TransactionParameters, H160, H256, U256},
    Web3,
};

#[tokio::main]
async fn main() -> web3::Result<()> {
    dotenv::dotenv().ok();

    let websocket: WebSocket = web3::transports::WebSocket::new(&env::var("INFURA_RINKEBY").unwrap()).await?;
    let web3_ins: Web3<WebSocket> = web3::Web3::new(websocket);

    let mut accounts: Vec<H160> = web3_ins.eth().accounts().await?;
    accounts.push(H160::from_str(&env::var("ACCOUNT_ADDRESS").unwrap()).unwrap());
    println!("Accounts: {:?}", &accounts);

    let one_eth_in_wei: U256 = U256::exp10(18);
    for account in &accounts {
        let balance: U256 = web3_ins.eth().balance(*account, None).await?;
        println!("Eth balance of {:?}: {} ETH", account, balance.checked_div(one_eth_in_wei).unwrap());
    }

    let router02_addr: H160 = Address::from_str("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D").unwrap();
    let router02_contract: Contract<WebSocket> =
        Contract::from_json(web3_ins.eth(), router02_addr, include_bytes!("router02_abi.json")).unwrap();

    let weth_addr: Address = router02_contract.query("WETH", (), None, Options::default(), None).await.unwrap();

    println!("WETH address: {:?}", &weth_addr);

    let dai_address: H160 = Address::from_str("0xc7ad46e0b8a400bb3c915120d284aafba8fc4735").unwrap();
    let valid_timestamp: u128 = get_valid_timestamp(300000);
    println!("timemillis: {}", valid_timestamp);

    let out_gas_estimate: U256 = router02_contract
        .estimate_gas(
            "swapExactETHForTokens",
            (
                U256::from_dec_str("106662000000").unwrap(), // uint amountOutMin (DAI)
                vec![weth_addr, dai_address],                // address[] calldata path
                accounts[0],                                 // address to
                U256::from_dec_str(&valid_timestamp.to_string()).unwrap(), // uint deadline
            ),
            accounts[0],
            Options {
                // (10^18)/20 = 50000000000000000 -> 0.05 ETH
                value: Some(U256::exp10(18).checked_div(20.into()).unwrap()),
                gas: Some(500_000.into()),
                ..Default::default()
            },
        )
        .await
        .expect("Error");

    println!("estimated gas amount: {}", out_gas_estimate);
    let gas_price: U256 = web3_ins.eth().gas_price().await.unwrap();
    println!("gas price: {}", gas_price);

    let data: Vec<u8> = router02_contract
        .abi()
        .function("swapExactETHForTokens")
        .unwrap()
        .encode_input(
            &(
                U256::from_dec_str("106662000000").unwrap(), // uint amountOutMin (DAI)
                vec![weth_addr, dai_address],                // address[] calldata path
                accounts[0],                                 // address to
                U256::from_dec_str(&valid_timestamp.to_string()).unwrap(), // uint deadline
            )
                .into_tokens(),
        )
        .unwrap();

    let nonce: U256 = web3_ins.eth().transaction_count(accounts[0], None).await.unwrap();
    println!("nonce: {}", nonce);

    let transact_obj: TransactionParameters = TransactionParameters {
        nonce: Some(nonce),
        to: Some(router02_addr),
        value: U256::exp10(18).checked_div(20.into()).unwrap(), // (10^18)/20 = 50000000000000000 -> 0.05 ETH
        gas_price: Some(gas_price),
        gas: out_gas_estimate,
        data: Bytes(data),
        ..Default::default()
    };
    println!("transact_obj {:?}", transact_obj);

    let private_key: SecretKey = SecretKey::from_str(&env::var("PRIVATE_TEST_KEY").unwrap()).unwrap();
    let signed_transaction: SignedTransaction =
        web3_ins.accounts().sign_transaction(transact_obj, &private_key).await.unwrap();

    println!("signed transaction: {:?}", signed_transaction);

    let result: H256 = web3_ins.eth().send_raw_transaction(signed_transaction.raw_transaction).await.unwrap();

    println!("Transaction successful with hash: {:?}", result);

    Ok(())
}

fn get_valid_timestamp(future_millis: u128) -> u128 {
    let start: SystemTime = SystemTime::now();
    let since_epoch: Duration = start.duration_since(UNIX_EPOCH).unwrap();
    let time_millis: u128 = since_epoch.as_millis().checked_add(future_millis).unwrap();

    time_millis
}
