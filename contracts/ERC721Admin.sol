//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 @title ERC721URIStorage with adminTransfer and adminBurn
 @notice For BaaSid test
 @author Justa Liang
 */
contract ERC721Admin is ERC721URIStorage, Ownable {
    ///@dev Setup ERC721
    constructor() ERC721("BaaSidTest", "BAST") {}

    ///@dev Admin mint to
    function mintTo(
        address to,
        uint256 tokenId,
        string calldata tokenURI
    ) external onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    ///@dev Admin can transfer any token
    function adminTransfer(address to, uint256 tokenId) external onlyOwner {
        _safeTransfer(ownerOf(tokenId), to, tokenId, "");
    }

    ///@dev Admin can burn any token
    function adminBurn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }
}
