if(typeof web3 !== 'undefined')
  web3 = new Web3(web3.currentProvider);
else
web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

$(document).ready(function() {


  var _contractAddress = '0x25e8e19b46ae675735e4de9bf57ea2ef98563c62';
  //contract abi
  var abi = [{"constant":false,"inputs":[],"name":"getSeedAHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"rewardValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"seedBUserParam","type":"uint256"}],"name":"rand","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getDieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"FACTOR","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedBStage1Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"seedAHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"win","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedB","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedA","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedBStage1Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"high","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedBStage2Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedB","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedBStage2Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"seedBUserParam2","type":"uint256"}],"name":"reveal","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"ResetStage","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getStage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"inputs":[],"type":"constructor"}];
  //creation of contract object
  var _etherFlip = web3.eth.contract(abi);
  //initiate contract for an address
  var etherflip = _etherFlip.at(_contractAddress);

  //kill ocntract
  //etherflip.kill.sendTransaction({from:web3.eth.accounts[0], to:_contractAddress, gas: 200000, data: web3.fromAscii('kill')})

  //send bet
  //etherflip.rand.sendTransaction(99,{from: eth.accounts[0], value: web3.toWei(10, 'ether'), to: _contractAddress, gas: 500000,  data: web3.fromAscii('bet')})

  //reveal
  //etherflip.reveal.sendTransaction(69,{from:eth.accounts[0], to:_contractAddress, gas: 500000, data: web3.fromAscii('reveal')})

  var _betValue;
  var _betChoice;
  var _sendNumber;
  var _result;
  var _blockNumber;
  var _blockNumberOriginal;
  var _account;
  var _balance;
  var _balanceDisplay;
  var _blocksToGo;

  //blocks to wait until generate seedC from future block
  var _blockGoal = 4;

  //blocks to wait to reset game UI
  var _blockGoalReset = 2;

  var _blockCheck;
  var _resetAndDisplayResult;
  var _resetGameUI;
  var _blockCheckIntervalWaitTime = 5000;

  var _testValue = 10;
  var _sendNumber = 98;

  var _blockNumberRevealOriginal;


  //this send transaction works
  //web3.eth.sendTransaction({from: web3.eth.accounts[0], value: web3.toWei(100, 'ether'), to: '0xfc43b4690e0b1cd822c3bb1bc7c8916c4c4c63c3', gas: 200000,  data: web3.fromAscii('loadtest')})

  //generate new data
  $("#loadDataButton").click(function() {
    clearAll();
    loadData();
  });

  //pre-selected bet values
  $(".pre-paid").click(function() {
    _betValue = $(this).val();
    $(".bet-amount").val(_betValue);
    $(".bet-payout").val((_betValue*190)/100);
  });

  //change bets UI
  var myInput = $('#the-bet');
  myInput.change(function() {
    $(".bet-amount").val(myInput.val());
  });

  //change bets UI
  myInput.keyup(function() {
    $(".bet-amount").val(myInput.val());
    $(".bet-payout").val((myInput.val()*190)/100);
  });

  //change bets UI
  $("#the-bet").change(function() {
    _betValue = $(this).val();
    $(".bet-amount").val(_betValue);
    $(".bet-payout").val((_betValue*190)/100);
  });

  //change bet UI
  $(".bet-choice").click(function() {
    _betChoice = $(this).attr('id');
    $("#bet-number").val(_betChoice);
  });

  $('.generating-normal').show();

  //get account[0] address, balance, blocknumber, timestamp
  function loadData() {

    //get account
    _account = web3.eth.coinbase;

    //show account on page
    $( '.account' ).text(_account);
    $( '.betting-account' ).val(_account);

    //get account balance
    _balance = web3.eth.getBalance(_account);
    _balanceDisplay = _balance*.000000000000000001;

    $( '.balance' ).text( _balanceDisplay.toString(10));

    //get latest block number
    _blockNumber = web3.eth.blockNumber;
    $( '#latestBlock' ).text( _blockNumber);

    //get latest block timestamp
   /* var _blockTimeStamp = web3.eth.block.timestamp;
    $( '#latestBlockTimestamp' ).text( _blockTimeStamp);*/

    //get latest result
    _result = etherflip.dieResult.call();
    //display result
    $("#result").val(_result);

  }

  function updateBalance() {
    //get account
    _account = web3.eth.coinbase;
    $( '.balance' ).text( _balanceDisplay.toString(10));
  }

  function updateBalanceFaux() {
    //get account
    $( '.balance' ).text( _balanceDisplay.toString(10) - _betValue);
  }

  //reset when buton is clicked
  function clearAll() {
    _account = "";
    _balance = "";
    _blockNumber = "";
    _blockTimeStamp = "";

  }

  loadData();

  //place bet

  $("#place-bet").click(function() {

      //console.log(_sendNumber);
     // console.log(_betValue);

    $("#win").hide();
    $("#lose").hide();

    //send bet
    etherflip.rand.sendTransaction(_sendNumber,{from: web3.eth.accounts[0], value: web3.toWei(_testValue, 'ether'), to: _contractAddress, gas: 500000,  data: web3.fromAscii('Etherflip.io bet on block#' + _blockNumber )})

    console.log("bet");

    //set result UI empty
    $("#result").val("");

    //setTimeout(function(){ genSeedC() }, 90000);
    _blockCheck = setInterval(function(){ genSeedC() }, _blockCheckIntervalWaitTime);


    updateBalanceFaux();

    showLoading();

    disableRoll();

    _blockNumberOriginal = web3.eth.blockNumber;
  });

  //reset when buton is clicked
  function genSeedC() {

    _blockNumber = web3.eth.blockNumber;

    console.log("Current block nunber" + _blockNumber);
    _blocksToGo = _blockNumber - _blockNumberOriginal;
    _blocksToGoDisplay = _blockGoal - (_blockNumber - _blockNumberOriginal);

    console.log('blocks to go: ' + _blocksToGoDisplay);

    $('#blocks-to-go').val(_blocksToGoDisplay + ' blocks to go...');

    if(_blocksToGo >= _blockGoal){
      console.log("block number reached - generating seedC - 4 blocks until reveal number");

     //stop checking blocks
      clearInterval(_blockCheck);

      //reveal
      etherflip.reveal.sendTransaction(_sendNumber,{from:web3.eth.accounts[0], to:_contractAddress, gas: 500000, data: web3.fromAscii('reveal')})
      updateBalance();

      //init reveal number count
      _resetAndDisplayResult = setInterval(function(){ displayResult() }, _blockCheckIntervalWaitTime);

      _blockNumberRevealOriginal = web3.eth.blockNumber;
    }


  }

  function displayResult() {

    _blockNumberReveal = web3.eth.blockNumber;
    console.log("Current block nunber" + _blockNumberReveal);
    _blocksToGoReveal = _blockNumberReveal - _blockNumberRevealOriginal;
    _blocksToGoDisplayReveal = _blockGoal - (_blockNumberReveal - _blockNumberRevealOriginal);

    console.log('blocks to go: ' + _blocksToGoDisplayReveal);

    $('#blocks-to-go').val(_blocksToGoDisplayReveal + ' blocks to go...');

    if(_blocksToGoReveal >= _blockGoal) {
      //displayResult
      etherflip.ResetStage.sendTransaction({from:web3.eth.accounts[0], to:_contractAddress, gas: 200000});

      //reload data - address, balance, blocknumber, timestamp

      loadData();
      //hideLoading();
      //stop checking blocks
      clearInterval(_resetAndDisplayResult);

      //init reveal number count
      _blockNumberResetOriginal = web3.eth.blockNumber;
      _resetGameUI = setInterval(function(){ resetGameUI() }, _blockCheckIntervalWaitTime);
    }

    function resetGameUI() {

      _blockNumberReset = web3.eth.blockNumber;
      console.log("Current block nunber" + _blockNumberReset);
      _blocksToGoReset = _blockNumberReset - _blockNumberResetOriginal;
      _blocksToGoDisplayReset = _blockGoalReset - (_blockNumberReset - _blockNumberResetOriginal);

      console.log('blocks to go: ' + _blocksToGoDisplayReset);

      $('#blocks-to-go').val(_blocksToGoDisplayReset + ' blocks to go...');

      $('.generating-confirm').show();

      if (_blocksToGoReset >= _blockGoalReset) {

        //reset UI
        hideLoading();

        //display win/no win UI
        if(_result > 50 && _betValue != null){
          $("#win").show();
          $("#lose").hide();
          $('bet-payout').removeClass('red');
          $('bet-payout').addClass('green');
        }

        if(_result < 50 && _betValue != null){
          $("#win").hide();
          $("#lose").show();
          $('bet-payout').removeClass('green');
          $('bet-payout').addClass('red');
        }

        //hide 'confirming'
        $('.generating-confirm').hide();

        //reset blocks waiting output
        $('#blocks-to-go').val('Waiting for blocks...');
      }

    }


  }


  //to do remove   - devonly
  $("#reset").click(function() {
    //reset etherflip state for bets
    displayResult();

  });

  function showLoading(){
    $('.generating-wait').show();
    $('.generating-normal').hide();

  }

  function hideLoading(){
    $('.generating-normal').show();
    $('.generating-wait').hide();
  }

  function disableRoll(){
    //when player submits kill ui, input etc

  }


});