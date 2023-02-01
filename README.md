# Simple blog
The project aims to create a streamlined system for managing a blogging platform through the use of smart contracts. Users can create one or multiple blogs using the BlogFactory. They can then publish Posts, each of which is represented as a unique NFT that can be traded among users. The contents of each post are stored in a JSON file on IPFS and linked to the NFT.

## BlogFactory.sol
The BlogFactory provides access to the ```newBlog``` method, which allows the calling user to instantiate a Blog smart contract. This method can be invoked multiple times by each user. Additionally, the ```getBlogs``` method returns an array of blogs associated with a specific address provided as input.

**Events**
* ```event NewBlog(address owner, address blogAddr);```

## Blog.sol
The following is a list of methods provided by the Blog contract:

* ```setBlogMetadata```: used to set various metadata such as the title and image of the blog.
* ```newPost```: creates a new post, including its name, symbol, and a URI link to the IPFS resource that stores the content.
* ```getPosts```: retrieves an array of all posts belonging to the blog.
* ```transferPost```: transfers ownership of a specified post.
* ```addPost```: adds a post to your collection after it has been transferred to you.*

**Events**
* ```event NewPost(address owner, address post, string URI);```
* ```event TransferPost(address oldOwner, address newOwner, address post);```
* ```event NewBlogMetadata(address blog, string URI);```
    
    
## Post.sol
The Post contract represents a post as a unique NFT entity.

**Events**
* ```event ContentEdited(address post, address from, string URI);```
* ```event ChangePostOwner(address post, address oldOwner, address newOwner);```

## TheGraph
The contract was used to index content using TheGraph. Here is the link to the dedicated repository
[TheGraph simple blog repository](https://github.com/kchain-solutions/thegraph-simple-blog)

## Example addresses (Goerli)
* BlogFactory address: [0x2259Ff8FfEF4e92454a4ef1ED516291c5A2CC3fC](https://goerli.etherscan.io/address/0x2259Ff8FfEF4e92454a4ef1ED516291c5A2CC3fC)
* Blog address: [0x9bdAC7F504ED47f4966C8A061eCf88699A7Dc99d](https://goerli.etherscan.io/address/0x9bdAC7F504ED47f4966C8A061eCf88699A7Dc99d)
* Post address: [0x389272b009219E88B5A7c7331dC432e3018194Ba](https://goerli.etherscan.io/address/0x389272b009219E88B5A7c7331dC432e3018194Ba)
* Post address: [0x0F85d4377EAa86855aA8f1ee9a8204A8cD24755f](https://goerli.etherscan.io/address/0x0F85d4377EAa86855aA8f1ee9a8204A8cD24755f)


# Hardhat command
Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
npx hardhat run scripts/deploy.js
```
