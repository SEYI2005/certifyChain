// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertifyChain
 * @dev Bowen University Blockchain Certificate Verification System
 *
 *  What's new in this version:
 *  ─────────────────────────────────────────────────────────────
 *  1. AdminProfile struct — stores name, email, school, NUC code,
 *     NUC document hash, and registration timestamp fully on-chain.
 *
 *  2. NUC Code validation — valid NUC codes are pre-registered by
 *     the contract owner. registerAdmin() rejects any code that is
 *     not in the validNucCodes mapping, preventing fake institutions
 *     from gaining admin access.
 *
 *  3. NUC Document Hash — the SHA-256 hash of the uploaded NUC
 *     verification document is stored on-chain. This proves the
 *     document existed and was untampered at the time of registration.
 *     Anyone can later re-hash the document and compare to verify it.
 *
 *  4. getAdminProfile() — returns full on-chain details of any admin.
 *     Used by the dashboard to display name, school, and code.
 *
 *  5. addValidNucCode() / removeValidNucCode() — owner-only functions
 *     to manage the list of NUC-accredited institution codes.
 */
contract CertifyChain {

    // =========================================================
    //  STRUCTS
    // =========================================================

    /**
     * @dev Full profile of a registered admin — stored entirely on-chain.
     *      No database. No server. Permanent and tamper-proof.
     */
    struct AdminProfile {
        string  name;            // Admin's full name
        string  email;           // Admin's email address
        string  schoolName;      // Name of the institution
        string  nucCode;         // NUC accreditation code (validated on registration)
        string  nucDocHash;      // SHA-256 hash of uploaded NUC verification document
        string  joinCode;        // The admin code assigned at registration (audit trail)
        uint256 registeredAt;    // Block timestamp of registration
        bool    exists;          // Guard to check if profile was set
    }

    /**
     * @dev Certificate struct — matches the system algorithm exactly.
     */
    struct Certificate {
        string  certificateID;
        string  studentName;
        string  certificateType;
        string  school;
        string  graduationDate;
        string  certificateHash;
        uint256 timestamp;
        bool    isValid;
        bool    isIssued;
    }


    // =========================================================
    //  STATE VARIABLES
    // =========================================================

    address public owner;

    // Maps wallet address → whether they are an admin
    mapping(address => bool) public admins;

    // Maps wallet address → full admin profile (stored on-chain)
    mapping(address => AdminProfile) public adminProfiles;

    // Valid NUC codes — pre-registered by the owner.
    // registerAdmin() checks this before whitelisting anyone.
    mapping(string => bool) public validNucCodes;

    // The ONE shared verification code all current admins hold.
    // Rotates every time a new admin registers.
    string public currentAdminCode;

    // Tracks how many admins have registered (used to generate next code)
    uint256 public adminCount;

    // certificateID → Certificate data
    mapping(string => Certificate) public certificates;

    // Array of all certificate IDs (for the admin ledger view)
    string[] public allCertificateIDs;

    // Duplicate document prevention.
    // Stores keccak256(SHA-256 hash) of every document ever issued.
    // issueCertificate() checks this before writing to the ledger.
    // If the same file is uploaded again the transaction reverts
    // and the dashboard shows a disclaimer to the admin.
    mapping(bytes32 => bool) public usedDocumentHashes;


    // =========================================================
    //  EVENTS
    // =========================================================

    // Fired when a new admin registers successfully
    // newAdminCode = the rotated global code all admins now share
    event AdminAdded(
        address indexed newAdmin,
        string  newAdminCode,
        string  schoolName,
        uint256 timestamp
    );

    // Fired when an admin is removed by the owner
    event AdminRemoved(address indexed removedAdmin, uint256 timestamp);

    // Fired when a valid NUC code is added by the owner
    event NucCodeAdded(string nucCode, uint256 timestamp);

    // Fired when a certificate is issued
    event CertificateIssued(string certificateID, string studentName, uint256 timestamp);

    // Fired when a certificate is revoked
    event CertificateRevoked(string certificateID, uint256 timestamp);

    // Fired when an admin attempts to issue a document that already exists
    event DuplicateDocumentRejected(string attemptedCertID, string studentName, uint256 timestamp);


    // =========================================================
    //  MODIFIERS
    // =========================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Access Denied: Not the contract owner");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Access Denied: Not an authorized admin");
        _;
    }


    // =========================================================
    //  CONSTRUCTOR
    //  ─ Deployer becomes first admin
    //  ─ Pre-loads valid NUC codes from the NUC accredited list
    // =========================================================

    constructor() {
        owner = msg.sender;

        // ── Bootstrap first admin ──
        admins[msg.sender]    = true;
        adminCount            = 1;
        currentAdminCode      = "NUC-AUTH-1";

        // Store the deployer's profile with placeholder values
        // (the deployer is the system owner, not an institution admin)
        adminProfiles[msg.sender] = AdminProfile({
            name:         "System Owner",
            email:        "owner@certifychain.com",
            schoolName:   "CertifyChain System",
            nucCode:      "SYSTEM",
            nucDocHash:   "SYSTEM",
            joinCode:     "NUC-AUTH-1",
            registeredAt: block.timestamp,
            exists:       true
        });

        // ── Pre-load valid NUC accredited institution codes ──
        // Source: NUC Accredited Programmes list (universities_file)
        // Owner can add more at any time using addValidNucCode()
        validNucCodes["NUC-BU-095"]  = true;   // Bowen University, Iwo
        validNucCodes["NUC-UI-001"]  = true;   // University of Ibadan
        validNucCodes["NUC-UI-002"]  = true;   // University of Lagos
        validNucCodes["NUC-UI-003"]  = true;   // Obafemi Awolowo University
        validNucCodes["NUC-UI-004"]  = true;   // University of Nigeria, Nsukka
        validNucCodes["NUC-UI-005"]  = true;   // Ahmadu Bello University
        validNucCodes["NUC-UI-006"]  = true;   // University of Benin
        validNucCodes["NUC-UI-007"]  = true;   // University of Port Harcourt
        validNucCodes["NUC-UI-008"]  = true;   // Nnamdi Azikiwe University
        validNucCodes["NUC-UI-009"]  = true;   // Covenant University

        emit AdminAdded(msg.sender, currentAdminCode, "CertifyChain System", block.timestamp);
    }


    // =========================================================
    //  NUC CODE MANAGEMENT (owner only)
    // =========================================================

    /**
     * @dev Owner adds a new valid NUC institution code.
     *      Call this to register new accredited institutions.
     */
    function addValidNucCode(string memory _nucCode) public onlyOwner {
        require(bytes(_nucCode).length > 0, "NUC code cannot be empty");
        validNucCodes[_nucCode] = true;
        emit NucCodeAdded(_nucCode, block.timestamp);
    }

    /**
     * @dev Owner removes a NUC code (e.g. institution loses accreditation).
     *      Note: this does NOT remove already registered admins from that institution.
     */
    function removeValidNucCode(string memory _nucCode) public onlyOwner {
        validNucCodes[_nucCode] = false;
    }

    /**
     * @dev Check if a NUC code is valid (public — signup page calls this first)
     */
    function isValidNucCode(string memory _nucCode) public view returns (bool) {
        return validNucCodes[_nucCode];
    }


    // =========================================================
    //  ADMIN REGISTRATION — invite-based + NUC validated
    // =========================================================

    /**
     * @dev A new institution admin calls this during signup.
     *
     *  Validation chain (all must pass or transaction reverts):
     *    1. Wallet not already registered as admin
     *    2. Invite code matches current global code
     *    3. NUC code exists in the validNucCodes mapping
     *    4. NUC document hash provided (not empty)
     *
     *  On success:
     *    - Wallet is whitelisted as admin
     *    - Full profile stored on-chain (name, email, school, NUC code, doc hash)
     *    - Global code rotates — old code is immediately invalid
     *    - AdminAdded event fires so all open dashboards update in real time
     *
     * @param _inviteCode   Current global admin verification code (from existing admin)
     * @param _name         Admin's full name
     * @param _email        Admin's email address
     * @param _schoolName   Institution name
     * @param _nucCode      NUC accreditation code (must be in validNucCodes)
     * @param _nucDocHash   SHA-256 hash of the uploaded NUC verification document
     */
    function registerAdmin(
        string memory _inviteCode,
        string memory _name,
        string memory _email,
        string memory _schoolName,
        string memory _nucCode,
        string memory _nucDocHash
    ) public {
        // 1. Caller must not already be an admin
        require(!admins[msg.sender], "You are already a registered admin");

        // 2. Invite code must match current global code
        require(
            keccak256(abi.encodePacked(_inviteCode)) ==
            keccak256(abi.encodePacked(currentAdminCode)),
            "Invalid verification code"
        );

        // 3. NUC code must be in the pre-approved list
        require(validNucCodes[_nucCode], "Invalid NUC code: institution not accredited");

        // 4. NUC document hash must not be empty
        require(bytes(_nucDocHash).length > 0, "NUC document hash is required");

        // 5. Basic field validation
        require(bytes(_name).length > 0,       "Admin name is required");
        require(bytes(_email).length > 0,      "Admin email is required");
        require(bytes(_schoolName).length > 0, "School name is required");

        // 6. Whitelist the new admin
        admins[msg.sender] = true;
        adminCount++;

        // 7. Generate new rotating code
        string memory newCode = string(
            abi.encodePacked("NUC-AUTH-", _uintToString(adminCount))
        );

        // 8. Store full profile on-chain — no database needed
        adminProfiles[msg.sender] = AdminProfile({
            name:         _name,
            email:        _email,
            schoolName:   _schoolName,
            nucCode:      _nucCode,
            nucDocHash:   _nucDocHash,
            joinCode:     newCode,
            registeredAt: block.timestamp,
            exists:       true
        });

        // 9. Rotate global code — old code is now dead
        currentAdminCode = newCode;

        // 10. Fire event — all open dashboards update in real time
        emit AdminAdded(msg.sender, newCode, _schoolName, block.timestamp);
    }


    // =========================================================
    //  ADMIN PROFILE RETRIEVAL
    // =========================================================

    /**
     * @dev Returns the full on-chain profile of a registered admin.
     *      Used by the dashboard to display admin details.
     *      Only callable by whitelisted admins.
     */
    function getAdminProfile(address _admin) public view onlyAdmin returns (
        string memory name,
        string memory email,
        string memory schoolName,
        string memory nucCode,
        string memory nucDocHash,
        string memory joinCode,
        uint256       registeredAt
    ) {
        require(adminProfiles[_admin].exists, "Profile not found for this address");

        AdminProfile memory p = adminProfiles[_admin];
        return (
            p.name,
            p.email,
            p.schoolName,
            p.nucCode,
            p.nucDocHash,
            p.joinCode,
            p.registeredAt
        );
    }

    /**
     * @dev Returns the current shared verification code.
     *      Any whitelisted admin can call this.
     */
    function getCurrentCode() public view onlyAdmin returns (string memory) {
        return currentAdminCode;
    }


    // =========================================================
    //  ADMIN MANAGEMENT (owner only)
    // =========================================================

    /**
     * @dev Owner removes a compromised or inactive admin.
     *      Profile stays on-chain for audit trail — only access is revoked.
     */
    function removeAdmin(address _admin) public onlyOwner {
        require(_admin != owner,     "Cannot remove the contract owner");
        require(admins[_admin],      "Address is not an admin");

        admins[_admin] = false;
        emit AdminRemoved(_admin, block.timestamp);
    }

    /**
     * @dev Check if an address is a whitelisted admin.
     *      Called by role.js on wallet connect to decide redirect.
     */
    function isAdmin(address _user) public view returns (bool) {
        return admins[_user];
    }


    // =========================================================
    //  CERTIFICATE FUNCTIONS
    // =========================================================

    /**
     * @dev Admin issues a certificate to the blockchain.
     *
     *  Validation chain:
     *    1. Certificate ID must not already exist
     *    2. Document hash must not have been used before (duplicate prevention)
     *    3. If both pass — store certificate and mark hash as used
     */
    function issueCertificate(
        string memory _certificateID,
        string memory _studentName,
        string memory _certificateType,
        string memory _school,
        string memory _graduationDate,
        string memory _certificateHash
    ) public onlyAdmin {
        // 1. Prevent duplicate Certificate IDs
        require(!certificates[_certificateID].isIssued, "Error: Certificate ID already exists");

        // 2. Prevent the same document being issued twice.
        //    Convert the SHA-256 string hash to bytes32 using keccak256
        //    so it can be stored cheaply as a fixed-size key.
        bytes32 docKey = keccak256(abi.encodePacked(_certificateHash));
        require(
            !usedDocumentHashes[docKey],
            "Error: This document has already been issued. The same file cannot be used for two certificates."
        );

        // 3. Store certificate on-chain
        certificates[_certificateID] = Certificate({
            certificateID:   _certificateID,
            studentName:     _studentName,
            certificateType: _certificateType,
            school:          _school,
            graduationDate:  _graduationDate,
            certificateHash: _certificateHash,
            timestamp:       block.timestamp,
            isValid:         true,
            isIssued:        true
        });

        // 4. Mark document hash as permanently used
        usedDocumentHashes[docKey] = true;

        allCertificateIDs.push(_certificateID);
        emit CertificateIssued(_certificateID, _studentName, block.timestamp);
    }

    /**
     * @dev Public helper — check if a document has already been issued.
     *      The dashboard calls this BEFORE the issue transaction
     *      so it can show a warning to the admin immediately,
     *      without waiting for MetaMask to fire and revert.
     *
     * @param _certificateHash  The SHA-256 hex string of the document file
     * @return bool  true = document already used, false = document is new
     */
    function isDocumentAlreadyIssued(string memory _certificateHash) public view returns (bool) {
        bytes32 docKey = keccak256(abi.encodePacked(_certificateHash));
        return usedDocumentHashes[docKey];
    }

    /**
     * @dev Admin revokes a certificate — sets isValid to false.
     */
    function revokeCertificate(string memory _certificateID) public onlyAdmin {
        require(certificates[_certificateID].isIssued, "Error: Certificate does not exist");
        require(certificates[_certificateID].isValid,  "Error: Certificate is already revoked");

        certificates[_certificateID].isValid = false;
        emit CertificateRevoked(_certificateID, block.timestamp);
    }

    /**
     * @dev Public verification — anyone can call this (no wallet needed).
     *      Returns certificate details and validity status.
     */
    function verifyCertificate(string memory _certificateID) public view returns (
        string memory studentName,
        string memory certificateType,
        string memory school,
        string memory graduationDate,
        bool          isValid
    ) {
        require(certificates[_certificateID].isIssued, "Error: Certificate not found on blockchain");

        Certificate memory cert = certificates[_certificateID];
        return (
            cert.studentName,
            cert.certificateType,
            cert.school,
            cert.graduationDate,
            cert.isValid
        );
    }

    /**
     * @dev Admin-only: returns all issued certificates for the ledger table.
     */
    function getAllIssuedCertificates() public view onlyAdmin returns (Certificate[] memory) {
        Certificate[] memory issuedCerts = new Certificate[](allCertificateIDs.length);

        for (uint i = 0; i < allCertificateIDs.length; i++) {
            issuedCerts[i] = certificates[allCertificateIDs[i]];
        }

        return issuedCerts;
    }


    // =========================================================
    //  INTERNAL HELPERS
    // =========================================================

    /**
     * @dev Converts a uint256 to its string representation.
     *      Used to generate NUC-AUTH-2, NUC-AUTH-3, etc.
     */
    function _uintToString(uint256 _value) internal pure returns (string memory) {
        if (_value == 0) return "0";

        uint256 temp   = _value;
        uint256 digits = 0;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (_value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(_value % 10)));
            _value /= 10;
        }

        return string(buffer);
    }
}
