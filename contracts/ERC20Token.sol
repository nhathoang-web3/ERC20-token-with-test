// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {
    uint8 _decimals = 8;

    constructor(
        string memory name,
        string memory symbol,
        uint256 supply,
        address owner
    ) ERC20(name, symbol) {
        _mint(_msgSender(), supply);
        _transferOwnership(owner);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
