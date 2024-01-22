import React, { useEffect, useState } from "react";
import test_img from "../../public/pic/BuaKaw_Pic.png";
import draft_icon from "../../public/pic/draft_icon_nobg.png";

import testnet_icon from "../../public/pic/testnet-icon.png";
import Image from "next/image";
import axios from "axios";
import ENV from "@/utils/ENV";
import { useRouter } from "next/navigation";
import logoNFTGen2 from "../../public/pic/logo-nftgen2.png";
import { useSession } from "next-auth/react";
import e_coin from "../../public/pic/e_coin.png";
import s_coin from "../../public/pic/chainlogocolor1.png"
import k_coin from "../../public/pic/chainlogocolor3.png"
import b_coin from "../../public/pic/chainlogocolor4.png"

type ChainMapper = {
  FIVENET: string;
  SIXNET: string;
  GOERLI: string;
  ETHEREUM: string;
  BAOBAB: string;
  KLAYTN: string;
  BNBT: string;
  BNB: string;
};
type Props = {
  schema_revision: any;
  CollectionName: any;
  CollectionImage: any;
  OriginChain: keyof ChainMapper;
  OriginContractAddress: string;
  type?: string;
};

function HomeDraftCard(props: Props) {
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [TotalSupply, setTotalSupply] = useState(0);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  // console.log("TotalSupply",TotalSupply)
  // console.log("OriginChain",props.OriginChain)
  // console.log("OriginContractAddress",props.OriginContractAddress)
  const chainMapper = {
    FIVENET: "150",
    SIXNET: "98",
    GOERLI: "5",
    ETHEREUM: "1",
    BAOBAB: "1001",
    KLAYTN: "8217",
    BNBT: "97",
    BNB: "56",
  };

  const handleError = () => {
    setError(true);
  };

  useEffect(() => {
    const getImage = async () => {
      try {
        if (props.CollectionImage) {
          await axios.get(props.CollectionImage).then((res) => {
            console.log(res);
            setImgUrl(res.data.image);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        // console.log(err);
        setLoading(false);
      }
    };
    const getTotalSupply = async () => {
      const apiUrl = `${ENV.Client_API_URL}schema/total_supply_from_contract`; // Replace with your API endpoint
      const params = {
        contract_address: `${props.OriginContractAddress}`,
        chain_id: chainMapper[props.OriginChain],
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      };
      try {
        const req = await axios.get(apiUrl, {
          params: params, // Pass parameters as an object
          headers: headers, // Pass headers as an object
        });
        // console.log(req.data.data.total)
        setTotalSupply(req.data.data.total)
        return;
      } catch (err) {
        // console.log(err);
        setLoading(false);
      }
    };
    getImage();
    if (props.OriginChain && props.OriginContractAddress) {
      getTotalSupply();
    }
  }, []);

  //write code in tailwind to graedient this color linear-gradient(90deg, rgba(122,142,215,0.55) 0%, rgba(9,9,121,0.55) 50%, rgba(217,217,217,0.3) 100%)

  return (
    <div className=" w-draftCardWidth h-draftCardHeight  rounded-2xl bg-gradient-24 from-Act7 via-bg to-Act7 p-[0.08rem] ">
      <div className=" relative h-full w-full    ">
        <div
          className=" w-full h-full rounded-2xl bg-bg p-3 flex flex-col  items-center justify-between"
          onClick={() => {
            router.push(`/newdraft/1/${props.schema_revision}`, {
              scroll: false,
            });
          }}
        >
          {props.CollectionImage === "" ? (
            props.type === "testnet" ? (
              <Image
                className=" w-40 h-40 mb-1"
                src={logoNFTGen2}
                alt={"pic"}
              ></Image>
            ) : (
              <div className=" h-[70%] flex justify-center items-center">
                {/* <div className=" relative w-draftCardWidth hover:scale-105 duration-300 cursor-pointer   ">
              <Image
                className="z-20 w-7 h-7 hover:scale-110 duration-300 cursor-pointer absolute top-2 right-2"
                src={deleate_icon}
                alt={"delete"}
                // onClick={props.onDelete}
              ></Image>
              </div> */}
                <p className=" text-main2">No image</p>
              </div>
            )
          ) : error ? (
            <div className=" h-[70%] flex justify-center items-center">
              <p className=" text-main2">Image couldn&apos;t be loaded</p>
            </div>
          ) : (
            <div className=" relative    w-[12.6rem] h-[14rem]">
              <img
                className=" object-cover   w-[12.6rem] h-[14rem] rounded-lg"
                src={imgUrl}
                alt={"pic"}
                onError={() => handleError()}
              ></img>
              <div className=" absolute w-full h-[2.5rem] flex justify-between px-[15%] items-center backdrop-blur-md backdrop-brightness-110 rounded-b-lg left-0 bottom-0 ">
                {props.OriginChain === "FIVENET" || props.OriginChain === "SIXNET" &&
                  <Image className=" w-8 h-8" src={s_coin} alt={""}></Image>
                }
                {props.OriginChain === "BNB" || props.OriginChain === "BNBT" &&
                  <Image className=" w-8 h-8" src={b_coin} alt={""}></Image>
                }
                {props.OriginChain === "ETHEREUM" || props.OriginChain === "GOERLI" &&
                  <Image className=" w-8 h-8" src={e_coin} alt={""}></Image>
                }
                {props.OriginChain === "KLAYTN" || props.OriginChain === "BAOBAB" &&
                  <Image className=" w-8 h-8" src={k_coin} alt={""}></Image>
                }
                <p className=" text-Act1">{TotalSupply} Items</p>
              </div>
            </div>
          )}

          <div className=" text-main2 w-full h-[4.5rem] flex flex-col p-2 justify-end relative border-t border-t-Act7 ">
            {/* <div className=" w-full h-[0.08rem] bg-Act7 "></div> */}
            <p className=" font-bold text-base ">{props.CollectionName}</p>
            <p className=" font-bold text-base ">collection</p>
            <Image
              className=" absolute right-0 top-2 w-10"
              src={props.type === "testnet" ? testnet_icon : draft_icon}
              alt={""}
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(HomeDraftCard);
