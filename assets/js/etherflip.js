if(typeof web3 !== 'undefined')
  web3 = new Web3(web3.currentProvider);
else
web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

$(document).ready(function() {

  //yea lots of mess and dupes yummyy
  var _contractAddress = '0xadeae0157fb74e98b846a65d7a6459527d6d3ee9';
  //contract abi
  var abi = [{"constant":false,"inputs":[],"name":"getSeedAHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"rewardValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"seedBUserParam","type":"uint256"}],"name":"rand","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getDieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"FACTOR","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedBStage1Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"seedAHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"win","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedB","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedA","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"resetStage","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedBStage1Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"high","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"seedBUserParam2","type":"uint256"}],"name":"LateBets","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedBStage2Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"getNumberAtPosition","type":"uint256"}],"name":"getEntrants","outputs":[{"name":"entrantInfo","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedB","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedBStage2Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"msgSender","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"funders","outputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"},{"name":"Number","type":"uint256"},{"name":"rewardValue","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"ownerResetGame","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getStage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"inputs":[],"type":"constructor"}];

  //creation of contract object
  var _etherFlip = web3.eth.contract(abi);
  //initiate contract for an address
  var etherflip = _etherFlip.at(_contractAddress);

  var _betValue;
  var _betValuSend;
  var _betChoice;
  var _sendNumber;
  var _result;
  var _blockNumber;
  var _blockNumberDisplay;
  var _blockNumberOriginal;
  var _account;
  var _balance;
  var _balanceDisplay;
  var _blocksToGo;
  var _seedAHash;
  var _seedA;

  //blocks to wait until generate seedC from future block
  var _blockGoal = 4;

  //blocks to wait to reset game UI
  var _blockGoalReset = 2;

  var _blockCheck;
  var _resetAndDisplayResult;
  var _resetGameUI;

  var _betBlockNumberDisplay;

  var _blockCheckIntervalWaitTime = 1000;
  var _getLastGameDataInterval = 5000;
  var _getSeedAHashInterval = 1000;

  //var _testValue = 10;
  //var _sendNumber = 98;
  var _seedB;

  var _blockNumberRevealOriginal;

  var _seedBInput;

  var _getLastGameData;
  //init last games data
  _getLastGameData = setInterval(function(){ getDieResult() }, _getLastGameDataInterval);

  //generate new data
  $("#loadDataButton").click(function() {
    clearAll();
    loadData();
  });

  //pre-selected bet values
  $(".pre-paid").click(function() {
    _betValue = $(this).val();
    //_betValuSend = parseInt(_betValue,10);
    $(".bet-amount").val(_betValue);
    $(".bet-payout").val((_betValue*190)/100);
  });

  //change bets UI
  var myInput = $('#the-bet');
  myInput.keyup(function() {
    $(".bet-amount").val(myInput.val());
    $(".bet-payout").val((myInput.val()*190)/100);
  });

  //change bets UI
  $("#the-bet").change(function() {
    _betValue = $(this).val();
    $(".bet-amount").val(_betValue);
    $(".bet-payout").val((_betValue*190)/100);
    //console.log(_betValue);
  });

  //change bet UI
  $(".bet-choice").click(function() {
    _betChoice = $(this).attr('id');
    $("#bet-number").val(_betChoice);
  });

  //change bets UI
  _seedBInput = $('#seedB');
  _seedBInput.keyup(function() {
    $("#bet-number").val(_seedBInput.val());
  });


  //change bets UI
  $("#seedB").change(function() {
    _seedB = $(this).val();
    //_seedBSend =  parseInt(_betValue,10);
    $("#bet-number").val(_seedB);
  });

  //if game already in progress freeze UI
  if((etherflip.stage() == 0) ) {
    $('.generating-normal').show();
    enableRoll();
    hideLoading();
  }
  if((etherflip.stage() == 1) ){
    showLoading();
    enableRoll();
  }
  if((etherflip.stage() == 2) ) {
    showLoading();
    disableRoll();
  }



  //get result of die
  function getDieResult(){
    //get latest result
    _result = etherflip.dieResult.call();
    //display result
    $("#result").val(_result);
    console.log('die result: ' + _result);
  }

  //get latest getSeedAHash
  function getSeedAHash(){
    _seedAHash = etherflip.getSeedAHash.call();
    //display result
    $("#seedA_hashSHA3").text(_seedAHash);
    //console.log('seedAHash: ' + _seedAHash);
  }

  function getSeedA(){
    _seedA = etherflip.getSeedA.call();
    //display result
    $("#seedA").text(_seedA);
    //console.log('seedAHash: ' + _seedAHash);
  }

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

    var str = _balanceDisplay.toString(10);
    var _balanceDisplayDecimalSplit = str.split(".");
    var _balanceDisplayDecimal = _balanceDisplayDecimalSplit[0];

    $('.balance').text(_balanceDisplayDecimal);

    //get latest block number
    _blockNumberDisplay = web3.eth.blockNumber;
    $( '#latestBlock' ).text( _blockNumberDisplay);

    //get latest block timestamp
   /* var _blockTimeStamp = web3.eth.block.timestamp;
    $( '#latestBlockTimestamp' ).text( _blockTimeStamp);*/

    getDieResult();

  }


  function updateBalance() {
    //get account
    _account = web3.eth.coinbase;
    _balanceDisplay = _balance*.000000000000000001;

    var str = _balanceDisplay.toString(10);
    var _balanceDisplayDecimalSplit = str.split(".");
    var _balanceDisplayDecimal = _balanceDisplayDecimalSplit[0];

    $('.balance').text(_balanceDisplayDecimal);

    //console.log('balance: ' + _balanceDisplayDecimal);
  }

  //reset when buton is clicked
  function clearAll() {
    _account = "";
    _balance = "";
    _blockNumberDisplay = "";
    _blockTimeStamp = "";

  }

  loadData();

  //place bet
  $("#place-bet").click(function() {

    if(($('#the-bet').val() != '') && ($('#seedB').val() != '') && ($('#the-bet').val() < 101) && ($('#seedB').val() < 101)  && ($('#the-bet').val() > 0) && ($('#seedB').val() > 0)) {

      //init setInterval again
      _blockCheck;

      $("#win").hide();
      $("#lose").hide();

      if((etherflip.stage() == 0) ) {

        //send bet
        etherflip.rand.sendTransaction(_seedB, {
          from: web3.eth.accounts[0],
          value: web3.toWei(_betValue, 'ether'),
          to: _contractAddress,
          gas: 500000,
          data: web3.fromAscii('Etheroll.com bet created at block ' + web3.eth.blockNumber)
        });

        //get latest block number
        _betBlockNumberDisplay = web3.eth.blockNumber;
        $( '#betBlockID' ).text(_betBlockNumberDisplay);

        //$( '#seedA_hashBlock' ).text(_betBlockNumberDisplay -1);
        //console.log("bet");

        //set result UI empty
        $("#result").val("");

        _blockCheck = setInterval(function () {genSeedC()}, _blockCheckIntervalWaitTime);

        //showLoading();

        //disableRoll();

        _blockNumberOriginal = web3.eth.blockNumber;



      }
      if((etherflip.stage() == 1) ) {

        //send bet
        etherflip.LateBets.sendTransaction(_seedB, {
          from: web3.eth.accounts[0],
          value: web3.toWei(_betValue, 'ether'),
          to: _contractAddress,
          gas: 500000,
          data: web3.fromAscii('Etheroll.com bet created at block ' + web3.eth.blockNumber)
        });


      }
      if((etherflip.stage() == 2) ){
        showLoading();
        disableRoll();
      }else{
        $('.generating-normal').show();
        enableRoll();
        hideLoading();
      }





      $('.bet-payout').removeClass('red');
      $('.bet-payout').removeClass('green');

      $("#seedA_hashSHA3").text('');

      showLoading();
      disableRoll();

    }

  });

  //reset when buton is clicked
  function genSeedC() {

    _blockNumber = web3.eth.blockNumber;
    _blocksToGo = _blockNumber - _blockNumberOriginal;
    _blocksToGoDisplay = _blockGoal - (_blockNumber - _blockNumberOriginal);
    $('#blocks-to-go').val(_blocksToGoDisplay + ' blocks to go...');



    if(_blocksToGo >= _blockGoal){

     //stop checking blocks
     clearInterval(_blockCheck);

      //reveal
      etherflip.LateBets.sendTransaction(_seedB,{from:web3.eth.accounts[0], to:_contractAddress, gas: 500000, data: web3.fromAscii('LateBets')});
      updateBalance();

      //init reveal number count
      _resetAndDisplayResult = setInterval(function(){ displayResult() }, _blockCheckIntervalWaitTime);

      _blockNumberRevealOriginal = web3.eth.blockNumber;

      _blocksToGo;
      _blockNumberOriginal;
      _blockNumber;

      getSeedAHash();

    }

    updateBalance();


  }

  function displayResult() {

    _blockNumberReveal = web3.eth.blockNumber;
    //console.log("Current block nunber #" + _blockNumberReveal);
    _blocksToGoReveal = _blockNumberReveal - _blockNumberRevealOriginal;
    _blocksToGoDisplayReveal = _blockGoal - (_blockNumberReveal - _blockNumberRevealOriginal);

    $('#blocks-to-go').val(_blocksToGoDisplayReveal + ' blocks to go...');

    console.log("stage - 0 waiting on blocks...");
    if(_blocksToGoReveal >= _blockGoal) {
      //displayResult
     etherflip.resetStage.sendTransaction({from:web3.eth.accounts[0], to:_contractAddress, gas: 200000});

      //stop checking blocks
      clearInterval(_resetAndDisplayResult);

      //init reveal number count
      _blockNumberResetOriginal = web3.eth.blockNumber;
      _resetGameUI = setInterval(function(){ resetGameUI() }, _blockCheckIntervalWaitTime);

      _blocksToGoReveal = _blockGoal;

      console.log("stage - 1 waiting on blocks...");

      //reload data - address, balance, blocknumber, timestamp
      loadData();
    }

    updateBalance();
  }

  function resetGameUI() {

      _blockNumberReset = web3.eth.blockNumber;
      _blocksToGoReset = _blockNumberReset - _blockNumberResetOriginal;
      _blocksToGoDisplayReset = _blockGoalReset - (_blockNumberReset - _blockNumberResetOriginal);

      $('#blocks-to-go').val(_blocksToGoDisplayReset + ' blocks to go...');

      $('.generating-confirm').show();

      console.log("stage - 2 waiting on blocks...");
      if (_blocksToGoReset >= _blockGoalReset) {
        etherflip.resetStage.sendTransaction({from:web3.eth.accounts[0], to:_contractAddress, gas: 200000});
        //reset UI
        loadData();
        hideLoading();

        //display win/no win UI
/*        if((_result > 49 && _seedB > 49) || (_result < 50 && _seedB < 50)){
          $("#win").show();
          $("#lose").hide();
          $('.bet-payout').removeClass('red');
          $('.bet-payout').addClass('green');
          //console.log('winner');
        }*/

/*        if((_result < 50 && _seedB > 50) || (_result > 50 && _seedB < 50)){
          $("#win").hide();
          $("#lose").show();
          $('.bet-payout').removeClass('green');
          $('.bet-payout').addClass('red');
          //console.log('loser');
        }*/

        //hide 'confirming'
        $('.generating-confirm').hide();

        //reset blocks waiting output
        $('#blocks-to-go').val('Waiting for blocks...');

        //display SeedA
        getSeedA();

        //stop checking blocks
        clearInterval(_resetGameUI);

        _blocksToGoReset = _blockGoalReset;

        enableRoll();

        console.log("stage - 0 bets paid - stage reset - game reset");
      }

    updateBalance();

  }


  //to do remove   - devonly
  $("#reset").click(function() {
    //reset etherflip state for bets
    displayResult();

  });

  function showLoading(){
    $('.generating-wait').show();
    $('.generating-normal').hide();
    $('.place-bet').addClass('red');
    $('.place-bet').removeClass('green');


  }

  function hideLoading(){
    $('.generating-normal').show();
    $('.generating-wait').hide();
    $('.place-bet').addClass('green');
    $('.place-bet').removeClass('red');
  }

  function disableRoll(){
    //when player submits kill ui, input etc

    //hide roll button
    $('#place-bet').attr('disabled','disabled');

    //disable inputs
    $("#the-bet").attr('disabled','disabled');
    $("#seedB").attr('disabled','disabled');
    $(".pre-paid").attr('disabled','disabled');


    //set bet slip to show locked in
    $('#title-bet-slip').removeClass('red');
    $('#title-bet-slip').addClass('green');

    updateBalance();
  }

  function enableRoll(){
    //when player submits kill ui, input etc
    $('#place-bet').show();

    //set bet slip to show locked in
    $('#title-bet-slip').removeClass('red');
    $('#title-bet-slip').removeClass('green');

    ////enable inputs
    $("#place-bet").removeAttr('disabled');
    $("#seedB").removeAttr('disabled');
    $(".pre-paid").removeAttr('disabled');
    $("#the-bet").removeAttr('disabled');

    updateBalance();

  }


});