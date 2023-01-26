const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const assert = require('assert');
const { ethers } = require('hardhat');

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
      const blogAddr = await blogFactory.indexer(owner.address);
      const blogAddrFail = await blogFactory.indexer(addr1.address);
      assert(blogAddr != "0x0000000000000000000000000000000000000000");
      assert(blogAddrFail == "0x0000000000000000000000000000000000000000");
    });

    it("Create post", async () => {
      const { blogFactory, owner, addr1 } = await loadFixture(deployBlogFixture);
      await blogFactory.connect(owner).newBlog();
      const blogAddr = await blogFactory.indexer(owner.address);
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
      const blogAddr = await blogFactory.indexer(owner.address);
      const Blog = await ethers.getContractFactory("Blog");
      let blog = await Blog.deploy(owner.address);
      blog = await blog.attach(blogAddr);
      await blog.newPost("name", "symbol", "ipfs.io");
      await blog.newPost("name1", "symbol1", "ipfs.io1");
      await blog.newPost("name2", "symbol2", "ipfs.io2");

      let postsBefore = await blog.getPosts();
      let toTrasfer = postsBefore[1];

      /*
      const Post = await ethers.getContractFactory("Post");
      let post = await Post.deploy(owner.address, "n", "s", "r");
      post = await blog.attach(toTrasfer);
      await post.approve(blogAddr, 0);
      */

      await blog.transferPost(toTrasfer, addr1.address);
      let postsAfter = await blog.getPosts();
      assert.equal(!postsAfter.includes(toTrasfer), true);
    });
  });
});
