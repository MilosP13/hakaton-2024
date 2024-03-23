// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RealEstate.sol";

contract RealEstateFactory {
    RealEstate[] public realEstates; 

    function createRealEstate(address payable _beneficiary, uint256 _price, int256 _lat, int256 _lon, 
    string memory _locationName, bool _registered, bool _mortgageFree, uint256 _sqft, string memory _floor, 
    string memory _heatingType, uint256 _numberOfRooms) public {

        RealEstate newRealEstate = new RealEstate(_beneficiary, _price, _lat, _lon, _locationName,
         _registered, _mortgageFree, _sqft, _floor, _heatingType, _numberOfRooms);
        realEstates.push(newRealEstate);
        
    }

    function getAllRealEstates() public view returns (RealEstate[] memory) {
        return realEstates;
    }
}

