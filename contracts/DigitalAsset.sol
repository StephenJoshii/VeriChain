// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DigitalAsset is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;
    constructor() ERC721("DigitalAsset", "DGA") Ownable(msg.sender) {}
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
    }
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        super.tokenURI(tokenId);
        return _tokenURIs[tokenId];
    }
}