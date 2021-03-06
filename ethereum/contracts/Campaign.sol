pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    // manager only
    modifier purple() {
        require(msg.sender==manager);
        _; // paste function here so it's modified
    }
    
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        // if address is already a contributor, do nothing else
        if(approvers[msg.sender]==true) {

        } else { // if address is new contributor, add them to approvers & increase approvers count
            approvers[msg.sender] = true;
            approversCount++;
        }
    }
    
    function createRequest(string description, uint value, address recipient) public purple {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public purple {
        Request storage request = requests[index]; // allows `requests[index].complete` -> `request.complete`
        
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete); // request is !not already complete
        
        request.recipient.transfer(request.value);
        request.complete = true; // now it is
    }

    // get a summary of this campaign
    function getSummary() public view returns (
        uint, uint, uint, uint, address
        ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}
