//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 @title ERC721URIStorage with adminTransfer and adminBurn
 @notice For BaaSid test
 @author Justa Liang
 */
contract ERC721Admin is ERC721Enumerable, AccessControl {
    using Strings for uint256;

    /// @dev Admin role code
    bytes32 public constant ADMIN = keccak256("ADMIN_ROLE");

    /// @dev deployer as default admin
    address public immutable defaultAdmin;

    /// @dev base URI
    string private __baseURI;

    /// @dev Setup ERC721 and AccessControl
    constructor(address[] memory admins, string memory initBaseURI)
        ERC721("BaaSidTest", "BAST")
    {
        uint256 size = admins.length;
        require(size > 0, "empty admins");
        defaultAdmin = _msgSender();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        for (uint256 i = 0; i < size; i++) {
            _setupRole(ADMIN, admins[i]);
        }
        __baseURI = initBaseURI;
    }

    /// @dev Admin mint
    function adminMint(address to, uint256 tokenId) external onlyRole(ADMIN) {
        _safeMint(to, tokenId);
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
    }

    /// @dev Admin batch mint
    function adminBatchMint(
        address[] calldata receivers,
        uint256[] calldata tokenIds
    ) external {
        uint256 size = receivers.length;
        require(size == tokenIds.length, "size not match");
        for (uint256 i = 0; i < size; i++) {
            _safeMint(receivers[i], tokenIds[i]);
        }
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

    /// @dev Update baseURI
    function updateBaseURI(string calldata newBaseURI)
        external
        onlyRole(ADMIN)
    {
        __baseURI = newBaseURI;
    }

    /// @dev Override interface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @dev Override ERC721.tokenURI
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "query for nonexistent token");

        return string(abi.encodePacked(__baseURI, tokenId.toString(), ".json"));
    }
}
