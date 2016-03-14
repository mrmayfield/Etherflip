// <ORACLIZE_API>
/*
Copyright (c) 2015-2016 Oraclize srl, Thomas Bertani



Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:



The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.



THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

contract OraclizeI {
    address public cbAddress;
    function query(uint _timestamp, string _datasource, string _arg) returns (bytes32 _id);
    function query_withGasLimit(uint _timestamp, string _datasource, string _arg, uint _gaslimit) returns (bytes32 _id);
    function query2(uint _timestamp, string _datasource, string _arg1, string _arg2) returns (bytes32 _id);
    function query2_withGasLimit(uint _timestamp, string _datasource, string _arg1, string _arg2, uint _gaslimit) returns (bytes32 _id);
    function getPrice(string _datasource) returns (uint _dsprice);
    function getPrice(string _datasource, uint gaslimit) returns (uint _dsprice);
    function useCoupon(string _coupon);
    function setProofType(byte _proofType);
}
contract OraclizeAddrResolverI {
    function getAddress() returns (address _addr);
}
contract usingOraclize {
    uint constant day = 60*60*24;
    uint constant week = 60*60*24*7;
    uint constant month = 60*60*24*30;
    byte constant proofType_NONE = 0x00;
    byte constant proofType_TLSNotary = 0x10;
    byte constant proofStorage_IPFS = 0x01;
    uint8 constant networkID_mainnet = 1;
    uint8 constant networkID_testnet = 2;
    uint8 constant networkID_morden = 2;
    uint8 constant networkID_consensys = 161;

    OraclizeAddrResolverI OAR = OraclizeAddrResolverI(0x1d11e5eae3112dbd44f99266872ff1d07c77dce8);

    OraclizeI oraclize;
    modifier oraclizeAPI {
        oraclize = OraclizeI(OAR.getAddress());
        _
    }
    modifier coupon(string code){
        oraclize = OraclizeI(OAR.getAddress());
        oraclize.useCoupon(code);
        _
    }
    function oraclize_setNetwork(uint8 networkID) internal returns(bool){
        if (networkID == networkID_mainnet) OAR = OraclizeAddrResolverI(0x1d11e5eae3112dbd44f99266872ff1d07c77dce8);
        else if (networkID == networkID_testnet) OAR = OraclizeAddrResolverI(0x0ae06d5934fd75d214951eb96633fbd7f9262a7c);
        else if (networkID == networkID_consensys) OAR = OraclizeAddrResolverI(0x20e12a1f859b3feae5fb2a0a32c18f5a65555bbf);
        else return false;
        return true;
    }
    function oraclize_query(string datasource, string arg) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource);
        if (price > 1 ether + tx.gasprice*200000) return 0; // unexpectedly high price
        return oraclize.query.value(price)(0, datasource, arg);
    }
    function oraclize_query(uint timestamp, string datasource, string arg) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource);
        if (price > 1 ether + tx.gasprice*200000) return 0; // unexpectedly high price
        return oraclize.query.value(price)(timestamp, datasource, arg);
    }
    function oraclize_query(uint timestamp, string datasource, string arg, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource, gaslimit);
        if (price > 1 ether + tx.gasprice*gaslimit) return 0; // unexpectedly high price
        return oraclize.query_withGasLimit.value(price)(timestamp, datasource, arg, gaslimit);
    }
    function oraclize_query(string datasource, string arg, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource, gaslimit);
        if (price > 1 ether + tx.gasprice*gaslimit) return 0; // unexpectedly high price
        return oraclize.query_withGasLimit.value(price)(0, datasource, arg, gaslimit);
    }
    function oraclize_query(string datasource, string arg1, string arg2) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource);
        if (price > 1 ether + tx.gasprice*200000) return 0; // unexpectedly high price
        return oraclize.query2.value(price)(0, datasource, arg1, arg2);
    }
    function oraclize_query(uint timestamp, string datasource, string arg1, string arg2) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource);
        if (price > 1 ether + tx.gasprice*200000) return 0; // unexpectedly high price
        return oraclize.query2.value(price)(timestamp, datasource, arg1, arg2);
    }
    function oraclize_query(uint timestamp, string datasource, string arg1, string arg2, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource, gaslimit);
        if (price > 1 ether + tx.gasprice*gaslimit) return 0; // unexpectedly high price
        return oraclize.query2_withGasLimit.value(price)(timestamp, datasource, arg1, arg2, gaslimit);
    }
    function oraclize_query(string datasource, string arg1, string arg2, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        uint price = oraclize.getPrice(datasource, gaslimit);
        if (price > 1 ether + tx.gasprice*gaslimit) return 0; // unexpectedly high price
        return oraclize.query2_withGasLimit.value(price)(0, datasource, arg1, arg2, gaslimit);
    }
    function oraclize_cbAddress() oraclizeAPI internal returns (address){
        return oraclize.cbAddress();
    }
    function oraclize_setProof(byte proofP) oraclizeAPI internal {
        return oraclize.setProofType(proofP);
    }



    function parseAddr(string _a) internal returns (address){
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i=2; i<2+2*20; i+=2){
            iaddr *= 256;
            b1 = uint160(tmp[i]);
            b2 = uint160(tmp[i+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            iaddr += (b1*16+b2);
        }
        return address(iaddr);
    }


    function strCompare(string _a, string _b) internal returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
   }

    function indexOf(string _haystack, string _needle) internal returns (int)
    {
    	bytes memory h = bytes(_haystack);
    	bytes memory n = bytes(_needle);
    	if(h.length < 1 || n.length < 1 || (n.length > h.length))
    		return -1;
    	else if(h.length > (2**128 -1))
    		return -1;
    	else
    	{
    		uint subindex = 0;
    		for (uint i = 0; i < h.length; i ++)
    		{
    			if (h[i] == n[0])
    			{
    				subindex = 1;
    				while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex])
    				{
    					subindex++;
    				}
    				if(subindex == n.length)
    					return int(i);
    			}
    		}
    		return -1;
    	}
    }

    function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string _a, string _b, string _c) internal returns (string) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string _a, string _b) internal returns (string) {
        return strConcat(_a, _b, "", "", "");
    }

    // parseInt
    function parseInt(string _a) internal returns (uint) {
        return parseInt(_a, 0);
    }

    // parseInt(parseFloat*10^_b)
    function parseInt(string _a, uint _b) internal returns (uint) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i=0; i<bresult.length; i++){
            if ((bresult[i] >= 48)&&(bresult[i] <= 57)){
                if (decimals){
                   if (_b == 0) break;
                    else _b--;
                }
                mint *= 10;
                mint += uint(bresult[i]) - 48;
            } else if (bresult[i] == 46) decimals = true;
        }
        return mint;
    }



}
// </ORACLIZE_API>


contract Random is usingOraclize {

    event eventBetsOpen();

    event eventBetsOpen1();

    event eventBetsOpen2();

    event eventBetsClosed();

    event eventBetsDecided();

    event eventResetting();

    event eventReady();

    enum Stages {
        betsOpen,
        betsOpen1,
        betsOpen2,
        betsClosed,
        betsDecided,
        resetting
    }

    //this is the current stage.
    Stages public stage = Stages.betsOpen;

    modifier atStage(Stages _stage) {
        if (stage != _stage) throw;
        _
    }

    function nextStage() internal {
        stage = Stages(uint(stage) + 1);
    }

    //executed at init - sets the owner of the contract to creator
    function Random() {
        owner = msg.sender;
        oraclize_setNetwork(networkID_testnet);

    }

    //owner of the type - address
    address public owner;

    //block number at init
    uint blockNumberAtInit;

    uint public rewardValue;

    //win amount
    uint public amount;

    //seedA
    uint256 public seedA;

    //seedAHash
    bytes32 public seedAHash;

    //seedB
    uint public seedB;

    //luckyNumber
    uint public luckyNumber;

    //seedBHash
    bytes32 public seedBStage1Hash;

    //seedBStage2Hash
    bytes32 public seedBStage2Hash;

    //seedC
    uint256 public seedC;

    //result
    uint public dieResult;

    //high die result (50+)
    bool public high;

    //win state
    bool public win;

    //msg.sender
    address public msgSender;

    //turns input data into a 100-sided 'die' by dividing by ceil(2 ^ 256 / 100)
    uint256 public FACTOR = 1157920892373161954235709850086879078532699846656405640394575840079131296399;

    //betters
    //create an array of struct Funder
    Funder[] public funders;

    struct Funder {
        address addr;
        uint amount;
        uint Number;
    }

    uint arrayLength;
    uint playerNumber;
    uint theAmount;
    uint theReward;
    address theAddress;
    uint betValue;


    //initialSeed
    bool initialSeedSet = false;
    address seedInitAddress;

    bool acceptNoMoreBets;

    uint initialBalance;
    uint maxBet;

    uint public random;

    //accept new entrant
    function newEntrant( uint seedBUserParam ){


            arrayLength = funders.length;

            //is this the first player in the betting round?
            if(stage == Stages(uint(0))){
                seedB = seedBUserParam;
            }

            //continue if we are stage 0
            if(stage != Stages(uint(0))){

                            //only submit if entrants array not full
                            if(arrayLength < 3){

                                //max bet is 5% of house bank
                                if(msg.value <= (this.balance*5)/100){
                                    luckyNumber = seedBUserParam;
                                    betValue = msg.value;
                                    //rewardValue = (betValue)+(betValue*98/100);
                                    funders.push( Funder({addr: msg.sender, amount: betValue, Number: luckyNumber}));
                                }

                                //quietly refund bet if is >5% of house bank
                                if(msg.value > (this.balance*5)/100){
                                    msg.sender.send(msg.value);
                                }
                            }

            }


            if(stage != Stages(uint(1))){

                            //only submit if entrants array not full
                            if(arrayLength < 3){

                                //max bet is 5% of house bank
                                if(msg.value <= (this.balance*5)/100){
                                    luckyNumber = seedBUserParam;
                                    betValue = msg.value;
                                    //rewardValue = (betValue)+(betValue*98/100);
                                    funders.push( Funder({addr: msg.sender, amount: betValue, Number: luckyNumber}));
                                }

                                //quietly refund bet if is >5% of house bank
                                if(msg.value > (this.balance*5)/100){
                                    msg.sender.send(msg.value);
                                }
                            }

            }


            //quietly refund bet if stage 2 - precautionary
            if(stage == Stages(uint(2))){
                msg.sender.send(msg.value);
            }

            //quietly refund bet if stage 3 - precautionary
            if(stage == Stages(uint(3))){
                msg.sender.send(msg.value);
            }

            //quietly refund bet if stage 4 - precautionary
            if(stage == Stages(uint(4))){
                msg.sender.send(msg.value);
            }

            //quietly refund bet if stage 5 - precautionary
            if(stage == Stages(uint(5))){
                msg.sender.send(msg.value);
            }

            //quietly refund bet if entrant array full - keeping gas cost down for reveal fun
            if(arrayLength > 2){
                msg.sender.send(msg.value);
            }


    }

    //generate random number
    function rand() atStage(Stages.betsOpen){

            //get hash of parent block for seedA
            uint lastBlockNumberA = block.number - 1;
            uint256 lastBlockHashValA = uint256(block.blockhash(lastBlockNumberA));

            seedA = lastBlockHashValA;

            //provably fair - as can be checked after result
            seedAHash = sha3(seedA);

        nextStage();
        eventBetsOpen1();
    }

    //waiting
    function betsOpen1() atStage(Stages.betsOpen1){
        nextStage();
        eventBetsOpen2();
    }

    //waiting still
    function betsOpen2() atStage(Stages.betsOpen2){
        nextStage();
        eventBetsClosed();
    }

    //generate random number
    function reveal() atStage(Stages.betsClosed) returns (uint256){

            //get hash of parent block for seedC
            //uint256 lastBlockNumberC = block.number-1;

            //uint256 lastBlockHashValC = uint256(block.blockhash(lastBlockNumberC));
            //seedC = lastBlockHashValC;

            //oraclize_query("URL", "https://api.random.org/json-rpc/1/invoke", strConcat('\n{"jsonrpc":"2.0","method":"generateIntegers","params":{"apiKey":"', "9fc456ad-57ec-46f2-858c-0949de861c1e", '","n":1,"min":1,"max":100},"id":1}'), 300000);
            oraclize_query("URL", "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new", 500000);
            //result
            //dieResult = (uint256(seedA + seedB + seedC) / FACTOR) +1;




    }

    function betsDecided() atStage(Stages.betsDecided){
        nextStage();
        eventResetting();
    }


    function resetStage() atStage(Stages.resetting) {
        blockNumberAtInit;
        initialSeedSet = false;
        eventReady();
        stage = Stages(uint(0));
    }




function __callback(bytes32 id, string result) {
    if (msg.sender != oraclize_cbAddress()) throw;

        uint dieResult = parseInt(result);
        //dieResult = getRequestsLeft(result);
        //high result boolean
            if(dieResult >= 51){

                //payWinners
                arrayLength = funders.length;
                uint i;

                for (i = 0; i < arrayLength; i++) {
                    playerNumber = funders[i].Number;
                    theReward =  funders[i].amount + (funders[i].amount*98/100);
                    theAddress = funders[i].addr;
                    if(playerNumber >= 51){
                        theAddress.send(theReward);
                    }
                }

                delete funders;
                eventBetsDecided();
                stage = Stages(uint(4));
            }

            //low result boolean
            if(dieResult <= 50){

                //payWinners
                arrayLength = funders.length;
                i;

                for (i = 0; i < arrayLength; i++) {
                    playerNumber = funders[i].Number;
                    theReward =  funders[i].amount + (funders[i].amount*98/100);
                    theAddress = funders[i].addr;
                    if(playerNumber <= 50){
                        theAddress.send(theReward);
                    }
                }

                delete funders;
                eventBetsDecided();
                stage = Stages(uint(4));
            }

  }


    function getStage() returns (Stages)
    {
        return stage;
    }

    function getSeedA() returns (uint256)
    {
        return seedA;
    }

    function getSeedC() returns (uint256)
    {
         if (msg.sender == owner){
             return seedC;
         }
    }

    function getSeedAHash() returns (bytes32)
    {
        return seedAHash;
    }

    function getDieResult() returns (uint256)
    {
        return dieResult;
    }

    function ownerResetGame()
    {
        if (msg.sender == owner){

            //reset stages
            stage = Stages(uint(0));

            //refundBets
            arrayLength = funders.length;
            uint i;

            for (i = 0; i < arrayLength; i++) {
                theAmount = funders[i].amount;
                theAddress = funders[i].addr;
                theAddress.send(theAmount);
            }

            delete funders;
            stage = Stages(uint(0));

        }

    }

    //recover total contract balance to owner of contract (creator)
    function kill() { if (msg.sender == owner) suicide(owner); }


}