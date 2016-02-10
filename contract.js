contract Random{
    
    enum Stages {
        AcceptingBets,
        Reveal,
        Finished
    }
    
    // This is the current stage.
    Stages public stage = Stages.AcceptingBets;
    
    modifier atStage(Stages _stage) {
        if (stage != _stage) throw;
        _
    }
    
    function nextStage() internal {
        stage = Stages(uint(stage) + 1);
    }
    
    function sendToFinishStage() internal {
        stage = Stages(uint(stage) + 2);
    }
    
    //executed at init - sets the owner of the contract to creator
    function Random() { owner = msg.sender; }
    
    //owner of the type - address
    address public owner;
    
    uint256 public rewardValue;
    
    //win amount
    uint public amount;
    
    //seedA
    uint256 internal seedA; 
    
    //seedAHash
    bytes32 public seedAHash;     
    
    //seedB
    uint256 public seedB;

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
    
    //turns input data into a 100-sided 'die' by dividing by ceil(2 ^ 256 / 100)
    uint256 public FACTOR = 1157920892373161954235709850086879078532699846656405640394575840079131296399;
    
    //generate random number
    function rand ( uint256 seedBUserParam ) atStage(Stages.AcceptingBets) returns (uint256){

        //user bet value
        uint256 betValue = msg.value;
        
        //return eth to sender if < 1 or > 5 eth was sent
        //if (betValue < 1000 || betValue > 5000) {
            //msg.sender.send(betValue);
            //todo - uncomment for live
            //return;
            //sendToFinishStage();
        //}        
        
        //if (stage != Stages.Reveal && stage != Stages.Finished){
            
            seedB = seedBUserParam;
            
            //return eth to sender if < 1 or > 5 eth was sent
            //if (betValue < 1 || betValue > 5) {
               //msg.sender.send(betValue);
                //todo - uncomment for live
                //return;
            //}
        
            //user reward value (190% aka 1 pays 1.9)
            rewardValue = (betValue)+(betValue*90/100);
            
            //get hash of parent block for seedA
            uint256 lastBlockNumberA = block.number - 1; 
            uint256 lastBlockHashValA = uint256(block.blockhash(lastBlockNumberA));
            
            seedA = lastBlockHashValA;
            
            //provably fair - as can be checked after result 
			seedAHash = sha3(seedA);
			
            //ensure stage 2 seedB equals stage 1 seedB 
			seedBStage1Hash = sha3(seedB);			
            
            //display sha3 of seedA here to user (client call)
            //getSeedAHash();
            
            nextStage();
            
        //}
		
    }

    //generate random number
    function reveal( uint256 seedBUserParam2 ) atStage(Stages.Reveal) returns (uint256){ 
        
        //if (stage != Stages.AcceptingBets && stage != Stages.Finished){
        
			//todo important
			//need to restrict to msg.sender of rand
			//if does not match - die
			
			//ensure stage2 seedB = stage1 seedB
			seedBStage2Hash = sha3(seedBUserParam2); 
			
			if(seedBStage2Hash == seedBStage1Hash){
			
				seedB = seedBUserParam2;
				
				//also check from same address?
				
					//get hash of parent block for seedC
					uint256 lastBlockNumberC = block.number - 1;
					//uint256 seedAPlus6Blocks = seedA + 6;
				
					//if( lastBlockNumberC > seedAPlus6Blocks ){

					uint256 lastBlockHashValC = uint256(block.blockhash(lastBlockNumberC));
					seedC = lastBlockHashValC;
					
					//test
					dieResult = (uint256(seedA + seedB + seedC) / FACTOR) +1;
					//dieResult = 51;
					
					//high result boolean
					if(dieResult > 49){
						high = true;
					}

					//low result boolean
					if(dieResult < 50){
						high = false;
					}

					//win result high boolean 
					if(high==true && seedB > 49){
						win = true;
						msg.sender.send(rewardValue);
					}

					//win result low boolean 
					if(high==false && seedB < 50){
						win = true;
						msg.sender.send(rewardValue);
					} 

					nextStage();
					
			}
			
			if(seedBStage1Hash != seedBStage2Hash){
				//todo send some error to client?
			}
            
        }
        
    } 
    
    function ResetStage() atStage(Stages.Finished) {
        //if (stage != Stages.AcceptingBets && stage != Stages.Reveal){
			//send back to stage 0 - accepting bets
			stage = Stages(uint(0));
        //}
    }
    
    
    //getters
    //to do - remove dangerous ones
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
        return seedC;
    }   
    	
    function getDieResult() returns (uint256) 
    {
        return dieResult;
    }       
           
    //recover total contract balance to owner of contract (creator)
    function kill() { if (msg.sender == owner) suicide(owner); } 
    
}