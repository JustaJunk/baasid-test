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

    /// @dev deployer as default admin
    address public immutable defaultAdmin;

    /// @dev total supply
    uint256 public totalSupply;

    /// @dev Setup ERC721 and AccessControl
    constructor(address[] memory admins) ERC721("BaaSidTest", "BAST") {
        uint256 size = admins.length;
        require(size > 0, "empty admins");
        defaultAdmin = _msgSender();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setRoleAdmin(ADMIN, DEFAULT_ADMIN_ROLE);
        for (uint256 i = 0; i < size; i++) {
            _setupRole(ADMIN, admins[i]);
        }
        totalSupply = 0;
    }

    /// @dev Admin mint
    function adminMint(
        address to,
        uint256 tokenId,
        string calldata tokenURI
    ) external onlyRole(ADMIN) {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        totalSupply++;
    }

    /// @dev Admin can transfer any token
    function adminTransfer(address to, uint256 tokenId)
        external
        onlyRole(ADMIN)
    {
        _safeTransfer(ownerOf(tokenId), to, tokenId, "");
    }

    /// @dev Admin can burn any token
    function adminBurn(uint256 tokenId) external onlyRole(ADMIN) {
        _burn(tokenId);
        totalSupply--;
    }

    /// @dev Admin batch mint
    function adminBatchMint(
        address[] calldata receivers,
        uint256[] calldata tokenIds,
        string[] calldata tokenURIs
    ) external {
        uint256 size = receivers.length;
        require(
            size == tokenIds.length && size == tokenURIs.length,
            "size not match"
        );
        for (uint256 i = 0; i < size; i++) {
            _safeMint(receivers[i], tokenIds[i]);
            _setTokenURI(tokenIds[i], tokenURIs[i]);
        }
        totalSupply += size;
    }

    /// @dev Admin batch transfer
    function adminBatchTransfer(
        address[] calldata receivers,
        uint256[] calldata tokenIds
    ) external {
        uint256 size = receivers.length;
        require(size == tokenIds.length, "size not match");
        for (uint256 i = 0; i < size; i++) {
            _safeTransfer(ownerOf(tokenIds[i]), receivers[i], tokenIds[i], "");
        }
    }

    /// @dev Admin batch burn
    function adminBatchBurn(uint256[] calldata tokenIds) external {
        uint256 size = tokenIds.length;
        for (uint256 i = 0; i < size; i++) {
            _burn(tokenIds[i]);
        }
        totalSupply -= size;
    }

    /// @dev Self-destruct
    function selfDestruct() external onlyRole(DEFAULT_ADMIN_ROLE) {
        selfdestruct(payable(defaultAdmin));
    }

    /// @dev Add admin roles
    function addAdmins(address[] calldata newAdmins)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        uint256 size = newAdmins.length;
        for (uint256 i = 0; i < size; i++) {
            grantRole(ADMIN, newAdmins[i]);
        }
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
