pragma solidity ^0.8.0;

// import "./Item.sol";

contract ItemManager {

    struct S_Item {
        string _itemName;
        uint _priceInWei;
        address _owner;
        uint _index;
    }
    
    mapping(address => S_Item[]) public inventory;
    
    event SupplyChainStep(uint _itemIndex, string itemName, uint price, address _owner);
    event addtoMarketplace(string itemName, uint price, address _owner);

    S_Item[] public storeData;  

    
    function createItem(string memory _itemName, uint _priceInWei) public {
        S_Item[] storage userItems = inventory[msg.sender];
        S_Item memory s_item = S_Item(
            _itemName,
            _priceInWei,
            msg.sender,
            userItems.length
            );
        userItems.push(s_item);
        inventory[msg.sender] = userItems;
        emit SupplyChainStep(userItems.length, _itemName, _priceInWei,msg.sender);        
    }    
    
    function addTomarketPlace(uint _itemIndex, address _itemOwner) public {
    
    // add item which is in inventory remove it and store it stordata array and push it
       
       //change index
        S_Item memory _data  = inventory[_itemOwner][_itemIndex];
       _data._index = storeData.length;
       
        //store data in array
        storeData.push(_data);
      
        //removing data from the user array
        uint lastItemIndex = (inventory[_itemOwner]).length - 1;
        inventory[_itemOwner][_itemIndex] = inventory[_itemOwner][lastItemIndex];
         (inventory[_itemOwner][_itemIndex])._index = _itemIndex;
        (inventory[_itemOwner]).pop();
    
        
        emit addtoMarketplace(_data._itemName,_data._priceInWei,_data._owner);

    }


    function getItemList() public view returns(S_Item[] memory) {
        return inventory[msg.sender];
    }

    function marketPlaceList() public view returns(S_Item[] memory){
            return storeData;
    }
    
    function purchaseItem(uint _itemIndex, address payable _itemOwner) public payable{
        S_Item memory _data = storeData[_itemIndex];
         _data._index =  (inventory[msg.sender]).length;
        _data._owner = msg.sender;
 
        (inventory[msg.sender]).push(_data);
   
        // delete in gas efficient manner

        uint lastItemIndex = storeData.length - 1;
        storeData[_itemIndex] = storeData[lastItemIndex];
        storeData[_itemIndex]._index = _itemIndex;
         storeData.pop();
        
       require(address(msg.sender).balance>=msg.value,"you dont have enough funds");
        _itemOwner.transfer(msg.value);
 
    }

}