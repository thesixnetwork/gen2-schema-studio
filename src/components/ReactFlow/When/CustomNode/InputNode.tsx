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

  // useEffect(()=>{
  //   const test = async() =>{
  //     await new Promise((resolve) => setTimeout(resolve, 5000))
  //     setLabel('')
  //   }
  //   test()
  // })

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
       {/* <div  
                className="w-full p-2 rounded-full flex items-center justify-center border-2">
                <Handle type="target" position={Position.Top} />
                <div 
                >
                    V:&nbsp;
                    <input type="text" name="" id="" className='w-16 rounded-full' onChange={onChange} />
                    <p>{data.value}</p>
                    <button onClick={()=>console.log(data)}>test</button>
                    <button onClick={()=>data.countNum(data.num, console.log("counted"))}>test</button>
                </div>
                <Handle type="source" position={Position.Bottom} id="a" />
            </div> */}
    </div>  
  );
  
}

export default InputNode;