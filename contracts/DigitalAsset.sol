// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DigitalAsset is ERC721Enumerable, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("DigitalAsset", "DGA") Ownable(msg.sender) {}

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override // <-- Simplified
        returns (string memory)
    {
        return _tokenURIs[tokenId];
    }

    // --- REQUIRED OVERRIDES for ERC721Enumerable ---
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override // <-- Simplified
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override // <-- Simplified
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override // <-- Simplified
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}