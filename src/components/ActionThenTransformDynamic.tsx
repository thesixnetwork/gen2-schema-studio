// import NormalButton from "../component/NormalButton";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { getAccessTokenFromLocalStorage } from "../helpers/AuthService";
// import { CircularProgress } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { Button, Select } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface ActionThenTransformDynamicProps {
  actionName: string;
  schemaRevision: string;
  isDraft: boolean;
}

const ActionThenTransformDynamic = (props: ActionThenTransformDynamicProps) => {
  const [imgSource, setImgSource] = useState("");
  const [postfix, setPostfix] = useState("");
  const [prefix, setPrefix] = useState("");
  const [isNext, setIsNext] = useState(false);
  const [imgFormat, setImgFormat] = useState("");
  const [tokenId, setTokenId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [imgBeforeTransformError, setImgBeforeTransformError] = useState(false);
  const [imgAfterTransformError, setImgAfterTransformError] = useState(false);

  //   const navigate = useNavigate();

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
    if (str.endsWith("/")) {
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
    setLoading(true);
    const apiUrl = `${process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO}schema/set_actions`;
    const requestData = {
      payload: {
        schema_code: props.schemaRevision,
        update_then: false,
        name: props.actionName,
        then: [convertMetaFunction(imgFormat, prefix, postfix)],
      },
    };
    await axios
      .post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
        },
      })
      .then((response) => {
        console.log(
          "API Response saveOnchainCollectionAttributes :",
          response.data
        );
        console.log("Request :", requestData);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
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
  }, [imgSource, imgFormat, prefix, postfix, tokenId]);

  return (
    <div className="w-full flex justify-center gap-x-20	items-center">
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
          <div className="border rounded-2xl p-8 flex justify-center">
            <div className="w-96 flex flex-col justify-between ">
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
                <div className="flex items-center h-36">
                  {imgBeforeTransformError ? (
                    <p className="flex items-center text-center h-full">
                      Image couldn&apos;t be load
                    </p>
                  ) : (
                    imgSource !== "" && (
                      <img
                        src={`${checkBackslash(
                          imgSource
                        )}${tokenId}${prefix}${imgFormat}`}
                        alt="preview-image"
                        className="h-36 w-auto"
                        onError={() => setImgBeforeTransformError(true)}
                      />
                    )
                  )}
                  {imgSource !== "" && (
                    <div>
                      <span>{checkBackslash(imgSource)}</span>
                      <span className="text-red-600">
                        &#123;&#123;token_id&#125;&#125;
                      </span>
                      <span>
                        {prefix}
                        {imgFormat}
                      </span>
                    </div>
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
                <div className="flex items-center h-36">
                  {imgAfterTransformError ? (
                    <p className="flex items-center text-center h-full">
                      Image couldn&apos;t be load
                    </p>
                  ) : (
                    imgSource !== "" && (
                      <img
                        src={`${checkBackslash(
                          imgSource
                        )}${tokenId}${postfix}${imgFormat}`}
                        alt="preview-image"
                        className="h-36 w-auto"
                        onError={() => setImgAfterTransformError(true)}
                      />
                    )
                  )}
                  {imgSource !== "" && (
                    <div>
                      <span>{checkBackslash(imgSource)}</span>
                      <span className="text-red-600">
                        &#123;&#123;token_id&#125;&#125;
                      </span>
                      <span>
                        {postfix}
                        {imgFormat}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {isNext && (
            <div className="border-2 border-white rounded-lg h-[560px] flex  justify-center p-8">
              <div className="w-96 h-full flex flex-col justify-between items-center">
                <div className=" flex flex-col justify-center items-center">
                  <h2 className="w-96 px-4 py-2 bg-[#A2A3AA] border-2 border-white text-center ">
                    Preview transformed token
                  </h2>

                  <div className="flex items-center">
                    <div className="h-full w-full">
                      <div className="flex flex-col items-center h-full">
                        <p className="flex text-center items-start">Original</p>
                        <div className="w-36 h-full flex justify-center items-center">
                          {imgBeforeTransformError ? (
                            <p className="flex items-center text-center h-full">
                              Image couldn&apos;t be load
                            </p>
                          ) : (
                            imgSource !== "" && (
                              <img
                                src={`${checkBackslash(
                                  imgSource
                                )}${tokenId}${prefix}${imgFormat}`}
                                alt="preview-image"
                                className="w-full h-full"
                                onError={() => setImgBeforeTransformError(true)}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="h-full flex flex-col justify-center px-2">
                      <div className="flex items-end h-[16.5%]"></div>
                    </div>
                    <div className="flex flex-col items-center h-full">
                      <p className="flex text-center items-start">
                        Transformed
                      </p>
                      <div className="w-36 h-full flex justify-center items-center">
                        {imgAfterTransformError ? (
                          <p className="flex items-center text-center h-full">
                            Image couldn&apos;t be load
                          </p>
                        ) : (
                          imgSource !== "" && (
                            <img
                              src={`${checkBackslash(
                                imgSource
                              )}${tokenId}${postfix}${imgFormat}`}
                              alt="preview-image"
                              className="w-full h-full"
                              onError={() => setImgAfterTransformError(true)}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href={
                    props.isDraft
                      ? `/draft/actions/${props.schemaRevision}`
                      : "/newintregation/beginer/"
                  }
                >
                  <div
                    className="flex justify-center items-end"
                    onClick={async () => {
                      await saveAction();
                      await saveImageUrl();
                    }}
                  >
                    SAVE
                  </div>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActionThenTransformDynamic;
