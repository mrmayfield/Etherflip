
if(typeof web3 !== 'undefined')
  web3 = new Web3(web3.currentProvider);
else
  web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));


$(document).ready(function() {

  var _contractAddress = '0xbd6c556053edfa9010f2a89bc3ee1fc2a1f8dc68';
  //contract abi
  var abi = [{"constant":false,"inputs":[],"name":"getSeedAHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"rewardValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getDieResult","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"FACTOR","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedBStage1Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"rand","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"seedBUserParam","type":"uint256"}],"name":"newEntrant","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"seedAHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"win","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedB","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedA","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"resetStage","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedBStage1Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"high","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedC","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedBStage2Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"getNumberAtPosition","type":"uint256"}],"name":"getEntrants","outputs":[{"name":"entrantInfo","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"seedB","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getSeedBStage2Hash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"luckyNumber","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"seedBUserParam2","type":"uint256"}],"name":"reveal","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"msgSender","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"funders","outputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"},{"name":"Number","type":"uint256"},{"name":"rewardValue","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"ownerResetGame","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getStage","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[],"name":"Stage0BetsOpen","type":"event"},{"anonymous":false,"inputs":[],"name":"Stage1BetsOpen","type":"event"},{"anonymous":false,"inputs":[],"name":"Stage1BetsClosed","type":"event"},{"anonymous":false,"inputs":[],"name":"Stage1BetsDecided","type":"event"},{"anonymous":false,"inputs":[],"name":"readyForNewPlayers","type":"event"}];


  //creation of contract object
  var _etherFlip = web3.eth.contract(abi);
  //initiate contract for an address
  var etherflip = _etherFlip.at(_contractAddress);

  var _betValue;
  var _betChoice;
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
  var _betBlockNumberDisplay;
  var _seedB;
  var _seedBInput;


  var _Stage0BetsOpen = etherflip.Stage0BetsOpen();
  var _Stage1BetsClosed = etherflip.Stage1BetsClosed();
  var _Stage1BetsDecided = etherflip.Stage1BetsDecided();
  var _readyForNewPlayers =  etherflip.readyForNewPlayers();



  //change bets UI
  var myInput = $('#the-bet');
  myInput.keyup(function() {
    _betValue = $(this).val();
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

    console.log( "stage= " + etherflip.stage())

    //if bet number and bet value is within range
    if(($('#the-bet').val() != '') && ($('#seedB').val() != '') && ($('#the-bet').val() < 101) && ($('#seedB').val() < 101)  && ($('#the-bet').val() > 0) && ($('#seedB').val() > 0)) {

        //send bet

      etherflip.newEntrant.sendTransaction(_seedB, {from: web3.eth.accounts[0],value: web3.toWei(_betValue, 'ether'), to: _contractAddress, gas: 500000, data: web3.fromAscii('Etheroll.com bet created at block ' + web3.eth.blockNumber)});

        //etherflip.rand.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: 500000, data: web3.fromAscii('Etheroll.com bet created at block ' + web3.eth.blockNumber)});
        //etherflip.reveal.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: 500000, data: web3.fromAscii('Etheroll.com bet created at block ' + web3.eth.blockNumber)});



        //get latest block number
        _betBlockNumberDisplay = web3.eth.blockNumber;
        $( '#betBlockID' ).text(_betBlockNumberDisplay);

        //set result UI empty
        $("#result").val("");

        _blockNumberOriginal = web3.eth.blockNumber;

      $("#win").hide();
      $("#lose").hide();

      _blockNumber = web3.eth.blockNumber;
      _blocksToGo = _blockNumber - _blockNumberOriginal;
      _blocksToGoDisplay = 2 - (_blockNumber - _blockNumberOriginal);

      $('.bet-payout').removeClass('red');
      $('.bet-payout').removeClass('green');

      $("#seedA_hashSHA3").text('');

      showLoading();
      disableRoll();

      setTimeout(rand, 30000);



    }

  });

function rand(){
  etherflip.rand.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: 500000});
}

  // watch for changes
  _Stage0BetsOpen.watch(function(error, result){
    if (!error)
      disableRoll();
      showLoading();
      //optimise / strengthen this!!
      setTimeout(etherflip.reveal.sendTransaction(1,{from: web3.eth.accounts[0],to: _contractAddress,gas: 500000}), 30000);

      $('#blocks-to-go').val('Rolling up...');
  });

  // watch for changes
  _Stage1BetsClosed.watch(function(error, result){
    if (!error)
      $('#blocks-to-go').val('No more bets please...');
      disableRoll();
      showLoading();
      etherflip.resetStage.sendTransaction({from: web3.eth.accounts[0], to: _contractAddress, gas: 500000});

      //update GUI
      getSeedA();
      updateBalance();
      loadData();

      //WINNERS
      if ((_result > 49 && _seedB > 49) || (_result < 50 && _seedB < 50)) {
        $("#win").show();
        $("#lose").hide();
        $('.bet-payout').removeClass('red');
        $('.bet-payout').addClass('green');
        $('#result').addClass('highlight');
      }

      if ((_result < 50 && _seedB > 50) || (_result > 50 && _seedB < 50)){
        $("#win").hide();
        $("#lose").show();
        $('.bet-payout').removeClass('green');
        $('.bet-payout').addClass('red');
        $('#result').addClass('highlight-red');
      }

  });

  _Stage1BetsDecided.watch(function(error, result){
    if (!error)
      disableRoll();
      showLoading();
      etherflip.reveal.sendTransaction(10, {from: web3.eth.accounts[0],to: _contractAddress,gas: 500000,data: web3.fromAscii('LateBets')});
      $('#blocks-to-go').val('Paying winners...');

  });


  _readyForNewPlayers.watch(function(error, result){
    if (!error)
      enableRoll();
      hideLoading();
      loadData();
    $('#blocks-to-go').val('Accepting final bets...');
    $('#result').removeClass('highlight');
    $('#result').removeClass('highlight-red');
  });


  //to do remove   - devonly
  $("#reset").click(function() {
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
    $("#result").val(_result);
  }

  //get latest getSeedAHash
  function getSeedAHash(){
    _seedAHash = etherflip.getSeedAHash.call();
    $("#seedA_hashSHA3").text(_seedAHash);
  }

  function getSeedA(){
    _seedA = etherflip.getSeedA.call();
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
    var _balanceDisplayDecimalSplit = str.split(".");
    var _balanceDisplayDecimal = _balanceDisplayDecimalSplit[0];

    $('.balance').text(_balanceDisplayDecimal);

    var _accountEtheroll = web3.eth.getBalance(_contractAddress);

    _accountEtherollDisplay = _accountEtheroll*.000000000000000001;

    var str = _accountEtherollDisplay.toString(10);
    var _accountEtherollDisplayDecimalSplit = str.split(".");
    var _accountEtherollDisplayDecimal = _accountEtherollDisplayDecimalSplit[0];

    $('.balance-etheroll').text(_accountEtherollDisplayDecimal);

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
  }

  //reset when buton is clicked
  function clearAll() {
    _account = "";
    _balance = "";
    _blockNumberDisplay = "";
    _blockTimeStamp = "";

  }

});