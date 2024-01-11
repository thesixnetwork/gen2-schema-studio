import React, { useEffect, useState } from "react";
import test_img from "../../public/pic/BuaKaw_Pic.png";
import draft_icon from "../../public/pic/draft_icon_nobg.png";
import Image from "next/image";
import axios from "axios";
import logoNFTGen2 from "../../public/pic/logo-nftgen2.png";
type Props = {
  schema_revision: any;
  CollectionName: any;
  CollectionImage: any;
  type?: string;
};

function HomeDraftCard(props: Props) {
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
    getImage();
  }, []);

  //write code in tailwind to graedient this color linear-gradient(90deg, rgba(122,142,215,0.55) 0%, rgba(9,9,121,0.55) 50%, rgba(217,217,217,0.3) 100%)

  return (
    <div className=" w-draftCardWidth h-draftCardHeight  rounded-2xl bg-gradient-24 from-Act7 via-bg to-Act7 p-[0.08rem] hover:scale-105 duration-500 cursor-pointer">
      <div className=" w-full h-full rounded-2xl bg-bg p-3 flex flex-col  items-center">
        {props.CollectionImage === "" ? (
          props.type === "testnet" ? (
            <Image
              className=" w-40 h-40 mb-1"
              src={logoNFTGen2}
              alt={"pic"}
            ></Image>
          ) : (
            <div className=" h-[50%] flex justify-center items-center">
              <p className=" text-main2">No image</p>
            </div>
          )
        ) : error ? (
          <div className=" h-[50%] flex justify-center items-center">
            <p className=" text-main2">Image couldn&apos;t be loaded</p>
          </div>
        ) : (
          <img
            className=" w-40 h-40 mb-1"
            src={imgUrl}
            alt={"pic"}
            onError={() => handleError()}
          ></img>
        )}
        <div className=" w-full h-[0.08rem] bg-Act7 "></div>
        <div className=" text-main2 w-full relative mt-3 ">
          <p className=" font-bold text-sm">{props.CollectionName}</p>
          <p className=" font-bold text-sm">collection</p>
          <Image
            className=" absolute right-0 top-0 w-10"
            src={draft_icon}
            alt={""}
          ></Image>
        </div>
      </div>
    </div>
  );
}

export default React.memo(HomeDraftCard);
