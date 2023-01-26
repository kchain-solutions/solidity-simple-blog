// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


import "./Post.sol";

contract Blog is AccessControl{

    event NewPost(address _owner, address _post);
    event TransferPost(address _oldOwner, address _newOwner, address _post);
    event NewBlogMetadata(string _URI);

    bytes32 public constant OWNER = keccak256("OWNER");

    address public owner;
    string metadata;
    address[] public posts;

    constructor(address _owner){
        owner = _owner;
        _setupRole(OWNER, _owner);
    }

    function setBlogMetadata(string memory _URI) public {
        require(hasRole(OWNER, msg.sender));
        metadata = _URI;
        emit NewBlogMetadata(_URI);
    }

    function newPost(string memory _name, string memory _symbol, string memory _URI) public {
        require(hasRole(OWNER, msg.sender));
        address postAddr = address(new Post(msg.sender, _name, _symbol, _URI));
        posts.push(postAddr);
        emit NewPost(msg.sender, postAddr);
    }

    function getPosts() public view returns (address[] memory){
        return posts;
    }

    function transferPost(address _postAddr, address _to) public {
        require(hasRole(OWNER, msg.sender));
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
        emit TransferPost(msg.sender, _to, _postAddr);
    }

    function addPost(address _postAddr) public {
        require(msg.sender == IERC721(_postAddr).ownerOf(0), "Not owner of the NFT");
        posts.push(_postAddr);
        emit NewPost(msg.sender, _postAddr);
    }





}