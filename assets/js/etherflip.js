
if(typeof web3 !== 'undefined')
  web3 = new Web3(web3.currentProvider);
else
  web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));


/*


 event eventBetsOpen();
 //accept bets
 //move to next

 event eventBetsOpen1();
 //accept bets
 //move to next

 event eventBetsOpen2();
 //accept bets
 //move to next

 event eventBetsOpen3();
 //accept bets
 //move to next

 event eventBetsClosed();
 //show loading
 //disable roll
 //move to next

 event eventBetsDecided();
 //show loading
 //disable roll
 //display win

 event eventReadyForNewPlayers();
  //hide loading
  //enable roll


 */


$(document).ready(function() {

  var _contractAddress = '0x83418de0901b69ab7d51f7a008cc3d8a71a133c6';
  //contract abi
  var abi = [{"constant":false,"inputs":[],"name":"getSeedAHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"betsOpen1","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"rewardValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getDieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"betsOpen2","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"seedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"FACTOR","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedBStage1Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"rand","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"seedBUserParam","type":"uint256"}],"name":"newEntrant","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"seedAHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"win","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedA","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"resetStage","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"high","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"reveal","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedBStage2Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedB","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"luckyNumber","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[],"name":"betsDecided","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"msgSender","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedA","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"funders","outputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"},{"name":"Number","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"ownerResetGame","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getStage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[],"name":"eventBetsOpen","type":"event"},{"anonymous":false,"inputs":[],"name":"eventBetsOpen1","type":"event"},{"anonymous":false,"inputs":[],"name":"eventBetsOpen2","type":"event"},{"anonymous":false,"inputs":[],"name":"eventBetsClosed","type":"event"},{"anonymous":false,"inputs":[],"name":"eventBetsDecided","type":"event"},{"anonymous":false,"inputs":[],"name":"eventResetting","type":"event"},{"anonymous":false,"inputs":[],"name":"eventReady","type":"event"}];

  //creation of contract object
  var _etherFlip = web3.eth.contract(abi);
  //initiate contract for an address
  var etherflip = _etherFlip.at(_contractAddress);

  var _betValue;
  var _betChoice;
  var _result;
  var _blockNumber;
  var _blockNumberDisplay;
  var _blockTimeStamp;
  var _account;
  var _balance;
  var _balanceDisplay;
  var _seedAHash;
  var _seedA;
  var _seedB;
  var _seedBInput;

  //event listeners for contract broadcast events
  var _eventBetsOpen = etherflip.eventBetsOpen();
  var _eventBetsOpen1 = etherflip.eventBetsOpen1();
  var _eventBetsOpen2 = etherflip.eventBetsOpen2();
  var _eventBetsClosed = etherflip.eventBetsClosed();
  var _eventBetsDecided = etherflip.eventBetsDecided();
  var _eventResetting =  etherflip.eventResetting();
  var _eventReady = etherflip.eventReady();

  var _isPlayer = false;

  //gas to use
  var _stateChangeGas = 50000;
  var _randStageGas = 100000;
  var _revealStageGas = 500000;
  var _resetStageGas = 60000;

  var _maxBet;


  //_animResult  = setInterval(function () {_animResults()}, 3000);

  //change bets UI
  var myInput = $('#the-bet');
  myInput.keyup(function() {
    _betValue = $(this).val();
    $(".bet-amount").val(myInput.val());
    $(".bet-payout").val((myInput.val()*198)/100);
  });

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
        ($('#the-bet').val() > 0) &&
        ($('#seedB').val() > 0) &&
        ($('#seedB').val() < 101)
    ){

      //send bet
      etherflip.newEntrant.sendTransaction(
          _seedB, {
            from: web3.eth.accounts[0],
            value: web3.toWei(_betValue, 'ether'),
            to: _contractAddress,
            gas: 500000
          }
      );


      $("#win").hide();
      $("#lose").hide();


      $('.bet-payout').removeClass('red');
      $('.bet-payout').removeClass('green');

      $("#seedA_hashSHA3").text('');

      showLoading();
      disableRoll();

      etherflip.rand.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _randStageGas});

      _isPlayer = true;

      $(".warning-max-bet").hide();

      $('#betBlockID').text("");
      $('#seedAHash').text("" );
      $('#seedAHash').text("");
    }

    if($('#the-bet').val() > _maxBet ){
      $(".warning-max-bet").show();
    }


  });

  _eventBetsOpen1.watch(function(error, result){
    if (!error)
      if(_isPlayer == true) {
        etherflip.betsOpen1.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _stateChangeGas});
      }

      //get latest block timestamp
      //_blockTimeStamp =  web3.eth.getBlock(_blockNumberDisplay [timestamp]);

      //get latest block number
      _blockNumberDisplay = web3.eth.blockNumber-1;
      $('#betBlockID').text( _blockNumberDisplay);


      $('#blocks-to-go').val('Generating 3 blocks...');
      $('.stageOutput').html('_eventBetsOpen1');
      getSeedAHash();
  });

  _eventBetsOpen2.watch(function(error, result){
    if (!error)
      if(_isPlayer == true) {
        etherflip.betsOpen2.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _stateChangeGas});
      }
      $('#blocks-to-go').val('No more bets please...');
      $('.stageOutput').html('_eventBetsOpen2');
      getSeedAHash();
      showLoading();
      disableRoll();
  });

  _eventBetsClosed.watch(function(error, result){
    if (!error)
      if(_isPlayer == true) {
        etherflip.reveal.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _revealStageGas});
      }
      $('#blocks-to-go').val('Rolling up...');
      $('.stageOutput').html('_eventBetsClosed  - call reveal func()');
      //clearInterval(_animResult);
      getSeedAHash();
      showLoading();
      disableRoll();
  });

  _eventBetsDecided.watch(function(error, result){
  if (!error)

    getSeedA();
    getSeedAHash();
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

    if(_isPlayer == true) {
      etherflip.betsDecided.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _stateChangeGas});
    }
    $('#blocks-to-go').val('Paying winners...');
    $('.stageOutput').html('_eventBetsDecided  - update result and pay winners');

  });

  _eventResetting.watch(function(error, result){
    if (!error)
      getSeedAHash();
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
      etherflip.resetStage.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: _resetStageGas});
    }
    _isPlayer = false;
  });

  _eventReady.watch(function(error, result){
    if (!error)
      $('.stageOutput').html('ready for new bets - stage 0');
      hideLoading();
      enableRoll();
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
  function getSeedAHash(){
    _seedAHash = etherflip.getSeedAHash.call();
    $("#seedA_hashSHA3").text(_seedAHash);
  }

  function getSeedA(){
    _seedA = etherflip.getSeedA.call();
    //var theSeedA = _seedA.plus(21).toString(10);
    $("#seedA").text(_seedA);
  }

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