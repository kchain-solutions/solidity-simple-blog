// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Post is ERC721URIStorage{
    
    address owner;
    address blog;

    constructor(address _owner, string memory _name, string memory _symbol, string memory _URI) ERC721(_name, _symbol){
        owner = _owner;
        blog = msg.sender;
        _mint(_owner, 0);
        _setTokenURI(0, _URI);
        _approve(msg.sender, 0);
        
    }

    function editContent(string memory _URI) public {
        require(msg.sender == blog || msg.sender==owner, "Not authorized");
        _setTokenURI(0, _URI);
    }
}