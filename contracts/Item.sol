pragma solidity ^0.8.0;

import "./ItemManager.sol";

contract Item {
    uint public priceInWei;
    uint public index;
    string public identifier;

    ItemManager parentContract;

    constructor(ItemManager _parentContract,uint _priceInWei, string memory _identifier) {
        priceInWei = _priceInWei;
        parentContract = _parentContract;
        identifier = _identifier;
    }

}