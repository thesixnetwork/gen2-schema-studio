import { useEffect, useState } from "react";
// import EastIcon from "@mui/icons-material/East";
// import { useNavigate, useParams } from "react-router-dom";
import { getAccessTokenFromLocalStorage } from "../helpers/AuthService";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@chakra-ui/react";

import SaveButton from "./button/SaveButton";
import CancelButton from "./button/CancelButton";
import ActionHeader from "@/components/ActionHeader";
import { IActions } from "@/type/Nftmngr";
import { getCookie } from "@/service/getCookie";
import { setCookie } from "@/service/setCookie";
interface ActionThenTransformStaticProps {
  metaFunction: string;
  actionName: string;
  schemaRevision?: string;
  isDraft?: boolean;
  transformType: string;
  actionThenType: string;
  handleActionThenTypeChange: (newActionThenType: string) => void;
  handleTransformTypeChange: (newActionThenType: string) => void;
}

const ActionThenTransformStatic = (props: ActionThenTransformStaticProps) => {
  const [imgSource, setImgSource] = useState("");
  const [imgSourceError, setImgSourceError] = useState(false);
  const [metaFunction, setMetaFunction] = useState<string>("");
  const [valueInput, setValueInput] = useState("");
  const [actionData, setActionData] = useState();
  const [actionThenArr, setActionThenArr] = useState<
    (string | number | boolean)[]
  >([]);
  const [actionThenIndex, setActionThenIndex] = useState<number | undefined>();
  const [isCreateNewAction, setIsCreateNewAction] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [originalMetaFunction, setOriginalMetaFunction] = useState(
    props.metaFunction
  );
  const getCookieData = localStorage.getItem('action')
  const getActionThen = getCookie("action-then");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const getActionThanArrCookie = getCookie("action-then-arr");
  const getIsCreateNewThenFromCookie = getCookie("isCreateNewThen");
  const schemacode = getCookie("schemaCode");
  const getActionThenIndexCookie = getCookie("actionThenIndex");
  const [metaData, setMetaData] = useState<string>("");

  const convertFromBase64 = (str: string) => {
    console.log("str: ", str);
    return atob(str);
  };

  const onChange = (e: any) => {
    setImgSource(e.target.value);
    setValueInput(e.target.value);
  };

  const getImgFromParam = (string: string) => {
    console.log("input: ", string);
    const firstQuoteIndex = string.indexOf("'");
    if (firstQuoteIndex === -1) {
      return null;
    }

    const secondQuoteIndex = string.indexOf("'", firstQuoteIndex + 1);
    if (secondQuoteIndex === -1) {
      return null;
    }

    const url = string.slice(firstQuoteIndex + 1, secondQuoteIndex);
    return url;
  };

  const convertMetaData = (imagePath: string) => {
    return `meta.SetImage('${imagePath}')`;
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

        let updatedTempArrCookie
        if(getActionThenIndexCookie){
          
           updatedTempArrCookie = tempArrCookie.map((item:string, index:number) =>
          index === parseInt(getActionThenIndexCookie) ? metaDataToAdd : item
        );
        }

        if (originalMetaFunction === "create-new-then") {
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
  };

  useEffect(() => {
    if (getActionThen) {
      setMetaFunction(getActionThen);
    }
  }, [getActionThen]);

  useEffect(() => {
    if (metaFunction.startsWith("meta.SetImage('https")) {
      console.log("imgSource", metaFunction);
      if (
        getImgFromParam(metaFunction) !== ".png" &&
        getImgFromParam(metaFunction) !== ".jpg" &&
        getImgFromParam(metaFunction) !== ".jpeg" &&
        getImgFromParam(metaFunction) !== ".gif"
      ) {
        setValueInput(getImgFromParam(metaFunction) ?? "");
        setImgSource(getImgFromParam(metaFunction) ?? "");
      }
    } else {
      setMetaFunction(props.metaFunction ?? "");
    }

    if (props.metaFunction === "create-new-action") {
      setIsCreateNewAction(true);
    }
  }, [props.metaFunction, metaFunction]);

  useEffect(() => {
    if (actionData !== undefined) {
      const getDataByName = (data: any, name: string | undefined) => {
        return data.find((item: any) => item.name === name);
      };
      const result = getDataByName(actionData, props.actionName);
      setActionThenArr(result.then);
    }

    const index = actionThenArr.indexOf(metaFunction);
    setActionThenIndex(index);
    console.log("actionThenArr: ", actionThenArr);
  }, [actionData]);

  useEffect(() => {
    setImgSourceError(false);
    setIsPreview(false);

    imgSource !== "" && setMetaData(convertMetaData(imgSource));
  }, [imgSource]);
  return (
    <>
      {props.transformType !== "dynamic" && (
        <div className="px-8 flex flex-col">
          <ActionHeader
            type="then"
            actionName={props.actionName}
            metaFunction={metaData}
            transformType={props.transformType}
            actionThenType={props.actionThenType}
            handleActionThenTypeChange={props.handleActionThenTypeChange}
            handleTransformTypeChange={props.handleTransformTypeChange}
          />
          {props.transformType === "static" && (
            <div className="w-fit m-auto">
              <div className="h-[full] w-[50vw] border rounded-2xl p-8 bg-white mt-4">
                <h2 className="text-main2 font-semibold">Image path</h2>
                <div className="flex items-center gap-x-4">
                  <input
                    id="1"
                    type="text"
                    autoFocus
                    className="ml-2 my-2 rounded-sm bg-[#F5F6FA] text-Act6 text-[14px] border-[1px] border-Act6 focus:border-Act6 placeholder-gray-300 border-dashed p-1 focus:outline-none w-full h-[40px]"
                    placeholder={
                      "Input your image url example: https://techsauce-nft.sixprotocol.com/techsauce/1.png"
                    }
                    value={valueInput}
                    onChange={async (e) => {
                      onChange(e);
                    }}
                  />
                  <Button
                    colorScheme="blue.500"
                    borderColor={"blue.500"}
                    color={"blue.500"}
                    variant="outline"
                    mr={3}
                    _hover={{ borderColor: "blue.500", color: "blue.500" }}
                    onClick={() => setIsPreview(true)}
                  >
                    Preview
                  </Button>
                </div>
                <div className="flex flex-col justify-center items-start">
                  <h2 className="text-main2 font-semibold">Preview</h2>
                  <div className="h-60 my-4">
                    {isPreview && imgSource !== "" && imgSource !== null && (
                      <div
                        className={`h-full ${
                          imgSourceError
                            ? ""
                            : "rounded-lg border-2 overflow-hidden"
                        }`}
                      >
                        {imgSourceError ? (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-red-500">
                              Image couldn&apos;t be loaded
                            </p>
                          </div>
                        ) : (
                          <img
                            src={imgSource}
                            alt="preview-image"
                            className="w-full h-full"
                            onLoad={() => setImgSourceError(false)}
                            onError={() => setImgSourceError(true)}
                          />
                        )}
                      </div>
                    )}
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
                <Link
                  href={
                    isCreateNewActionCookie === "true"
                      ? `/newdraft/6/${schemacode}/action-form/create-new-action`
                      : `/newdraft/6/${schemacode}/action-form/${props.actionName}`
                  }
                  onClick={async () => {
                    await saveAction();
                  }}
                >
                  <SaveButton />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ActionThenTransformStatic;
