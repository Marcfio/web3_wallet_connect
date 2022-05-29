import { useEffect, useState } from "react";
import {
  VStack,
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Input,
  Box
} from "@chakra-ui/react";
import SelectWalletModal from "./Modal";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { networkParams } from "./networks";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";
import { ethers } from 'ethers';
import contract from './abi.json';
import logo from './img/logo.jpg';
import qrcode from './img/verifica.png';
import { providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";


const contractAddress = "0xB838D92019595C5d59735d9acd4B17C91Bba3337";
const abi = contract;


export default function Home() {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    library,
    chainId,
    account,
    activate,
    deactivate,
    active
  } = useWeb3React();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();
  const [passed, setTransaction] = useState(0);

  const provider = new WalletConnectProvider({
    infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
  });



  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));

  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account]
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }

  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature]
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  const testaccount = () =>{
    console.log("id:" + chainId);
    console.log("account:" + account);
    const provider = new WalletConnectProvider({
      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
    });
    //await provider.enable();


    const _provider = new providers.Web3Provider(provider);
    const signer = _provider.getSigner();
    const nftContract = new ethers.Contract(contractAddress, abi, signer);
    console.log("contract address" + contractAddress);
    console.log(abi);
    console.log(_provider);
    console.log(signer);
    console.log(nftContract);

  }

  const verify_contract_conn = async () =>{

       console.log(passed);



       console.log("id:" + chainId);
       console.log("account:" + account);
       const provider = new WalletConnectProvider({
         infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
       });
       //await provider.enable();


       const _provider = new providers.Web3Provider(provider);

       // const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = _provider.getSigner();
       console.log(signer);
       const nftContract = new ethers.Contract(contractAddress, abi, signer);
       console.log("Initialize payment");
       let nftTxn = await nftContract.entry_check();
       console.log("Matic...please wait");
       await nftTxn.wait();
       console.log("Transaction executed  ${nftTxn.hash}");
       console.log(nftTxn.hash);
       const hash = nftTxn.hash;

       // setVerified(verify === account.toLowerCase());
       setTransaction(1);
       console.log(passed)

  }

  const verify_contract_conn_desktop = async () =>{

       console.log(passed);



       console.log("id:" + chainId);
       console.log("account:" + account);
       const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = provider.getSigner();
       console.log(signer);
       const nftContract = new ethers.Contract(contractAddress, abi, signer);
       console.log("Initialize payment");
       let nftTxn = await nftContract.entry_check();
       console.log("Matic...please wait");
       await nftTxn.wait();
       console.log("Transaction executed  ${nftTxn.hash}");
       console.log(nftTxn.hash);
       const hash = nftTxn.hash;

       // setVerified(verify === account.toLowerCase());
       setTransaction(1);
       console.log(passed)

  }



  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, []);

  return (


    <>


      <VStack justifyContent="center" alignItems="center" h="100vh">
        <div>
            <img src={logo} />
        </div>
        <HStack marginBottom="10px">
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
          >
            Let's verify from Wallecto
          </Text>

        </HStack>
        <HStack>
            <div>
               <b>{passed ?

                <img src={qrcode} /> :

                 'The user is not authorized'}</b>
            </div>
        </HStack>

        <HStack>

            <Button onClick={testaccount}>DATI</Button>

        </HStack>





        <HStack>

            <Button onClick={verify_contract_conn}>VERIFICA MOBILE</Button>

        </HStack>


        <HStack>

            <Button onClick={verify_contract_conn_desktop}>VERIFICA DESKTOP</Button>

        </HStack>


        <HStack>
          {!active ? (
            <Button onClick={onOpen}>Connect Wallet</Button>
          ) : (
            <Button onClick={disconnect}>Disconnect</Button>
          )}
        </HStack>

        <VStack justifyContent="center" alignItems="center" padding="10px 0">
          <HStack>
            <Text>{`Connection Status: `}</Text>
            {active ? (
              <CheckCircleIcon color="green" />
            ) : (
              <WarningIcon color="#cd5700" />
            )}
          </HStack>

          <Tooltip label={account} placement="right">
            <Text>{`Account: ${(account)}`}</Text>
          </Tooltip>
          <Text>{`Network ID: ${chainId ? chainId : "No Network"}`}</Text>
        </VStack>
        {active && (
          <HStack justifyContent="flex-start" alignItems="flex-start">
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
          <VStack>
                ff

          </VStack>
            </Box>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack>
                FF
              </VStack>
            </Box>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack>
              FF
              </VStack>
            </Box>
          </HStack>
        )}
        <Text>{error ? error.message : null}</Text>
         </VStack>
       <SelectWalletModal isOpen={isOpen} closeModal={onClose} />

    </>


  );
}
