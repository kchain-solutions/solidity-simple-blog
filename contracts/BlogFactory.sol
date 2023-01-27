// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Blog.sol";

contract BlogFactory {

    event NewBlog(address owner, address blogAddr);

    function newBlog() public {
        address blogAddr = address(new Blog(msg.sender));
        emit NewBlog(msg.sender, blogAddr);
    }
}
