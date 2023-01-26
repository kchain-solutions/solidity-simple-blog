// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Blog.sol";

contract BlogFactory {
    
    mapping(address => address) public indexer;

    function newBlog() public {
        address blogAddr = address(new Blog(msg.sender));
        indexer[msg.sender] = blogAddr;
    }
}
