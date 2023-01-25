// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Post.sol";

contract Blog is AccessControl{

    bytes32 public constant OWNER = keccak256("OWNER");

    using Counters for Counters.Counter;
    Counters.Counter private id; 
    address public owner;
    string metadata;
    uint256[] public idxs;
    
    mapping (uint256 => address) public indexer;

    constructor(address _owner){
        owner = _owner;
        _setupRole(OWNER, _owner);
        id.reset();
    }

    function setBlogMetadata(string memory _URI) public {
        require(hasRole(OWNER, msg.sender));
        metadata = _URI;
    }

    function newPost(string memory _name, string memory _symbol, string memory _URI) public {
        require(hasRole(OWNER, msg.sender));
        address postAddr = address(new Post(_name, _symbol, _URI));
        uint256 currentId = id.current();
        indexer[currentId] = postAddr;
        idxs.push(currentId);
        id.increment();
    }


}