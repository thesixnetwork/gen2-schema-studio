"use client";
import Image from "next/image";
import Draft_Icon from "../../public/pic/Draft_Icon.png";
import Live_Icon from "../../public/pic/Live_Icon.png";
import Testnet_Icon from "../../public/pic/Testnet_Icon.png";
import HomeNewintregationCard from "./HomeNewintregationCard";
// import { getListDraft } from '../app/home/actions'
import { getAccessTokenFromLocalStorage } from "@/helpers/AuthService";
import axios from "axios";
import { useEffect, useState } from "react";
import HomeDraftCard from "./HomeDraftCard";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { getListDraft } from "@/service/getListDraft";
import getDataTestnet from "@/service/getDataTestnet";
import { ISchemaInfo } from "@/type/Nftmngr";

type Props = {};

export default function HomeCard({}: Props) {
  const router = useRouter();
  const items = ["Draft", "Live", "Testnet"];
  // const listDraft = await getListDraft();
  const [listDraft, setListdraft] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [testDraft, setTestDraft] = useState([]);
  const fivenetScan = process.env.NEXT_PUBLIC__SIXSCAN_FIVENET;
  // const getListDraft = async () => {
  //     const apiUrl = `${process.env.NEXT_PUBLIC__API_ENDPOINT_SCHEMA_INFO}schema/list_draft`;
  //     const params = {};
  //     const headers = {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
  //     };

  //     try {
  //         const response = await axios.get(apiUrl, {
  //             params: params,
  //             headers: headers,
  //         });
  //         console.log("list :", response.data.data.sesstion);
  //         setListdraft(response.data.data.sesstion);
  //         // return response.data.data.sesstion;

  //     } catch (error) {
  //         // console.error("Error:", error);
  //         // return null
  //     }
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list_draft = await getListDraft();
        console.log(">>.", list_draft);
        console.log("five", fivenetScan);
        setListdraft(list_draft);
        const test_draft = await getDataTestnet();
        console.log(">>>.", test_draft);
        setTestDraft(test_draft.data.result);
        setIsLoading(false);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <Loading></Loading>}
      {items.map((item, index) => (
        <div key={index} className=" flex flex-col">
          <div className=" w-full h-10 flex justify-center items-center relative">
            <div className=" w-24 ">
              {index === 0 && <Image src={Draft_Icon} alt={""}></Image>}
              {index === 1 && <Image src={Live_Icon} alt={""}></Image>}
              {index === 2 && <Image src={Testnet_Icon} alt={""}></Image>}
            </div>
            <div className=" w-full h-full flex flex-col justify-between">
              <p className=" text-main2 text-2xl">{items[index]}</p>
              <div className=" h-[1px] w-full border-b border-t-transparent border-Act1"></div>
            </div>
          </div>
          <div className=" w-full h-96 flex items-end">
            {index === 0 && (
              <div className="flex items-center h-full w-full overflow-scroll">
                {listDraft &&
                  listDraft.map(
                    (
                      item: {
                        schema_revision: any;
                        schema_name: any;
                        schema_info: {
                          schema_info: {
                            origin_data: { origin_base_uri: any };
                          };
                        }[];
                      },
                      index: any
                    ) => (
                      <div key={index} className=" ml-3 flex">
                        {index === 0 && (
                          <div
                            className=" mr-3"
                            onClick={() => {
                              router.push(`/class`, { scroll: false });
                            }}
                          >
                            <HomeNewintregationCard></HomeNewintregationCard>
                          </div>
                        )}
                        <div
                          onClick={() => {
                            router.push(`/newdraft/1/${item.schema_revision}`, {
                              scroll: false,
                            });
                          }}
                        >
                          <HomeDraftCard
                            schema_revision={item.schema_revision}
                            CollectionName={
                              item.schema_info[0].schema_info.code
                            }
                            CollectionImage={
                              item.schema_info &&
                              item.schema_info[0] &&
                              item.schema_info[0].schema_info.origin_data
                                .origin_base_uri
                            }
                          ></HomeDraftCard>
                        </div>
                      </div>
                    )
                  )}
              </div>
            )}
            {index === 2 && (
              <div className="flex items-center h-full w-full overflow-scroll">
                {testDraft &&
                  testDraft.map((item: ISchemaInfo, index: any) => (
                    <div key={index} className=" ml-3 flex">
                      <a
                        target="_blank"
                        href={`${fivenetScan}schema/${item.schema_name}`}
                      >
                        <HomeDraftCard
                          schema_revision={item.schema_revision}
                          CollectionName={item.schema_name}
                          CollectionImage={
                            item.schema_info &&
                            item.schema_info.schema_info.origin_data
                              .origin_base_uri
                          }
                          type="testnet"
                        ></HomeDraftCard>
                      </a>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
