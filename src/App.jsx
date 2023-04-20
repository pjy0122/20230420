import { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./web3.config";

const web3 = new Web3("https://rpc-mumbai.maticvigil.com"); // 이 위치에 작성해도 문제가 없기 때문에 여기 쓰는것.
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

function App() {
  const [account, setAccount] = useState(""); // 함수형 컴포넌트 안에서 훅스를 불러와야하기 때문에 모든 const가 App안에 들어와있는것.
  const [myBalance, setMyBalance] = useState();

  const onClickAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickLogOut = () => {
    setAccount("");
  };

  const onClickBalance = async () => {
    try {
      if (!account || !contract) return;

      const balance = await contract.methods.balanceOf(account).call();
      // const totalSupply = await contract.methods.totalSupply().call();

      setMyBalance(web3.utils.fromWei(balance));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-green-100 min-h-screen flex justify-center items-center">
      {account ? (
        <div>
          <div className="text-main font-semibold text-2xl">
            {account.substring(0, 4)}...
            {account.substring(account.length - 4)}
            <button className="ml-4 btn-style" onClick={onClickLogOut}>
              로그아웃
            </button>
          </div>
          <div className="flex items-center">
            {myBalance && <div>{myBalance} tMatic</div>}
            <button className="ml-2 btn-style" onClick={onClickBalance}>
              잔액 조회
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-style" onClick={onClickAccount}>
          <img
            className="w-12"
            src={`${process.env.PUBLIC_URL}/images/metamask.png`}
          />
        </button>
      )}
    </div>
  );
}

export default App;
