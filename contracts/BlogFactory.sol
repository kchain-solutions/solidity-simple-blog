// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Blog.sol";

contract BlogFactory {

    event NewBlog(address owner, address blogAddr);
    
    mapping(address => address) public blogs;

    function newBlog() public {
        address blogAddr = address(new Blog(msg.sender));
        blogs[msg.sender] = blogAddr;
        emit NewBlog(msg.sender, blogAddr);
    }
}
