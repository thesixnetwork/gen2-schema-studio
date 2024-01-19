import React, { useEffect, useState } from "react";
import test_img from "../../public/pic/BuaKaw_Pic.png";
import draft_icon from "../../public/pic/draft_icon_nobg.png";
import deleate_icon from '../../public/pic/deleate_attribute_card.png';
import testnet_icon from "../../public/pic/testnet-icon.png";
import Image from "next/image";
import axios from "axios";
import ENV from "@/utils/ENV";
import { useRouter } from "next/navigation";
import logoNFTGen2 from "../../public/pic/logo-nftgen2.png";
import { useSession } from "next-auth/react";

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
  const router = useRouter();
  const { data: session } = useSession();


  const handleError = () => {
    setError(true);
  };

  const handleDelete = async () => {
    const apiUrl = `${ENV.Client_API_URL}/schema/delete_daft/${props.schema_revision}`;
    // console.log(apiUrl)
    try {
      const req = await axios.delete(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`, // Set the content type to JSON
        },
      });
      const res = req.data;
      // console.log(res);

      if (res.statusCode === "V:0001") {
        console.log("Deleted")
        return;
      } else {
        return;
      }
    } catch (error) {
      console.log("error ", error);
    }
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
      <div className=" relative h-full w-full hover:scale-105 duration-300 cursor-pointer   " >
        {/* <div > */}
              <Image
                className="z-20 w-7 h-7 hover:scale-110 duration-300 cursor-pointer absolute top-2 right-2"
                src={deleate_icon}
                alt={"delete"}
                onClick={() => handleDelete()}
              ></Image>
              {/* </div> */}
      <div className=" w-full h-full rounded-2xl bg-bg p-3 flex flex-col  items-center" onClick={() => {
                            router.push(`/newdraft/1/${props.schema_revision}`, {
                              scroll: false,
                            });
                          }}>
        {props.CollectionImage === "" ? (
          props.type === "testnet" ? (
            <Image
              className=" w-40 h-40 mb-1"
              src={logoNFTGen2}
              alt={"pic"}
            ></Image>
          ) : (
            <div className=" h-[50%] flex justify-center items-center">
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
