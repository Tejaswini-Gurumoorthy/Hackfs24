import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import IdentityContract from './contracts/Identity.json';

const App = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [user, setUser] = useState({ name: '', email: '', isVerified: false });

    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                } catch (error) {
                    console.error("User denied account access");
                }
            } else if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider);
            } else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        };

        const loadBlockchainData = async () => {
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const networkData = IdentityContract.networks[networkId];
            if (networkData) {
                const identity = new web3.eth.Contract(IdentityContract.abi, networkData.address);
                setContract(identity);
            } else {
                window.alert('Identity contract not deployed to detected network.');
            }
        };

        loadWeb3();
        loadBlockchainData();
    }, []);

    const registerUser = async (name, email) => {
        await contract.methods.register(name, email).send({ from: account });
    };

    const getUser = async () => {
        const userData = await contract.methods.getUser(account).call();
        setUser({ name: userData[0], email: userData[1], isVerified: userData[2] });
    };

    return (
        <div>
            <h1>Decentralized Identity Verification</h1>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <button onClick={() => registerUser(user.name, user.email)}>Register</button>
                <button onClick={getUser}>Get User</button>
            </div>
            <div>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Verified: {user.isVerified.toString()}</p>
            </div>
        </div>
    );
};

export default App;
