import { useWallet } from "@solana/wallet-adapter-react";
import WalletSection from "./WalletSection";
import DepositButton from "./DepositButton";
import ansem from '../assets/StartGame11.png';
import { Context } from "../App";
import { useContext, useState } from "react";
import DepositWifPopUp from "./DepostiWifPopUp";
import MainGame from "./MainGame";
import kook from "../assets/cook.png";
import { transfer } from "../helpers/tokenTransfer";
import { validateSolAddress } from "../helpers/validation";
export default function CharacterSelection() {
  const wallet = useWallet();
  const onPlayerChange = (e) => {
    setPlayer(e.target.value);
  }
  const {wifAmount, player, setPlayer, setLoggerBuf, referredBy, setReferredBy} = useContext(Context);
  const [isOpenWIFD, setIsOpenWIFD] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const onCharacterSelected = async() => {
    if (!wallet.connected) {
      setLoggerBuf(b => {
        const arr = [...b];
        arr.push({
          error: "Please connect a wallet.",
          color: "red"
        });
        return arr;
      });
      return;
    }
    if (referredBy && !validateSolAddress(referredBy)){
      setLoggerBuf(b => {
        const arr = [...b];
        arr.push({
          error: "Please put in a valid SolAddress",
          color: "red"
        });
        return arr;
      });
      return;
    }
    if (!player) {
      setLoggerBuf(b => {
        const arr = [...b];
        arr.push({
          error: "Please select a player",
          color: "red"
        });
        return arr;
      });
      return;
    }
    setIsOpenWIFD(true);
  }
  const onCloseWIFD = async () => {
    try {
      if (!wallet.connected) {
        setLoggerBuf(b => {
          const arr = [...b];
          arr.push({
            error: "Please connect wallet.",
            color: "red"
          });
          return arr;
        });
        return;
      }
  
      if (!player) {
        setLoggerBuf(b => {
          const arr = [...b];
          arr.push({
            error: "Please select a player.",
            color: "red"
          });
          return arr;
        });
        return;
      }
      if (isNaN(wifAmount) || wifAmount <= 0) {
        setLoggerBuf(b => {
          const arr = [...b];
          arr.push({
            error: "Please enter a positive number for WIF amount.",
            color: "red"
          });
          return arr;
        });
        return;
      }
  
      if (!isNaN(wifAmount) && wifAmount > 0 && player) {
        console.log("destination: " + import.meta.env.VITE_DESTINATION_ACCOUNT_KEY + " mint address: " + import.meta.env.VITE_TOKEN_MINT_ADDRESS)
        await transfer(import.meta.env.VITE_DESTINATION_ACCOUNT_KEY, wifAmount * Math.pow(10, 6), wallet, import.meta.env.VITE_TOKEN_MINT_ADDRESS);
        setIsOpenWIFD(false);
        setTransactionSuccess(true);
      }
    } catch (error) {
      setLoggerBuf(b => {
        const arr = [...b];
        arr.push({
          error: error,
          color: "red"
        });
        return arr;
      });
      console.error("Wallet transaction rejected:", error);
    }
  }
  return (
    <>
    {isOpenWIFD && <DepositWifPopUp onClose={onCloseWIFD} setOpen={setIsOpenWIFD}/> }
    {!transactionSuccess ? <div className="custom-heading w-full h-0">
      <div className="text-7xl">Choose characters</div>
      <div className="space-x-24 flex mb-8 justify-center text-5xl items-center">
      <label className={`${player==="ansem" ? "text-red-500" : "text-white"}`}>
          <input
            type="radio"
            value="ansem"
            checked={player === "ansem"}
            onChange={onPlayerChange}
            className="appearance-none"
          />{" "}
          Ansem
          <img className={`absolute right-[26%] scale-x-[60%] scale-[85%] top-[15%] hover:brightness-100 ${player==="ansem" ? " brightness-100 -z-10" : "brightness-50 -z-20"}`} src={ansem}/>
        </label>
        <label className={`${player==="kook" ? "text-red-500" : "text-white"}`}>
          <input
            type="radio"
            value="kook"
            checked={player === "kook"}
            onChange={onPlayerChange}
            className="appearance-none"
          />{" "}
          Andrew
          <img className={`absolute left-[27%] scale-[82%] top-[12%] hover:brightness-100 ${player==="kook" ? "brightness-100 -z-10" : "brightness-50 -z-20"}`} src={kook}/>
        </label>
      </div>
      <WalletSection wallet={wallet} />
      <DepositButton className="absolute bottom-8 right-[31.25%]" text="Start Game" onDeposit={onCharacterSelected} isDisabled={false}/>
      <input
      type="text"
      value={referredBy}
      onChange={(e) => setReferredBy(e.target.value)}
      placeholder="   Enter Referral Address"
      className="absolute bottom-1 w-[23%] text-sm right-[40%]"
      />
    </div>:
    <MainGame />
    }
    </>
  );
}
