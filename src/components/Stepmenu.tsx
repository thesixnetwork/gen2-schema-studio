import React from 'react'
import StepmenuBox from './StepmenuBox';

type Props = {
    schemacode: string;
    currentStep: number;
}

function Stepmenu(props: Props) {

    const stateDetail = [
        {
            state: 1,
            text: "Basic data",
        },
        {
            state: 2,
            text: "Origin collection data",
        },
        {
            state: 3,
            text: "Origin token attributes",
        },
        {
            state: 4,
            text: "Onchain collection attributes",
        },
        {
            state: 5,
            text: "Onchain token attributes",
        },
        {
            state: 6,
            text: "Action",
        },
        {
            state: 7,
            text: "Deploy",
        },
    ];

    return (
        <div className=' w-full h-full'>
            <p className=' text-main2 text-3xl'>{props.schemacode}</p>
            <div className=' w-full h-32 flex justify-between border-t border-t-2nd4 mt-4'>
                {stateDetail.map((stepDetail) => (
                    <StepmenuBox key={stepDetail.state} step={stepDetail.state} stepName={stepDetail.text} currentStep={props.currentStep}></StepmenuBox>
                ))}
            </div>
        </div>
    )
}

export default Stepmenu