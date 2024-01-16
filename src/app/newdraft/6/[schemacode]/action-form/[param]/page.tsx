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
import { useRouter } from "next/navigation";
import Stepmenu from "@/components/Stepmenu";

const Page = ({ params }: { params: { param: string } }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<Array<any> | undefined>();
  const [updatedAction, setUpdatedAction] = useState<any[] | undefined>([]);
  const [isCreateNewAction, setIsCreateNewAction] = useState(false);
  const [stepDraft, setStepDraft] = useState(5);
  const [actionIndex, setActionIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const getIsEdited = getCookie("isEditAction");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const [isError, setIsError] = useState(false);
  const getActionFromCookie = localStorage.getItem("action") ?? "";
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

  const handleSave = async () => {
    setLoading(true);
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
      await postImageUrlAction6(
        schemacode,
        decodeURIComponent(getImgSourceFromCookie),
        getPrefixFromCookie,
        getPostfixFromCookie,
        getImgFormatFromCookie
      );
    }
    router.push(`/newdraft/6/${schemacode}`);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await getSchemaInfo(schemacode);
        if (response && response.current_state) {
          setStepDraft(response?.current_state);
        }
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
              await localStorage.setItem("action", JSON.stringify(actions));
              setCookie("isEditAction", "false");
            } else {
              await setUpdatedAction(JSON.parse(getActionFromCookie));
              setCookie("isEditAction", "false");
            }
            setIsEdit(true);
            console.log("success");
          } else {
            console.error("error");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // setLoading(false);
      }
    })();
  }, [schemacode]);

  useEffect(() => {
    setLoading(true);
    if (getActionFromCookie && params.param !== "create-new-action") {
      const parsedCookieData = JSON.parse(getActionFromCookie);
      setUpdatedAction(parsedCookieData);
      setLoading(false);
    }
    // setLoading(false);
  }, [getActionFromCookie, action]);

  useEffect(() => {
    setLoading(true);
    if (params.param === "create-new-action") {
      setIsCreateNewAction(true);
      setCookie("isCreateNewAction", "true");
      console.log("this>>", getActionThenFromCookie)
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
      setLoading(false);
    } else {
      // console.log("--->1", updatedAction);
      console.log("--->2", getActionFromCookie);
      // console.log("--->3", typeof getActionFromCookie)
      // console.log("--->4",(JSON.parse(getActionFromCookie)))

      if (isEdit) {
        // console.log("--->5", JSON.parse("[{\"name\":\"eiei\",\"desc\":\"mod\",\"disable\":false,\"when\":\"meta.GetNumber('points') > 11\",\"then\":[\"meta.SetBoolean('check_in', false)\",\"meta.SetBoolean('check_in', false)\",\"meta.SetBoolean('check_in', true)\"],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"mum8\",\"desc\":\"123\",\"disable\":false,\"when\":\"\",\"then\":[\"meta.TransferNumber('points', params['tokenId'].GetString(), 200)\",\"meta.SetNumber('points', 200)\",\"meta.SetNumber('points', 0)\",\"meta.SetBoolean('switch', true)\",\"meta.SetString('eventname', 'test')\"],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"mocktest01\",\"desc\":\"124241\",\"disable\":false,\"when\":\"meta.GetNumber('points') > 0\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"test\",\"desc\":\"1234\",\"disable\":false,\"when\":\"meta.GetBoolean('check_in') == false\",\"then\":[\"meta.SetNumber('points', 200)\",\"meta.SetString('tier', 'bronze')\"],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"mockcccccccccasd\",\"desc\":\"test11asd\",\"disable\":false,\"when\":\"meta.GetNumber('points') > 1111\",\"then\":[\"meta.SetNumber('points', 2)\"],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"tes\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"123\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"456\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"555\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"111\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"222\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"333\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"3333333\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"666\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"777\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]},{\"name\":\"888\",\"desc\":\"\",\"disable\":false,\"when\":\"\",\"then\":[],\"allowed_actioner\":\"ALLOWED_ACTIONER_ALL\",\"params\":[]}]"));
        setUpdatedAction(JSON.parse(getActionFromCookie));
        setLoading(false);
      }
      // console.log("--->6", updatedAction);
      setActionIndex(
        getIsEdited === "true"
          ? (updatedAction ?? []).findIndex(
              (item) => item.name === params.param
            )
          : (action ?? []).findIndex((item) => item.name === params.param) ?? 0
      );
    }
    // setLoading(false);
  }, [action, isEdit]);

  useEffect(() => {
    setCookie("isCreateNewThen", "false");
  }, []);

  useEffect(() => {
    if (
      (params.param === "create-new-action" && createNewAction[0].name === "") ||
      (updatedAction &&
        updatedAction[actionIndex] &&
        updatedAction[actionIndex].name === "")
    ) {
      setIsNameEmpty(true);
      console.log("emptyy");
    } else {
      setIsNameEmpty(false);
      console.log("not empty");
    }
  }, [updatedAction, actionIndex, createNewAction]);

  return (
    <>
      {loading && <Loading />}
      <header>
        <Stepmenu
          schemacode={schemacode}
          currentStep={6}
          schemacodeNavigate={schemacode}
          stepDraft={stepDraft}
        ></Stepmenu>
      </header>
      <button onClick={() => console.log(createNewAction)}>log her</button>
      <div className="w-fit max-w-screen-md mx-auto mt-12">
        {(typeof actionIndex === "number" || isCreateNewAction) && (
          <div className="flex flex-col items-center gap-y-8">
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
              isNameEmpty={isNameEmpty}
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
              isNameEmpty={isNameEmpty}
            />
          </div>
        )}
        <div className="w-full flex flex-end justify-end gap-x-8 my-12">
          <Link href={`/newdraft/6/${schemacode}`}>
            <CancelButton />
          </Link>
          <div onClick={handleSave}>
            <SaveButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
