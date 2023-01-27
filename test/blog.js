const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const assert = require('assert');
const { ethers } = require('hardhat');
const fs = require('fs').promises;

describe("BlogFactory", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBlogFixture() {
    const BlogFactory = await ethers.getContractFactory("BlogFactory");
    const [owner, addr1] = await ethers.getSigners();
    const blogFactory = await BlogFactory.deploy();

    await blogFactory.deployed();

    return { blogFactory, owner, addr1 }
  }

  describe("Blog", function () {
    it("Create blog", async () => {
      const { blogFactory, owner, addr1 } = await loadFixture(deployBlogFixture);
      await blogFactory.connect(owner).newBlog();
      const blogAddr = await blogFactory.blogs(owner.address);
      const blogAddrFail = await blogFactory.blogs(addr1.address);
      assert(blogAddr != "0x0000000000000000000000000000000000000000");
      assert(blogAddrFail == "0x0000000000000000000000000000000000000000");
    });

    it("Create post", async () => {
      const { blogFactory, owner, addr1 } = await loadFixture(deployBlogFixture);
      await blogFactory.connect(owner).newBlog();
      const blogAddr = await blogFactory.blogs(owner.address);
      const Blog = await ethers.getContractFactory("Blog");
      let blog = await Blog.deploy(owner.address);
      blog = await blog.attach(blogAddr);
      await blog.newPost("name", "symbol", "ipfs.io");
      await blog.newPost("name1", "symbol1", "ipfs.io1");
      let posts = await blog.getPosts();
      assert.equal(posts.length, 2);
    });

    it("Transfer post", async () => {
      const { blogFactory, owner, addr1 } = await loadFixture(deployBlogFixture);
      await blogFactory.connect(owner).newBlog();
      const blogAddr = await blogFactory.blogs(owner.address);
      const Blog = await ethers.getContractFactory("Blog");
      let blog = await Blog.deploy(owner.address);
      blog = await blog.attach(blogAddr);
      await blog.newPost("name", "symbol", "ipfs.io");
      await blog.newPost("name1", "symbol1", "ipfs.io1");
      await blog.newPost("name2", "symbol2", "ipfs.io2");

      let postsBefore = await blog.getPosts();
      let toTrasfer = postsBefore[1];

      await blog.transferPost(toTrasfer, addr1.address);
      let postsAfter = await blog.getPosts();
      assert.equal(!postsAfter.includes(toTrasfer), true);
    });

    it("Add post", async () => {
      const { blogFactory, owner, addr1 } = await loadFixture(deployBlogFixture);
      await blogFactory.connect(owner).newBlog();
      await blogFactory.connect(addr1).newBlog();

      const blogAddr = await blogFactory.blogs(owner.address);
      const blogAddr1 = await blogFactory.blogs(addr1.address);
      const Blog = await ethers.getContractFactory("Blog");
      let blog = await Blog.deploy(owner.address);
      blog = await blog.attach(blogAddr);
      await blog.newPost("name", "symbol", "ipfs.io");
      await blog.newPost("name1", "symbol1", "ipfs.io1");
      await blog.newPost("name2", "symbol2", "ipfs.io2");

      let postsBefore = await blog.getPosts();
      let toTransfer = postsBefore[1];
      await blog.transferPost(toTransfer, addr1.address);

      const Post = await ethers.getContractFactory("Post");
      let post = await Post.deploy(owner.address, "a", "b", "c");
      await post.deployed();
      post = await blog.attach(toTransfer);

      assert.equal(await post.owner(), addr1.address);
      blog = await blog.attach(blogAddr1);
      blog = await blog.connect(addr1);
      await blog.addPost(toTransfer);
      let posts = await blog.getPosts();
      assert.equal(posts.includes(toTransfer), true);
      assert.equal(posts.length, 1);
    });

    it("Create contract from file", async () => {
      try {
        let data = await fs.readFile('./artifacts/contracts/BlogFactory.sol/BlogFactory.json', 'utf8');
        let jsonData = JSON.parse(data);
        const [owner] = await ethers.getSigners();
        const BlogFactory = new ethers.ContractFactory(jsonData.abi, jsonData.bytecode, owner);
        const blogFactory = await BlogFactory.deploy();
      } catch (err) {
        console.log(err);
      }
    });
  });
});
