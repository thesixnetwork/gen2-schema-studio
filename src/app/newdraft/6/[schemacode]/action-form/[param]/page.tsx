"use client";

import Link from "next/link";
import ActionInput from "@/components/ActionInput";
import ActionInputThenWhen from "@/components/ActionInputThenWhen";
import { useState, useEffect } from "react";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import postUpdateAction6 from "@/service/postUpdateAction6";
import postCreateAction6 from "@/service/postCreateAction6";
import { setCookie } from "@/service/setCookie";
import { cookies } from "next/headers";
import { getCookie } from "@/service/getCookie";
import postImageUrlAction6 from "@/service/postImageUrlAction6";
import Loading from "@/components/Loading";
import BackPageButton from "@/components/BackPageButton";
import NextPageButton from "@/components/NextPageButton";
import SaveButton from "@/components/button/SaveButton";
import CancelButton from "@/components/button/CancelButton";

const Page = ({ params }: { params: { param: string } }) => {
  const [loading, setLoading] = useState(true);
  const [actionNameValue, setActionNameValue] = useState("");
  const [isActionNameError, setIsActionNameError] = useState(false);
  const [actionNameErrorMessage, setActionNameErrorMessage] = useState("");
  const [actionDescriptionValue, setActionDescriptionValue] = useState("");
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [action, setAction] = useState<Array<any> | undefined>();
  const [updatedAction, setUpdatedAction] = useState<any[] | undefined>([]);
  const [actionWhenValue, setActionWhenValue] = useState("");
  const [actionThenValue, setActionThenValue] = useState([]);
  const [isCreateNewAction, setIsCreateNewAction] = useState(false);
  const [editedActionArr, setEditedActionArr] = useState<any[] | undefined>([]);
  const [actionIndex, setActionIndex] = useState(0);
  const getCookieData = getCookie("action");
  const getIsEdited = getCookie("isEditAction");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const [isCreateTempArr, setIsCreateTempArr] = useState(false);
  const [getActionFromCookie, setGetActionFromCookie] = useState(false);
  const [isError, setIsError] = useState(false);
  const schemacode = getCookie("schemaCode") ?? "";
  const getActionWhenFromCookie = getCookie("action-when") ?? "";
  const getActionNameFromCookie = getCookie("action-name") ?? "";
  const getActionDescFromCookie = getCookie("action-desc") ?? "";
  const getActionThenFromCookie = getCookie("action-then-arr");
  const getIsTransformFromCookie = getCookie("isTransform") ?? "";
  const getImgSourceFromCookie = getCookie("imgSource") ?? "";
  const getPrefixFromCookie = getCookie("prefix") ?? "";
  const getPostfixFromCookie = getCookie("postfix") ?? "";
  const getImgFormatFromCookie = getCookie("imgFormat") ?? "";
  const [createNewAction, setCreateNewAction] = useState([
    {
      name: "",
      desc: "",
      disable: false,
      when: "",
      then: [],
      allowed_actioner: "ALLOWED_ACTIONER_ALL",
      params: [],
    },
  ]);

  const containsSpecialChars = (str: string) => {
    const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  };

  const containsSpace = (str: string) => {
    const specialChars = / /;
    return specialChars.test(str);
  };

  const containsUppercase = (str: string) => {
    return /[A-Z]/.test(str);
  };

  //   const checkDuplicateActionName = (actionNameValue:string)=>{
  //     let isDuplicate = false
  //     actions.forEach((action)=>{
  //       if(action.name === actionNameValue){
  //         isDuplicate = true
  //       }
  //     })
  //     return isDuplicate
  //   }

  const checkActionNameError = async (str: string) => {
    setIsActionNameError(false);
    if (!str) {
      setActionNameErrorMessage("Not Availible");
      setIsActionNameError(true);
    } else if (containsSpecialChars(str)) {
      setActionNameErrorMessage("Can't Contain Special Characters");
      setIsActionNameError(true);
    } else if (containsSpace(str)) {
      setActionNameErrorMessage(" Can't Contain Space");
      setIsActionNameError(true);
    } else if (containsUppercase(str)) {
      setActionNameErrorMessage("Can't Contain Uppercase");
      setIsActionNameError(true);
    }
    // else if (checkDuplicateActionName(str)){
    //   setActionNameErrorMessage("Can't Be Duplicate!");
    //   setIsActionNameError(true);
    // }
    else {
      setIsActionNameError(false);
    }
  };

  const checkDescriptionError = async (str: string) => {
    setIsDescriptionError(false);
    if (!str) {
      setDescriptionErrorMessage("Not Availible");
      setIsDescriptionError(true);
    } else {
      setIsDescriptionError(false);
    }
  };

  const handleSave = async () => {
    console.log(createNewAction[0].when);
    if (params.param === "create-new-action") {
      await postCreateAction6(
        schemacode,
        createNewAction[0].name,
        createNewAction[0].desc,
        createNewAction[0].when,
        createNewAction[0].then
      );
    } else {
      if (updatedAction) {
        await postUpdateAction6(schemacode, updatedAction);
        setCookie("isEditAction", "false");
        setCookie("isCreateNewAction", "false");
      }
    }

    if (getIsTransformFromCookie === "true") {
      postImageUrlAction6(
        schemacode,
        decodeURIComponent(getImgSourceFromCookie),
        getPrefixFromCookie,
        getPostfixFromCookie,
        getImgFormatFromCookie
      );
    }
  };

  useEffect(() => {
    
    (async () => {
      try {
        const response = await getSchemaInfo(schemacode);

        if (
          response &&
          response.schema_info &&
          response.schema_info.onchain_data
        ) {
          const actions = response.schema_info.onchain_data.actions;

          if (actions) {
            
            if (getIsEdited !== "true") {
              await setAction(actions);
              console.log("getting");
              await setCookie("action", JSON.stringify(actions));
              setCookie("isEditAction", "false");
            }else {
              await setUpdatedAction(JSON.parse(decodeURIComponent(getCookieData)));
              setCookie("isEditAction", "false");
            }

            console.log("success");
          } else {
            console.error("error");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    })();
  }, [schemacode]);

  useEffect(() => {
    console.log(">> acc ::", getCookieData);
    console.log(">>>", updatedAction);
    if (getCookieData && params.param !== "create-new-action") {
      const parsedCookieData = JSON.parse(decodeURIComponent(getCookieData));
      setGetActionFromCookie(parsedCookieData);
      setUpdatedAction(parsedCookieData);
      console.log(">>>!", updatedAction);
    }
  }, [getCookieData, action]);

  useEffect(() => {
    if (params.param === "create-new-action") {
      setIsCreateNewAction(true);
      setCookie("isCreateNewAction", "true");
      setCreateNewAction((prev) => [
        {
          ...prev[0],
          name:
            getActionNameFromCookie !== null
              ? decodeURIComponent(getActionNameFromCookie)
              : "",
          desc:
            getActionDescFromCookie !== null
              ? decodeURIComponent(getActionDescFromCookie)
              : "",
          when:
            getActionWhenFromCookie !== null
              ? decodeURIComponent(getActionWhenFromCookie)
              : "",
          then:
            getActionThenFromCookie !== null
              ? Array.isArray(getActionThenFromCookie)
                ? getActionThenFromCookie
                : JSON.parse(decodeURIComponent(getActionThenFromCookie))
              : [],
        },
        ...prev.slice(1),
      ]);
    } else {
      setActionIndex(
        action ? action.findIndex((item) => item.name === params.param) : 0
      );
      console.log("this case");
    }
  }, [action]);

  useEffect(() => {
    setCookie("isCreateNewThen", "false");
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="w-fit max-w-screen-md mx-auto mt-12">
        {(typeof actionIndex === "number" || isCreateNewAction) && (
          <div className="flex flex-col items-center gap-y-6">
            <ActionInput
              name="Name"
              value={
                params.param === "create-new-action"
                  ? createNewAction || []
                  : updatedAction || []
              }
              setValue={
                params.param === "create-new-action"
                  ? setCreateNewAction
                  : setUpdatedAction
              }
              actionIndex={
                params.param === "create-new-action" ? 0 : actionIndex
              }
              isCreateNewAction={
                params.param === "create-new-action" ? true : false
              }
              setIsError={setIsError}
            />
            <ActionInput
              name="Description"
              value={
                params.param === "create-new-action"
                  ? createNewAction || []
                  : updatedAction || []
              }
              setValue={
                params.param === "create-new-action"
                  ? setCreateNewAction
                  : setUpdatedAction
              }
              actionIndex={
                params.param === "create-new-action" ? 0 : actionIndex
              }
              isCreateNewAction={
                params.param === "create-new-action" ? true : false
              }
              setIsError={setIsError}
            />
            <ActionInputThenWhen
              actionType="when"
              action={
                params.param === "create-new-action"
                  ? createNewAction || []
                  : updatedAction || []
              }
              actionIndex={
                params.param === "create-new-action" ? 0 : actionIndex
              }
              schemaRevision={schemacode}
              isCreateNewAction={
                params.param === "create-new-action" ? true : false
              }
              isError={isError}
            />
            <ActionInputThenWhen
              actionType="then"
              action={
                params.param === "create-new-action"
                  ? createNewAction || []
                  : updatedAction || []
              }
              actionIndex={
                params.param === "create-new-action" ? 0 : actionIndex
              }
              schemaRevision={schemacode}
              isCreateNewAction={
                params.param === "create-new-action" ? true : false
              }
              isError={isError}
            />
          </div>
        )}
        <div className="w-full flex flex-end justify-end gap-x-8 my-12">
          <Link href={`/newdraft/6/${schemacode}`}>
            <CancelButton />
          </Link>
          <Link href={`/newdraft/6/${schemacode}`} onClick={handleSave}>
            <SaveButton />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
