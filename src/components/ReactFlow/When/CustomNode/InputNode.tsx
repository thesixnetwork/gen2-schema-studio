import DynamicNode from './DynamicNode';

interface DataProps{
  data: {
    id: string;
    showType: string;
    value: string;
    dataType: string;
    isFetch: boolean;
    condition: string;
  }
}

function InputNode  ({ data }:DataProps) {

  return (
    <div>
      {data.showType === "orNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "andNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "equalNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "notEqualNode" ? (
        <DynamicNode data={data} />
      ) : data.showType === "moreThanNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "moreThanAndEqualNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "lessThanNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "lessThanAndEqualNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "valueNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "attributeNode" ? (
        <DynamicNode data={data}/>
      ) : data.showType === "paramNode" ? (
        <DynamicNode data={data}/>
      ) :(
        <DynamicNode data={data}/>
      )}
    </div>  
  );
  
}

export default InputNode;