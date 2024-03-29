//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EnergyToken is ERC721 {
    address public owner;
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    uint256 public totalBids;
    uint256 public totalSellRequests;
    uint256 public totalTrades;

    struct Demand {
        uint256 id;
        address creator;
        uint256 price;
        uint256 amount;
        bool status;
    }

    mapping(address => uint256) private pin;
    mapping(uint256 => Demand) bids;
    mapping(uint256 => Demand) sellRequests;

    modifier authorised() {
        require(pin[msg.sender] != 0);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function setPin(address _user, uint256 pinId) public onlyOwner {
        pin[_user] = pinId;
    }

    function listBid(uint256 _amount, uint256 _price) public authorised {
        require(_amount > 0);
        require(_price > 0);
        totalBids++;
        bids[totalBids] = Demand(totalBids, msg.sender, _price, _amount, true);
    }

    function listSellRequest(
        uint256 _amount,
        uint256 _price
    ) public authorised {
        require(_amount > 0);
        require(_price > 0);
        totalSellRequests++;
        sellRequests[totalSellRequests] = Demand(
            totalSellRequests,
            msg.sender,
            _price,
            _amount,
            true
        );
    }

    function buyEnergy(uint256 _id) public payable authorised {
        require(_id != 0, "Invalid request ID");
        require(_id <= totalSellRequests, "Invalid request ID");
        require(sellRequests[_id].status, "Sell request not available");
        require(
            msg.sender != sellRequests[_id].creator,
            "Cannot buy own sell request"
        );

        require(msg.value >= sellRequests[_id].price, "Insufficient funds");

        totalTrades++;

        sellRequests[_id].status = false;

        payable(sellRequests[_id].creator).transfer(sellRequests[_id].price);

        _safeMint(msg.sender, totalTrades);
    }

    function getSellRequest(uint256 _id) public view returns (Demand memory) {
        return sellRequests[_id];
    }

    function getPin(address _adr) public view returns (uint256) {
        return pin[_adr];
    }
}
