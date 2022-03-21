//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 @title Fake USDT
 @notice For BaaSid test
 @author Justa Liang
 */
contract ERC20Usdf is ERC20, Ownable {
    constructor() ERC20("Fake USD", "USDF") {
        _mint(owner(), 1e24);
    }

    /// @notice Mint
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /// @dev Self-destruct
    function selfDestruct() external onlyOwner {
        selfdestruct(payable(owner()));
    }
}
