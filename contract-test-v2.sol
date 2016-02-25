contract Random{

    event eventBetsOpen();

    event eventBetsOpen1();
    
    event eventBetsOpen2();    
    
    event eventBetsOpen3();        

    event eventBetsClosed();

    event eventBetsDecided();

    event eventResetting();

    event eventReady();

    enum Stages {
        betsOpen,
        betsOpen1,        
        betsOpen2,         
        betsOpen3,         
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
    function Random() { owner = msg.sender; }

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
    uint256 public dieResult;

    //high die result (49+)
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


    //initialSeed
    bool initialSeedSet = false;
    address seedInitAddress;

    bool acceptNoMoreBets;

    //accept new entrant
    function newEntrant( uint seedBUserParam ){
        
        
            arrayLength = funders.length;
        
            //is this the fist player?
            if(stage == Stages(uint(0))){
                seedB = seedBUserParam;
            }

            //only submit if we are not in stage betsClosed
            if(stage != Stages(uint(4))){

                //only submit if entrants array not full
                if(arrayLength < 3){
                    
                    //is bet within limit?
                    if(msg.value < 3 ether ){
                        luckyNumber = seedBUserParam;
                        uint betValue = msg.value;
                        //rewardValue = (betValue)+(betValue*98/100);
                        funders.push( Funder({addr: msg.sender, amount: betValue, Number: luckyNumber}));
                    }
                }

            }
            
            //quietly refund bet if stage 4
            if(stage == Stages(uint(4))){
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
            uint256 lastBlockNumberA = block.number - 1;
            uint256 lastBlockHashValA = uint256(block.blockhash(lastBlockNumberA));

            seedA = lastBlockHashValA;

            //provably fair - as can be checked after result
            seedAHash = sha3(seedA);

            //ensure stage 2 seedB equals stage 1 seedB
            seedBStage1Hash = sha3(seedB);

        nextStage();
        
        //what does client do at this event?
        eventBetsOpen1();
    }
    
    //waiting
    function betsOpen1() atStage(Stages.betsOpen1){
        nextStage();
        
        //what does client do at this event?
        eventBetsOpen2();
    }  
    
    //waiting still
    function betsOpen2() atStage(Stages.betsOpen2){
        nextStage();
        
        //what does client do at this event?
        eventBetsOpen3();
    }  
    
    function betsOpen3() atStage(Stages.betsOpen3){
        nextStage();
        
        //what does client do at this event?
        eventBetsClosed();
    }       

    //generate random number
    function reveal() atStage(Stages.betsClosed) returns (uint256){


        //if (block.number >= blockNumberAtInit+2){

            //get hash of parent block for seedC
            uint256 lastBlockNumberC = block.number - 1;

            uint256 lastBlockHashValC = uint256(block.blockhash(lastBlockNumberC));
            seedC = lastBlockHashValC;

            //result
            dieResult = (uint256(seedA + seedB + seedC) / FACTOR) +1;

            //high result boolean
            if(dieResult > 49){

                //payWinners
                arrayLength = funders.length;
                uint i;

                for (i = 0; i < arrayLength; i++) {
                    playerNumber = funders[i].Number;
                    theReward =  funders[i].amount + (funders[i].amount*98/100);
                    theAddress = funders[i].addr;
                    if(playerNumber > 49){
                        theAddress.send(theReward);
                    }
                }

                delete funders;
                eventBetsDecided();
                nextStage();
            }

            //low result boolean
            if(dieResult < 50){

                //payWinners
                arrayLength = funders.length;
                i;

                for (i = 0; i < arrayLength; i++) {
                    playerNumber = funders[i].Number;
                    theReward =  funders[i].amount + (funders[i].amount*98/100);
                    theAddress = funders[i].addr;
                    if(playerNumber < 50){
                        theAddress.send(theReward);
                    }
                }

                delete funders;
                eventBetsDecided();
                nextStage();


            }
        //}
    }
    
    function betsDecided() atStage(Stages.betsDecided){
        nextStage();
        
        //what does client do at this event?
        eventResetting();
    }     


    function resetStage() atStage(Stages.resetting) {
        blockNumberAtInit;
        //if ( block.number > blockNumberAtDecide + 2){
        initialSeedSet = false;
        eventReady();
        stage = Stages(uint(0));

        //}
    }
    


    //getters
    //to do - remove dangerous ones

    function getEntrants(uint getNumberAtPosition) constant returns (uint entrantInfo){

        return funders[getNumberAtPosition].Number;

    }


    function getStage() returns (Stages)
    {
        return stage;
    }

    //todo remove - important
    function getSeedA() returns (uint256)
    {
        return seedA;
    }

    function getSeedAHash() returns (bytes32)
    {
        return seedAHash;
    }

    function getSeedB() returns (uint256)
    {
        return seedB;
    }

    function getSeedBStage1Hash() returns (bytes32)
    {
        return seedBStage1Hash;
    }

    function getSeedBStage2Hash() returns (bytes32)
    {
        return seedBStage2Hash;
    }

    function getSeedC() returns (uint256)
    {
        if (msg.sender == owner) return seedC;
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
                if(playerNumber < 50){
                    theAddress.send(theAmount);
                }

            }

            delete funders;
            stage = Stages(uint(0));

        }

    }

    //recover total contract balance to owner of contract (creator)
    function kill() { if (msg.sender == owner) suicide(owner); }

}