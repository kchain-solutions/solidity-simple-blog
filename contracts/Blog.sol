// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./Post.sol";

contract Blog{

    event NewPost(address owner, address post, string URI);
    event TransferPost(address oldOwner, address newOwner, address post);
    event NewBlogMetadata(address blog, string URI);

    address public owner;
    string public metadata;
    address[] public posts;
    bool public isActive;

    constructor(address _owner){
        owner = _owner;
        isActive = true;
    }

    function setBlogMetadata(string memory _URI) public {
        require(owner == msg.sender, "Not authorized");
        metadata = _URI;
        emit NewBlogMetadata(address(this), _URI);
    }

    function newPost(string memory _name, string memory _symbol, string memory _URI) public {
        require(owner == msg.sender, "Not authorized");
        address postAddr = address(new Post(msg.sender, _name, _symbol, _URI));
        posts.push(postAddr);
        emit NewPost(msg.sender, postAddr, _URI);
    }

    function getPosts() public view returns (address[] memory){
        return posts;
    }

    function transferPost(address _postAddr, address _to) public {
        require(owner == msg.sender, "Not authorized");
        IERC721(_postAddr).transferFrom(msg.sender, _to, 0);

        uint newLength =0;
        bool found = false;
        for (uint idx = 0; idx < posts.length; idx++){
            if (posts[idx] != _postAddr) {
                posts[newLength] = posts[idx];
                newLength++;
            } 
            else found = true;
        }
        require(found == true, "Element not found");
        posts.pop();
        Post post = Post(_postAddr);
        post.setNewOwner(_to);
        emit TransferPost(msg.sender, _to, _postAddr);
    }

    function addPost(address _postAddr) public {
        require(msg.sender == IERC721(_postAddr).ownerOf(0), "Not owner of the NFT");
        posts.push(_postAddr);
        Post post = Post(_postAddr);
        emit NewPost(msg.sender, _postAddr, post.tokenURI(0));
    }
}