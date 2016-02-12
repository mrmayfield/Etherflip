contract Array{

//owner of the type - address
address public owner;

//create an array of struct Funder
Funder[] public funders;

struct Funder {
    address addr;
    uint amount;
    uint Number;
}

function Array(){
    owner = msg.sender;
}

function newEntrant(uint _Number){
    uint amount = msg.value;
    uint Number = _Number;
    funders.push( Funder({addr: msg.sender, amount: amount, Number: Number}));
}

function getEntrants(uint getNumberAtPosition) constant returns (uint fundersLength){
    //return funders.length;
    uint arrayLength = funders.length;
    //for (var i = 0; i < arrayLength; i++) {


        //uint theNumber = funders[i].Number;
        //address theAddr = funders[i].addr;

        //todo
        //payout winners [addr] based on ([amount] * 190) / 100
        return funders[getNumberAtPosition].Number + funders[getNumberAtPosition].amount;
    //}

}

//recover total contract balance to owner of contract (creator)
function kill() { if (msg.sender == owner) suicide(owner); }

}