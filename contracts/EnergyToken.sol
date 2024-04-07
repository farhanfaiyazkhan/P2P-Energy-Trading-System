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

    struct SellRequestDemand {
        uint256 id;
        address creator;
        uint256 price;
        uint256 amount;
        uint256 status;
    }

    struct BidDemand {
        uint256 id;
        address creator;
        address seller;
        uint256 price;
        uint256 amount;
        uint256 status;
    }

    mapping(address => uint256) private pin;
    mapping(uint256 => BidDemand) bids;
    mapping(uint256 => SellRequestDemand) sellRequests;

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

        uint256 priceInETH = _price * 1 ether;
        
        bids[totalBids] = BidDemand(totalBids, msg.sender, msg.sender, priceInETH, _amount, 2);
    }

    function acceptBid(uint256 _id) public authorised() {
        require(_id != 0, "Invalid request ID");
        require(_id <= totalBids, "Invalid request ID");
        require(bids[_id].status == 2);

        require( msg.sender != bids[_id].creator, "Cannot accept own Bid");

        bids[_id].status = 1;
        bids[_id].seller = msg.sender;
    }

    function completeBid(uint256 _id) public payable authorised() {
        require(_id != 0, "Invalid request ID");
        require(_id <= totalBids, "Invalid request ID");
        require(bids[_id].status == 1);

        require( msg.sender == bids[_id].creator, "Creator needs to complete transaction");

        require(msg.value >= bids[_id].price, "Insufficient funds");


        totalTrades++;

        bids[_id].status = 0;

        payable(bids[_id].seller).transfer(sellRequests[_id].price);

        _safeMint(msg.sender, totalTrades);
    }   


    function listSellRequest(
        uint256 _amount,
        uint256 _price
    ) public authorised {
        require(_amount > 0);
        require(_price > 0);
        totalSellRequests++;

        uint256 priceInETH = _price * 1 ether;

        sellRequests[totalSellRequests] = SellRequestDemand(
            totalSellRequests,
            msg.sender,
            priceInETH,
            _amount,
            1
        );
    }

    function buyEnergy(uint256 _id) public payable authorised {
        require(_id != 0, "Invalid request ID");
        require(_id <= totalSellRequests, "Invalid request ID");
        require(sellRequests[_id].status == 1, "Sell request not available");
        require(
            msg.sender != sellRequests[_id].creator,
            "Cannot buy own sell request"
        );

        require(msg.value >= sellRequests[_id].price, "Insufficient funds");

        totalTrades++;

        sellRequests[_id].status = 0;

        payable(sellRequests[_id].creator).transfer(sellRequests[_id].price);

        _safeMint(msg.sender, totalTrades);
    }

    function getSellRequest(uint256 _id) public view returns (SellRequestDemand memory) {
        return sellRequests[_id];
    }

    function getBid(uint256 _id) public view returns (BidDemand memory) {
        return bids[_id];
    }

    function getPin(address _adr) public view returns (uint256) {
        return pin[_adr];
    }
}