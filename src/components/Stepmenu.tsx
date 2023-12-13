import React from 'react'
import StepmenuBox from './StepmenuBox';

type Props = {
    schemacode: string;
}

function Stepmenu(props: Props) {
    return (
        <div className=' w-full h-full'>
            <p className=' text-main2 text-3xl'>{props.schemacode}</p>
            <div className=' w-full h-32 border-t border-t-2nd4 mt-4'>
                <StepmenuBox step={1} stepName={`Basic data`}></StepmenuBox>
            </div>
        </div>
    )
}

export default Stepmenu