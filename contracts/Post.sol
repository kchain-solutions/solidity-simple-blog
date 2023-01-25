// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Post is ERC721URIStorage{

    constructor(string memory _name, string memory _symbol, string memory _URI) ERC721(_name, _symbol){
        _mint(msg.sender, 0);
        _setTokenURI(0, _URI);
    }

    function editContent(string memory _URI) public {
        _setTokenURI(0, _URI);
    }
}