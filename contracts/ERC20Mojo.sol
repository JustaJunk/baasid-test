//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 @title ERC20 token
 @notice For BaaSid test
 @author Justa Liang
 */
contract ERC20Mojo is ERC20, Ownable {
    constructor(uint256 maxSupply, address[] memory users)
        ERC20("Mojo Coin", "MOJO")
    {
        uint256 size = users.length;
        for (uint256 i = 0; i < size; i++) {
            _mint(_msgSender(), maxSupply / size);
        }
    }

    /// @dev Self-destruct
    function selfDestruct() external onlyOwner {
        selfdestruct(payable(owner()));
    }
}
