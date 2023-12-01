import { useEffect, useState } from "react";
// import EastIcon from "@mui/icons-material/East";
// import { useNavigate, useParams } from "react-router-dom";
import { getAccessTokenFromLocalStorage } from "../helpers/AuthService";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@chakra-ui/react";

interface ActionThenTransformStaticProps {
  metaFunction: string;
  actionName: string;
  schemaRevision: string;
  isDraft: boolean;
}

const ActionThenTransformStatic = (props: ActionThenTransformStaticProps) => {
  //   const navigate = useNavigate();
  const [imgSource, setImgSource] = useState("");
  const [imgSourceError, setImgSourceError] = useState(false);
  const [metaFunction, setMetaFunction] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [actionData, setActionData] = useState();
  const [actionThenArr, setActionThenArr] = useState([]);
  const [actionThenIndex, setActionThenIndex] = useState<number | undefined>();
  const [isCreateNewAction, setIsCreateNewAction] = useState(false);
  const [actions, setActions] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

  const convertFromBase64 = (str: string) => {
    console.log("str: ", str);
    return atob(str);
  };

  const findSchemaCode = async () => {
    const apiUrl = `${process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO}schema/get_schema_info/${props.schemaRevision}`;
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
        console.log(
          "Response:",
          response.data.data.schema_info.schema_info.onchain_data.actions
        );
        setActionData(
          response.data.data.schema_info.schema_info.onchain_data.actions
        );
        const actions =
          response.data.data.schema_info.schema_info.onchain_data.actions.filter(
            (action: { name: string }) => action.name === props.actionName
          );
        setActions(actions);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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

  const isBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (error) {
      return false;
    }
  };

  const convertMetaData = (imagePath: string) => {
    return `meta.SetImage('${imagePath}')`;
  };

  const saveAction = async () => {
    actionThenArr[actionThenIndex] = convertMetaData(imgSource);
    console.log(actionThenArr);
    const apiUrl = `${process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO}schema/set_actions`;
    let requestData;
    if (isCreateNewAction) {
      requestData = {
        payload: {
          schema_code: props.schemaRevision,
          update_then: false,
          name: props.actionName,

          then: [...actionThenArr, convertMetaData(imgSource)],
        },
      };
    } else {
      requestData = {
        payload: {
          schema_code: props.schemaRevision,
          update_then: false,
          name: props.actionName,
          then: actionThenArr,
        },
      };
    }

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

  useEffect(() => {
    findSchemaCode();
  }, []);

  useEffect(() => {
    if (isBase64(props.metaFunction)) {
      setMetaFunction(convertFromBase64(props.metaFunction));
      console.log("imgSource", metaFunction);
      if (
        getImgFromParam(metaFunction) !== ".png" &&
        getImgFromParam(metaFunction) !== ".jpg" &&
        getImgFromParam(metaFunction) !== ".jpeg" &&
        getImgFromParam(metaFunction) !== ".gif"
      ) {
        setValueInput(getImgFromParam(metaFunction));
        setImgSource(getImgFromParam(metaFunction));
      }
    } else {
      setMetaFunction(props.metaFunction);
    }

    if (props.metaFunction === "create-new-action") {
      setIsCreateNewAction(true);
    }
  }, [props.metaFunction, metaFunction]);

  useEffect(() => {
    if (actionData !== undefined) {
      const getDataByName = (data, name) => {
        return data.find((item) => item.name === name);
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
  }, [imgSource]);
  return (
    <div className="h-[full] w-[50vw] border rounded-2xl p-8">
      <h2 className="text-[#44498D] font-semibold">Image path</h2>
      <div className="flex items-center gap-x-4">
        <input
          id="1"
          type="text"
          autoFocus
          className="ml-2 my-2 rounded-sm bg-[#F5F6FA] text-[#3980F3] text-[14px] border-[1px] border-[#3980F3] focus:border-[#3980F3] placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-full h-[40px]"
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
        <h2 className="text-[#44498D] font-semibold">Preview</h2>
        <div className="h-60 my-4">
          {isPreview && imgSource !== "" && imgSource !== null && (
            <div
              className={`h-full ${
                imgSourceError ? "" : "rounded-lg border-2 overflow-hidden"
              }`}
            >
              {imgSourceError ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">Image couldn't be loaded</p>
                </div>
              ) : (
                <img
                  src={imgSource}
                  alt="preview-image"
                  className="w-full h-full"
                  onLoad={() => setImgSourceError(false)} // Reset error state on successful load
                  onError={() => setImgSourceError(true)}
                />
              )}
            </div>
          )}
        </div>
        <Link
          href={
            props.isDraft
              ? `/draft/actions/${props.schemaRevision}`
              : "/newintregation/beginer/"
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
        <button onClick={() => console.log()}>logger</button>
      </div>
    </div>
  );
};

export default ActionThenTransformStatic;
