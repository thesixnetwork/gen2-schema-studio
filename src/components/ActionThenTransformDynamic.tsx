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
  const schemacode = "create.new_v1";
  const [imgSource, setImgSource] = useState("");
  const [postfix, setPostfix] = useState("");
  const [prefix, setPrefix] = useState("");
  const [isNext, setIsNext] = useState(false);
  const [imgFormat, setImgFormat] = useState("");
  const [tokenId, setTokenId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [imgBeforeTransformError, setImgBeforeTransformError] = useState(false);
  const [imgAfterTransformError, setImgAfterTransformError] = useState(false);
  const [metaData, setMetaData] = useState(
    "Please input your dynamic image path"
  );
  const getCookieData = getCookie("action");
  const getActionThen = getCookie("action-then");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const getActionThanArrCookie = getCookie("action-then-arr");
  const getIsCreateNewThenFromCookie = getCookie("isCreateNewThen");
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

  const handleNext = () => {
    setIsNext(true);
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
          const updatedThen =
            action.then.length > 0
              ? action.then.map((item) => (item === oldThen ? newThen : item))
              : [newThen];
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

      const updatedTempArrCookie = tempArrCookie.map((item: string) =>
        item === originalMetaFunction ? metaDataToAdd : item
      );

      if (originalMetaFunction === "create-new-then") {
        if (!tempArrCookie.includes(originalMetaFunction)) {
          updatedTempArrCookie.push(metaDataToAdd);
        }
      }

      setCookie("action-then-arr", JSON.stringify(updatedTempArrCookie));
    }

    setCookie("action", JSON.stringify(tempArr));
    setCookie("action-then", metaData);
    setCookie("isEditAction", "true");
    setCookie("isTransfrom", "true");
    setCookie("imgSource", imgSource);
    setCookie("imgFormat", imgFormat);
    setCookie("prefix", prefix);
    setCookie("postfix", postfix);
  };

  const saveImageUrl = async () => {
    const apiUrl = `${process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO}schema/set_image_url`;
    const requestData = {
      schema_code: props.schemaRevision,
      path: imgSource,
      postfix: postfix,
      format: imgFormat.replace(".", ""),
      dynamic: true,
    };
    await axios
      .post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
        },
      })
      .then((response) => {
        console.log("API Response saveImageUrl :", response.data);
        console.log("Request :", requestData);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
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
    const tempObj = await getDynamicImage(schemacode);
    console.log(tempObj);
    setImgSource(tempObj.path);
    setImgFormat("." + tempObj.format);
    if (tempObj.postfix !== null) {
      setPostfix(tempObj.postfix);
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
    <div className="flex flex-col">
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
            <>
              <div className="border rounded-2xl p-8 flex justify-center bg-white">
                <div className="w-[40vw] flex flex-col justify-between ">
                  <div className="mb-2">
                    <h2 className="text-[#44498D] font-semibold">Image Path</h2>
                    <input
                      id=""
                      type="text"
                      autoFocus
                      className="my-2 rounded-sm bg-[#F5F6FA] text-[#3980F3] text-[14px] border-[1px] border-[#3980F3] focus:border-[#3980F3] placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-full h-[40px]"
                      placeholder="example: https://techsauce-nft.sixprotocol.com/techsauce/"
                      onChange={(e) => {
                        onChange(e);
                      }}
                      value={imgSource}
                    />
                  </div>
                  <div className="mb-2">
                    <h2 className="text-[#44498D] font-semibold">
                      Origin Image Format
                    </h2>
                    <Select
                      onChange={(e) => {
                        setImgFormat(e.target.value);
                      }}
                      value={imgFormat}
                      defaultValue={imgFormat}
                      className="text-[#3980F3] px-4 py-2 my-2 bg-[#F5F6FA] border  border-[#3980F3] rounded-md hover:bg-opacity-60"
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
                      <h2 className="text-[#44498D] font-semibold">Token Id</h2>
                      <span className="text-[#44498D]">
                        (For Preview Transformed Tokens)
                      </span>
                    </div>
                    <input
                      id=""
                      type="text"
                      autoFocus
                      className=" my-2 rounded-sm bg-[#F5F6FA] text-[#3980F3] text-[14px] border-[1px] border-[#3980F3] focus:border-[#3980F3] placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-full h-[40px]"
                      placeholder="example: 1"
                      onChange={(e) => {
                        handleTokenId(e.target.value);
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <h2 className="text-[#44498D] font-semibold">
                      Dynamic Image Prefix
                    </h2>
                    <input
                      id=""
                      type="text"
                      autoFocus
                      className=" my-2 rounded-sm bg-[#F5F6FA] text-[#3980F3] text-[14px] border-[1px] border-[#3980F3] focus:border-[#3980F3] placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-full h-[40px]"
                      placeholder="example: -original"
                      onChange={(e) => setPrefix(e.target.value)}
                      value={prefix}
                    />
                    {imgSource !== "" && (
                      <div className="bg-[#F5F6FA] rounded-md p-3 mb-2">
                        <span className="text-[#3980F3]">
                          {checkBackslash(imgSource)}
                        </span>
                        <span className="text-red-600">
                          &#123;&#123;token_id&#125;&#125;
                        </span>
                        <span className="text-[#3980F3]">
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
                    <h2 className="text-[#44498D] font-semibold">
                      Dynamic Image Posfix
                    </h2>
                    <input
                      id=""
                      type="text"
                      autoFocus
                      className=" my-2 rounded-sm bg-[#F5F6FA] text-[#3980F3] text-[14px] border-[1px] border-[#3980F3] focus:border-[#3980F3] placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-full h-[40px]"
                      placeholder="example: -transformed"
                      onChange={(e) => setPostfix(e.target.value)}
                      value={postfix}
                    />
                    {imgSource !== "" && (
                      <div className="bg-[#F5F6FA] rounded-md p-3 mb-2">
                        <span className="text-[#3980F3]">
                          {checkBackslash(imgSource)}
                        </span>
                        <span className="text-red-600">
                          &#123;&#123;token_id&#125;&#125;
                        </span>
                        <span className="text-[#3980F3]">
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
              <Link
                href={
                  isCreateNewActionCookie === "true"
                    ? "/actions/action-form/create-new-action"
                    : `/actions/action-form/${props.actionName}`
                }
              >
                <div
                  className="flex justify-center"
                  onClick={async () => {
                    await saveAction();
                  }}
                >
                  save
                </div>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionThenTransformDynamic;
