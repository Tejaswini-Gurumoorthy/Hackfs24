// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Identity {
    struct User {
        string name;
        string email;
        bool isVerified;
    }

    mapping(address => User) public users;

    function register(string memory _name, string memory _email) public {
        require(bytes(users[msg.sender].name).length == 0, "User already registered.");
        users[msg.sender] = User(_name, _email, false);
    }

    function verify(address _user) public {
        require(bytes(users[_user].name).length != 0, "User not registered.");
        users[_user].isVerified = true;
    }

    function getUser(address _user) public view returns (string memory, string memory, bool) {
        User memory user = users[_user];
        return (user.name, user.email, user.isVerified);
    }
}
