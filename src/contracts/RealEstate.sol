// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstate {
    address payable private beneficiary;
    uint256 private price;
    int256 private lat;
    int256 private lon;
    string private locationName;
    bool private registered;
    bool private mortgageFree;
    uint256 private sqft;
    string private floor;
    string private heatingType;
    uint256 private numberOfRooms; 

    mapping(address => uint) pendingReturns;

    event RealEstateBought(address indexed buyer, uint256 price);

    constructor(
        address payable _beneficiary,
        uint256 _price,
        int256 _lat,
        int256 _lon,
        string memory _locationName,
        bool _registered,
        bool _mortgageFree,
        uint256 _sqft,
        string memory _floor,
        string memory _heatingType,
        uint256 _numberOfRooms
    ) {
        beneficiary = _beneficiary;
        price = _price;
        lat = _lat;
        lon = _lon;
        locationName = _locationName;
        registered = _registered;
        mortgageFree = _mortgageFree;
        sqft = _sqft;
        floor = _floor;
        heatingType = _heatingType;
        numberOfRooms = _numberOfRooms;
    }

    function buyRealEstate() external payable {
        require(!registered, "Property is already registered");
        require(msg.value >= price, "Insufficient funds");

        beneficiary = payable(msg.sender);
        registered = true;

        if (msg.value > price) {
            pendingReturns[msg.sender] += msg.value - price;
        }

        emit RealEstateBought(msg.sender, price);
    }

    // Getter functions
    function getBeneficiary() public view returns (address payable) {
        return beneficiary;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function getLat() public view returns (int256) {
        return lat;
    }

    function getLon() public view returns (int256) {
        return lon;
    }

    function getLocationName() public view returns (string memory) {
        return locationName;
    }

    function isRegistered() public view returns (bool) {
        return registered;
    }

    function isMortgageFree() public view returns (bool) {
        return mortgageFree;
    }

    function getSqft() public view returns (uint256) {
        return sqft;
    }

    function getFloor() public view returns (string memory) {
        return floor;
    }

    function getHeatingType() public view returns (string memory) {
        return heatingType;
    }

    function getNumberOfRooms() public view returns (uint256) {
        return numberOfRooms;
    }


}
