//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 @title ERC721URIStorage with adminTransfer and adminBurn
 @notice For BaaSid test
 @author Justa Liang
 */
contract ERC721Admin is ERC721URIStorage, AccessControl {
    bytes32 public constant ADMIN = "admin";

    ///@dev Setup ERC721
    constructor(address[] memory admins) ERC721("BaaSidTest", "BAST") {
        uint256 size = admins.length;
        require(size > 0, "empty admins");
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setRoleAdmin(ADMIN, DEFAULT_ADMIN_ROLE);
        for (uint256 i = 0; i < size; i++) {
            _setupRole(ADMIN, admins[i]);
        }
    }

    ///@dev Admin mint to
    function mintTo(
        address to,
        uint256 tokenId,
        string calldata tokenURI
    ) external onlyRole(ADMIN) {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    ///@dev Admin can transfer any token
    function adminTransfer(address to, uint256 tokenId)
        external
        onlyRole(ADMIN)
    {
        _safeTransfer(ownerOf(tokenId), to, tokenId, "");
    }

    ///@dev Admin can burn any token
    function adminBurn(uint256 tokenId) external onlyRole(ADMIN) {
        _burn(tokenId);
    }

    ///@dev Self-destruct
    function selfDestruct(address payable defaultAdmin)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, defaultAdmin),
            "only default admin"
        );
        selfdestruct(defaultAdmin);
    }

    /// @dev Override interface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IAccessControl).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
