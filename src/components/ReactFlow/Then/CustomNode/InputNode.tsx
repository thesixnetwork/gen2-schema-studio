import DynamicNode from "./DynamicNode";

interface DataProps {
  data: {
    id: string;
    showType: string;
    value: string;
    dataType: string;
    isFetch: boolean;
  };
}

function InputNode({ data }: DataProps) {
  return (
    <div>
      {data.showType === "selectAttributeNode" ? (
        <DynamicNode data={data} />
      ) : data.showType === "increaseNode" ? (
        <DynamicNode data={data} />
      ) : data.showType === "decreaseNode" ? (
        <DynamicNode data={data} />
      ) : data.showType === "valueNode" ? (
        <DynamicNode data={data} />
      ) : data.showType === "paramNode" ? (
        <DynamicNode data={data} />
      ) : data.showType === "attributeNode" ? (
        <DynamicNode data={data} />
      ) : data.showType === "toNode" ? (
        <DynamicNode data={data} />
      ) : data.showType === "amountNode" ? (
        <DynamicNode data={data} />
      ) : (
        <DynamicNode data={data} />
      )}
    </div>
  );
}

export default InputNode;
