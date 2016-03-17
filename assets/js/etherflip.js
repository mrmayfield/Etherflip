
/*if(typeof web3 !== 'undefined')
 web3 = new Web3(web3.currentProvider);
 else
 web3 = new Web3(new web3.providers.HttpProvider("http://localhost:8545"));*/


if(typeof web3 !== 'undefined')
  web3 = new Web3(web3.currentProvider);
else
  web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));


$(document).ready(function() {

  var _contractAddress = '0xaf8c0e63f704393ce250d9c84bb4090f731eefdf';
  //contract abi
  var abi = [{"constant":true,"inputs":[],"name":"rewardValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getDieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"seedBUserParam","type":"uint256"}],"name":"newEntrant","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"win","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"random","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"resetStage","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"high","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"getNumberAtPosition","type":"uint256"}],"name":"getEntrants","outputs":[{"name":"entrantInfo","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"luckyNumber","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[],"name":"betsDecided","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"msgSender","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"funders","outputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"},{"name":"Number","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"ownerResetGame","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getNumber","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getStage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[],"name":"eventBetsOpen","type":"event"},{"anonymous":false,"inputs":[],"name":"eventBetsClosed","type":"event"},{"anonymous":false,"inputs":[],"name":"eventBetsDecided","type":"event"},{"anonymous":false,"inputs":[],"name":"eventResetting","type":"event"},{"anonymous":false,"inputs":[],"name":"eventReady","type":"event"}];

  //creation of contract object
  var _etherFlip = web3.eth.contract(abi);
  //initiate contract for an address
  var etherflip = _etherFlip.at(_contractAddress);

  var _betValue;
  var _result;
  var _account;
  var _balance;
  var _balanceDisplay;
  var _seedB;
  var _seedBInput;

  //event listeners for contract broadcast events
  var _eventBetsOpen = etherflip.eventBetsOpen();
  var _eventBetsClosed = etherflip.eventBetsClosed();
  var _eventBetsDecided = etherflip.eventBetsDecided();
  var _eventResetting =  etherflip.eventResetting();
  var _eventReady = etherflip.eventReady();

  var _isPlayer = false;

  //gas to use
  var _stateChangeGas = 50000;
  var _getNumberStageGas = 50000;
  var _betsDecidedGas = 300000;
  var _resetStageGas = 90000;

  var _maxBet;
  var _minBet = 0.5;


  //pre-selected bet values
  $(".pre-paid").click(function() {
    _betValue = $(this).val();
    $(".bet-amount").val(_betValue);
    $(".bet-payout").val((_betValue*198)/100);
  });


  //pre-selected roll values
  $(".bet-choice").click(function() {
    _seedB = $(this).val();
    $("#bet-number").val(_seedB);
    $("#seedB").val(_seedB);
  });

  //change bets UI
  /*  var myInput = $('#the-bet');
   myInput.keyup(function() {
   _betValue = $(this).val();
   $(".bet-amount").val(myInput.val());
   $(".bet-payout").val((myInput.val()*198)/100);
   });*/

  //change bets UI
  $("#the-bet").change(function() {
    _betValue = $(this).val();
    $(".bet-amount").val(_betValue);
    $(".bet-payout").val((_betValue*198)/100);
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

  if(etherflip.stage() !=  0 ) {
    $('.generating-normal').hide();
    $('.generating-wait').show();
    disableRoll();
    showLoading();
  }
  else{
    hideLoading();
  }

  loadData();

  //place bet
  $("#place-bet").click(function() {

    //if bet number and bet value is within range
    if(
        ($('#the-bet').val() != '') &&
        ($('#seedB').val() != '') &&
        ($('#the-bet').val() <= _maxBet) &&
        ($('#seedB').val() < 101)  &&
        ($('#the-bet').val() >= _minBet) &&
        ($('#seedB').val() > 0) &&
        ($('#seedB').val() < 101)
    ){

      //send bet
      etherflip.newEntrant.sendTransaction(
          _seedB, {
            from: web3.eth.accounts[0],
            value: web3.toWei(_betValue, 'ether'),
            to: _contractAddress,
            gas: 500000,
            data: web3.fromAscii('N: ' +  _seedB)
          }
      );


      $("#win").hide();
      $("#lose").hide();


      $('.bet-payout').removeClass('red');
      $('.bet-payout').removeClass('green');

      showLoading();
      disableRoll();

      //etherflip.rand.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _randStageGas});

      _isPlayer = true;

      $(".warning-max-bet").hide();
      $(".warning-min-bet").hide();

    }

    if($('#the-bet').val() > _maxBet ){
      $(".warning-max-bet").show();
    }

    if($('#the-bet').val() < _minBet ){
      $(".warning-min-bet").show();
    }


  });


  _eventBetsClosed.watch(function(error, result){
    if (!error)
      if(_isPlayer == true) {
        etherflip.getNumber.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _getNumberStageGas});
      }
    $('#blocks-to-go').val('Rolling up...');
    $('.stageOutput').html('_eventBetsClosed  - call reveal func()');
    //clearInterval(_animResult);

    showLoading();
    disableRoll();
    /*$('body').addClass('red-bkgd');*/
  });

  _eventBetsDecided.watch(function(error, result){
    if (!error)
    //update GUI
    updateBalance();
    loadData();

    //WINNERS
    if ((_result >= 51 && _seedB >= 51) || (_result <= 50 && _seedB <= 50) && (_isPlayer == true)) {
      $("#win").show();
      $("#lose").hide();
      $('.bet-payout').removeClass('red');
      $('.bet-payout').addClass('green');
      $('.odometer').addClass('highlight');
      $('.odometer').addClass('green');
      $('.odometer').addClass('green-border');
    }

    if ((_result <= 50 && _seedB >= 51) || (_result >= 51 && _seedB <= 50) && (_isPlayer == true)){
      $("#win").hide();
      $("#lose").show();
      $('.bet-payout').removeClass('green');
      $('.bet-payout').addClass('red');
      $('.odometer').addClass('highlight-red');
      $('.odometer').addClass('red');
      $('.odometer').addClass('red-border');
    }

    /*if(_isPlayer == true) {
      etherflip.betsDecided.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _stateChangeGas, data: web3.fromAscii('N: ' +  _seedB + 'R: ' + _result)});
    }*/
    $('#blocks-to-go').val('Paying winners...');
    $('.stageOutput').html('_eventBetsDecided  - update result and pay winners');
    /*$('body').addClass('green-bkgd');*/

    if(_isPlayer == true) {
      etherflip.betsDecided.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _betsDecidedGas});
    }
  });

  _eventResetting.watch(function(error, result){
    if (!error)

    $('#blocks-to-go').val('Preparing new game...');
    $('.stageOutput').html('_eventReadyForNewPlayers');
    //$('#blocks-to-go').val('Accepting final bets...');
    $('.odometer').removeClass('highlight');
    $('.odometer').removeClass('highlight-red');
    $('.odometer').removeClass('green');
    $('.odometer').removeClass('red');
    $('.odometer').removeClass('green-border');
    $('.odometer').removeClass('red-border');
    if(_isPlayer == true) {
      etherflip.resetStage.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _resetStageGas, data: web3.fromAscii('N: ' +  _seedB + 'R: ' + _result)});
      updateBalance();
    }
    _isPlayer = false;
  });

  _eventReady.watch(function(error, result){
    if (!error)
    hideLoading();
    enableRoll();
    updateBalance();
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
    $('.place-bet').removeClass('red');
  }

  function disableRoll(){

    //hide roll button
    $('#place-bet').attr('disabled','disabled');

    //disable inputs
    $("#the-bet").attr('disabled','disabled');
    $("#seedB").attr('disabled','disabled');
    $(".pre-paid").attr('disabled','disabled');
    //set bet slip to show locked in
    $('#title-bet-slip').removeClass('red');
    $('#title-bet-slip').addClass('green');
    $('input').addClass('not-allowed');
    $('button').addClass('not-allowed');

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
    $('input').removeClass('not-allowed');
    $('button').removeClass('not-allowed');
    updateBalance();

  }






  //GENERIC FUNCTIONS

  //get result of die
  function getDieResult(){
    //get latest result
    _result = etherflip.dieResult.call();
    //display result
    //$("#result").val(_result);
    $('.odometer').html(_result);
  }

  //get latest getSeedAHash
/*  function getSeedAHash(){
    _seedAHash = etherflip.getSeedAHash.call();
    $("#seedA_hashSHA3").text(_seedAHash);
  }*/

/*  function getSeedA(){
    _seedA = etherflip.getSeedA.call();
    //var theSeedA = _seedA.plus(21).toString(10);
    $("#seedA").text(_seedA);
  }*/

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
    //var _balanceDisplayDecimalSplit = str.split(".");
    //var _balanceDisplayDecimal = _balanceDisplayDecimalSplit[0];

    $('.balance').text(_balanceDisplay);

    var _accountEtheroll = web3.eth.getBalance(_contractAddress);

    _accountEtherollDisplay = _accountEtheroll*.000000000000000001;

    var str = _accountEtherollDisplay.toString(10);
    //var _accountEtherollDisplayDecimalSplit = str.split(".");
    //var _accountEtherollDisplayDecimal = _accountEtherollDisplayDecimalSplit[0];

    //$('.balance-etheroll').text(str);

    _maxBet = Math.floor(_accountEtherollDisplay*5/100);

    $('.max-bet').text(_maxBet);

    getDieResult();

  }


  function updateBalance() {
    //get account
    _account = web3.eth.coinbase;
    _balanceDisplay = _balance*.000000000000000001;

    var str = _balanceDisplay.toString(10);
    //var _balanceDisplayDecimalSplit = str.split(".");
    //var _balanceDisplayDecimal = _balanceDisplayDecimalSplit[0];

    $('.balance').text(str);
  }



});