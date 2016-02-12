if(typeof web3 !== 'undefined')
    web3 = new Web3(web3.currentProvider);
else
    web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

$(document).ready(function() {


    var abi = [{"constant":true,"inputs":[],"name":"payEntrants","outputs":[{"name":"j","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_Number","type":"uint256"}],"name":"newEntrant","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"getNumberAtPosition","type":"uint256"}],"name":"getEntrants","outputs":[{"name":"fundersLength","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"funders","outputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"},{"name":"Number","type":"uint256"}],"type":"function"},{"inputs":[],"type":"constructor"}];
    myC = web3.eth.contract(abi).at("0xedf5e5a562bca23b4b0ff52d74a7fc0696ec09e1");

    //set
    myC.newEntrant.sendTransaction(420,{from: web3.eth.accounts[0], value: web3.toWei(2, 'finney'), to: '0x6d6fedbba0bbb92bf60fbf902dd104cee9281861', gas: 350000});
    myC.payEntrants.sendTransaction({from: web3.eth.accounts[0], to: '0xedf5e5a562bca23b4b0ff52d74a7fc0696ec09e1', gas: 350000});
    //myC.getEntrants.call();
    ////get
    //myC.getEntrants.call();


});