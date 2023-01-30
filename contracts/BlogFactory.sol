// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Blog.sol";

contract BlogFactory {

    event NewBlog(address owner, address blogAddr);

    mapping(address => address[]) private userBlogs;

    function newBlog() public {
        address blogAddr = address(new Blog(msg.sender));
        address[] storage blogs = userBlogs[msg.sender];
        blogs.push(blogAddr);
        emit NewBlog(msg.sender, blogAddr);
    }

    function getBlogs(address user) public view returns (address[] memory){
        return userBlogs[user];
    }
}
