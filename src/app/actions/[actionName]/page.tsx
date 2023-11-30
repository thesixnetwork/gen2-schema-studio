"use client";

interface PageProps {
    params: {
        actionName: string;
    }
}

const Page = ({params}:PageProps ) => {
    return(
        <div>
            
            <button onClick={()=>console.log(params)}>here</button>
        </div>
    )
}

export default Page