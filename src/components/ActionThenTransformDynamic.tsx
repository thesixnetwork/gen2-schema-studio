// import NormalButton from "../component/NormalButton";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { getAccessTokenFromLocalStorage } from "../helpers/AuthService";
// import { CircularProgress } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { Button, Select } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ActionHeader from "@/components/ActionHeader";
import { getDynamicImage } from "@/service/getDynamicImage";
import AlertModal from "./AlertModal";
import { useRouter } from "next/navigation";

import SaveButton from "./button/SaveButton";
import CancelButton from "./button/CancelButton";
import { IActions } from "@/type/Nftmngr";
import { getCookie } from "@/service/getCookie";
import { setCookie } from "@/service/setCookie";
interface ActionThenTransformDynamicProps {
  metaFunction: string;
  actionName: string;
  schemaRevision: string;
  isDraft: boolean;
  transformType: string;
  actionThenType: string;
  handleActionThenTypeChange: (newActionThenType: string) => void;
  handleTransformTypeChange: (newActionThenType: string) => void;
}

const ActionThenTransformDynamic = (props: ActionThenTransformDynamicProps) => {
  const router = useRouter();
  const [imgSource, setImgSource] = useState("");
  const [postfix, setPostfix] = useState("");
  const [prefix, setPrefix] = useState("");
  const [imgFormat, setImgFormat] = useState("");
  const [tokenId, setTokenId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [imgBeforeTransformError, setImgBeforeTransformError] = useState(false);
  const [imgAfterTransformError, setImgAfterTransformError] = useState(false);
  const [metaData, setMetaData] = useState("");
  const getCookieData = localStorage.getItem("action");
  const getActionThen = getCookie("action-then");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const getActionThanArrCookie = getCookie("action-then-arr");
  const getIsCreateNewThenFromCookie = getCookie("isCreateNewThen");
  const schemacode = getCookie("schemaCode");
  const getActionThenIndexCookie = getCookie("actionThenIndex");
  const [isOpen, setIsOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [originalMetaFunction, setOriginalMetaFunction] = useState(
    props.metaFunction
  );

  const onChange = (e: any) => {
    setImgSource(e.target.value);
  };

  const handleTokenId = (tokenId: string) => {
    if (tokenId === "") {
      setTokenId("1");
    } else {
      setTokenId(tokenId);
    }
  };

  const checkBackslash = (str: string) => {
    if (str !== "" && str !== undefined && str.endsWith("/")) {
      return str;
    } else {
      return str + "/";
    }
  };

  const convertMetaFunction = (
    imgFormat: string,
    prefix: string,
    postfix: string
  ) => {
    return `meta.SetImage(meta.ReplaceAllString(meta.GetImage(),'${prefix}${imgFormat}','${postfix}${imgFormat}'))`;
  };

  const saveAction = async () => {
    let tempArr;

    const convertStringToArray = (input: string) => {
      const jsonArray = JSON.parse(input);

      const resultArray = jsonArray.map((item: string) => {
        return item;
      });

      return resultArray;
    };

    const updateActionThenByName = (
      array: IActions[],
      name: string,
      oldThen: string,
      newThen: string
    ) => {
      const updatedArray = array.map((action) => {
        if (action.name === name && getIsCreateNewThenFromCookie === "false") {
          let updatedThen;
          if (getActionThenIndexCookie) {
            updatedThen = action.then.map((item, index) =>
              index === parseInt(getActionThenIndexCookie) ? newThen : item
            );
          }
          return { ...action, then: updatedThen };
        } else if (
          action.name === name &&
          getIsCreateNewThenFromCookie === "true"
        ) {
          const updatedThen = [...action.then, newThen];
          return { ...action, then: updatedThen };
        }
        return action;
      });

      tempArr = updatedArray;
    };
    if(metaData.startsWith("meta")){
      if (getCookieData) {
        const parsedCookieData = JSON.parse(decodeURIComponent(getCookieData));
        updateActionThenByName(
          parsedCookieData,
          props.actionName,
          originalMetaFunction,
          metaData
        );
      }
  
      if (isCreateNewActionCookie) {
        const tempArrCookie = getActionThanArrCookie
          ? convertStringToArray(decodeURIComponent(getActionThanArrCookie))
          : [];
  
        const metaDataToAdd =
          typeof metaData === "string" ? metaData : JSON.stringify(metaData);
  
        let updatedTempArrCookie;
        if (getActionThenIndexCookie) {
          updatedTempArrCookie = tempArrCookie.map(
            (item: string, index: number) =>
              index === parseInt(getActionThenIndexCookie) ? metaDataToAdd : item
          );
        }
  
        if (getIsCreateNewThenFromCookie === "true") {
          if (!tempArrCookie.includes(originalMetaFunction)) {
              updatedTempArrCookie = tempArrCookie
            updatedTempArrCookie.push(metaDataToAdd);
          }
        }
  
        setCookie("action-then-arr", JSON.stringify(updatedTempArrCookie));
      }
      localStorage.setItem("action", JSON.stringify(tempArr));
      setCookie("action-then", metaData);
      setCookie("isEditAction", "true");
      setCookie("isTransfrom", "true");
      setCookie("imgSource", imgSource);
      setCookie("imgFormat", imgFormat);
      setCookie("prefix", prefix);
      setCookie("postfix", postfix);
      router.push(isCreateNewActionCookie === "true"
      ? `/newdraft/6/${schemacode}/action-form/create-new-action`
      : `/newdraft/6/${schemacode}/action-form/${props.actionName}`)
    }else{
      setIsOpen(true)
      setErrorModalMessage("Please create your then")
    }
  };

  const findImageUrl = async () => {
    const apiUrl = `${process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO}schema/get_image_url/${props.schemaRevision}`;
    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
    };
    await axios
      .get(apiUrl, {
        params: params,
        headers: headers,
      })
      .then((response) => {
        setImgSource(response.data.data.image_url.path);
        setImgFormat("." + response.data.data.image_url.format);
        if (response.data.data.image_url.postfix !== null) {
          setPostfix(response.data.data.image_url.postfix);
        }
        // setIsNext(true);
        setLoading(false);
        console.log(":: res ::", response);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
    let tempObj;
    if (schemacode) {
      tempObj = await getDynamicImage(schemacode);
    }
    console.log(tempObj);
    if (tempObj) {
      setImgSource(tempObj.path);
      setImgFormat("." + tempObj.format);
      if (tempObj.postfix !== null) {
        setPostfix(tempObj.postfix);
      }
    }
  };

  useEffect(() => {
    console.log("logger", props.schemaRevision);
    props.schemaRevision !== "create-new-action" &&
      props.isDraft &&
      findImageUrl();
    //   &&
    //   setIsNext(true);
  }, []);

  useEffect(() => {
    setImgAfterTransformError(false);
    setImgBeforeTransformError(false);

    imgFormat !== "" &&
      setMetaData(convertMetaFunction(imgFormat, prefix, postfix));
  }, [imgSource, imgFormat, prefix, postfix, tokenId]);

  return (
    <>
     {isOpen && (
        <AlertModal
          title={errorModalMessage}
          type="error"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    <div className="flex flex-col  px-8">
      <ActionHeader
        type="then"
        actionName={props.actionName}
        metaFunction={metaData}
        transformType={props.transformType}
        actionThenType={props.actionThenType}
        handleActionThenTypeChange={props.handleActionThenTypeChange}
        handleTransformTypeChange={props.handleTransformTypeChange}
      />
      {props.transformType === "dynamic" && (
        <div className="w-full flex justify-center gap-x-20	items-center mt-4">
          {loading ? (
            // <CircularProgress
            //   className=" text-white"
            //   sx={{
            //     width: 300,
            //     color: "white",
            //   }}
            // ></CircularProgress>
            <div>Loading</div>
          ) : (
            <div className="flex flex-col">
              <div className="border rounded-2xl p-8 flex justify-center bg-white">
                <div className="w-[40vw] flex flex-col justify-between ">
                  <div className="mb-2">
                    <h2 className="text-main2 font-semibold">Image Path</h2>
                    <input
                      id=""
                      type="text"
                      className="my-2 rounded-sm bg-[#F5F6FA] text-Act6 text-[14px] border-[1px] border-Act6 focus:border-Act6 placeholder-gray-300 border-dashed p-1 focus:outline-none w-full h-[40px]"
                      placeholder="example: https://techsauce-nft.sixprotocol.com/techsauce/"
                      onChange={(e) => {
                        onChange(e);
                      }}
                      value={imgSource}
                    />
                  </div>
                  <div className="mb-2">
                    <h2 className="text-main2 font-semibold">
                      Origin Image Format
                    </h2>
                    <Select
                      onChange={(e) => {
                        setImgFormat(e.target.value);
                      }}
                      value={imgFormat}
                      defaultValue={imgFormat}
                      className="text-Act6 px-4 py-2 my-2 bg-[#F5F6FA] border  border-Act6 rounded-md hover:bg-opacity-60"
                    >
                      <option value="" disabled selected hidden>
                        -- select --
                      </option>
                      <option value=".png">png</option>
                      <option value=".jpeg">jpeg</option>
                      <option value=".jpg">jpg</option>
                      <option value=".gif">gif</option>
                    </Select>
                  </div>
                  <div className="my-4">
                    <div className="flex">
                      <h2 className="text-main2 font-semibold">Token Id</h2>
                      <span className="text-main2">
                        (For Preview Transformed Tokens)
                      </span>
                    </div>
                    <input
                      id=""
                      type="text"
                      className=" my-2 rounded-sm bg-[#F5F6FA] text-Act6 text-[14px] border-[1px] border-Act6 focus:border-Act6 placeholder-gray-300 border-dashed p-1 focus:outline-none w-full h-[40px]"
                      placeholder="example: 1"
                      onChange={(e) => {
                        handleTokenId(e.target.value);
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <h2 className="text-main2 font-semibold">
                      Dynamic Image Prefix
                    </h2>
                    <input
                      id=""
                      type="text"
                      className=" my-2 rounded-sm bg-[#F5F6FA] text-Act6 text-[14px] border-[1px] border-Act6 focus:border-Act6 placeholder-gray-300 border-dashed p-1 focus:outline-none w-full h-[40px]"
                      placeholder="example: -original"
                      onChange={(e) => setPrefix(e.target.value)}
                      value={prefix}
                    />
                    {imgSource !== "" && (
                      <div className="bg-[#F5F6FA] rounded-md p-3 mb-2">
                        <span className="text-Act6">
                          {checkBackslash(imgSource)}
                        </span>
                        <span className="text-red-600">
                          &#123;&#123;token_id&#125;&#125;
                        </span>
                        <span className="text-Act6">
                          {prefix}
                          {imgFormat}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center h-36">
                      {imgBeforeTransformError ? (
                        <p className="flex items-center text-center h-full">
                          Image couldn&apos;t be load
                        </p>
                      ) : (
                        imgSource !== "" && (
                          <div className="h-full rounded-lg border-2 overflow-hidden">
                            <img
                              src={`${checkBackslash(
                                imgSource
                              )}${tokenId}${prefix}${imgFormat}`}
                              alt="preview-image"
                              className="h-36 w-auto"
                              onError={() => setImgBeforeTransformError(true)}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="mb-2">
                    <h2 className="text-main2 font-semibold">
                      Dynamic Image Posfix
                    </h2>
                    <input
                      id=""
                      type="text"
                      className=" my-2 rounded-sm bg-[#F5F6FA] text-Act6 text-[14px] border-[1px] border-Act6 focus:border-Act6 placeholder-gray-300 border-dashed p-1 focus:outline-none w-full h-[40px]"
                      placeholder="example: -transformed"
                      onChange={(e) => setPostfix(e.target.value)}
                      value={postfix}
                    />
                    {imgSource !== "" && (
                      <div className="bg-[#F5F6FA] rounded-md p-3 mb-2">
                        <span className="text-Act6">
                          {checkBackslash(imgSource)}
                        </span>
                        <span className="text-red-600">
                          &#123;&#123;token_id&#125;&#125;
                        </span>
                        <span className="text-Act6">
                          {postfix}
                          {imgFormat}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center h-36">
                      {imgAfterTransformError ? (
                        <p className="flex items-center text-center h-full">
                          Image couldn&apos;t be load
                        </p>
                      ) : (
                        imgSource !== "" && (
                          <div className="h-full rounded-lg border-2 overflow-hidden">
                            <img
                              src={`${checkBackslash(
                                imgSource
                              )}${tokenId}${postfix}${imgFormat}`}
                              alt="preview-image"
                              className="h-36 w-auto"
                              onError={() => setImgAfterTransformError(true)}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-x-8 mt-4">
                <Link
                  href={
                    isCreateNewActionCookie === "true"
                      ? `/newdraft/6/${schemacode}/action-form/create-new-action`
                      : `/newdraft/6/${schemacode}/action-form/${props.actionName}`
                  }
                  onClick={() => setCookie("isEditAction", "true")}
                >
                  <CancelButton />
                </Link>
                <button
                  onClick={async () => {
                    await saveAction();
                  }}
                >
                  <SaveButton />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ActionThenTransformDynamic;
