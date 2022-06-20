// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
// importing the interface for IERC721
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // want to implement our own functionality, so we will take the interface, not the whole ERC 721
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 



contract ERC721Identifier is Context, ERC165, AccessControl, IERC721, IERC721Metadata {

    string private _name;
    string private _symbol;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // TODO:Look into what approvals mean and if it ok to give the owner approval rights

    mapping(uint256 => address) private _tokenApprovals;

    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory name_, string memory symbol_) public {
        _grantRole(MINTER_ROLE, msg.sender);
        _name = name_; // will set to Synchrony digital ID collection.  This is the name for collection of all IDs.  Each ID within the collection will have different data within it
        _symbol = symbol_; // brief description of what it is, mention my name, also list Synchrony's public ID
    }

    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function safeTransferFrom (address from, address to, uint256 tokenId, bytes calldata data) public virtual override {
        // Debating whether or not to even expose this functionality to Synchrony . . . Should it be soulbound or should Synchrony be allowed to 
        require(hasRole(MINTER_ROLE, msg.sender), "This Digital ID is bound to your wallet.  If you need to change the wallet your ID is stored in, please contact the minter (Synchrony)");
    }

    function safeTransferFrom (address from, address to, uint256 tokenId) public virtual override {
        // Debating whether or not to even expose this functionality to Synchrony . . . Should it be soulbound or should Synchrony be allowed to 
        require(hasRole(MINTER_ROLE, msg.sender), "This Digital ID is bound to your wallet.  If you need to change the wallet your ID is stored in, please contact the minter (Synchrony)");
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(hasRole(MINTER_ROLE, msg.sender), "This Digital ID is bound to your wallet.  If you need to change the wallet your ID is stored in, please contact the minter (Synchrony)");
        
        _transfer(from, to, tokenId);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        require(_balances[to] == 0, "This wallet already has an ID in it, limit one Synchrony Digital ID per wallet");

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    // No one can call except the minter (Synchrony)
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "ERC721: approve caller is not token minter, contact Synchrony to approve token transfers"
        );

        _approve(to, tokenId);
    }
    

    function _approve(address to, uint256 tokenId) internal virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "This Digital ID is bound to your wallet.  If you need to change the wallet your ID is stored in, please contact the minter (Synchrony)");
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        _requireMinted(tokenId);
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }


    // will throw unless bank is calling the function.  Little hazy on what this does, but to be safe I am only allowing the bank the functionality
    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "This Digital ID is bound to your wallet.  If you need to change the wallet your ID is stored in, please contact the minter (Synchrony)");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    // IERCMetadata implementation

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId))) : "";
    }

    // If Synchrony decides to store something like the pics in a database somewhere, then this would be the constant prefix to that database
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }
    
    


    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "ERC721: invalid token ID");
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165, AccessControl) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            interfaceId == type(IAccessControl).interfaceId;
            super.supportsInterface(interfaceId);
    }

}