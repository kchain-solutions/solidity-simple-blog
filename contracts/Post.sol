// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Post is ERC721URIStorage{
    
    event ContentEdited(address from, string URI);
    event NewPostOwner(address oldOwner, address newOwner);

    address public owner;
    address public blog;

    constructor(address _owner, string memory _name, string memory _symbol, string memory _URI) ERC721(_name, _symbol){
        owner = _owner;
        blog = msg.sender;
        _mint(_owner, 0);
        _setTokenURI(0, _URI);
        _approve(msg.sender, 0);
    }

    function editContent(string memory _URI) public {
        require(msg.sender == blog || msg.sender == owner, "Not authorized");
        _setTokenURI(0, _URI);
        emit ContentEdited(msg.sender, _URI);
    }

    function setNewOwner(address _newOwner) public {
        require(msg.sender == blog || msg.sender == owner, "Not authorized");
        owner = _newOwner;
        emit NewPostOwner(owner, _newOwner);
    }
}