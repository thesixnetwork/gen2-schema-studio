import React from 'react'

type Props = {
  step : number ,
  stepName : string ,
  currentStep:number, 
}

function StepmenuBox(props: Props) {
  return (
    <div className=' w-36 flex justify-center  items-center  '>
      <div className={` w-10 h-16 ${props.currentStep===props.step ? " bg-Act6 ": "bg-bg " } border  border-Act6 flex justify-center items-center`}>
        <p className={` font-bold ${props.currentStep===props.step ? " text-white ": " text-Act6 font-thin" }  text-4xl`}>{props.step}</p>
      </div>
      <div className=' flex justify-center items-center'>
        <p className={`text-Act6 w-20 flex justify-start items-center ml-2 ${props.currentStep===props.step && " font-bold " }`} >{props.stepName}</p>
      </div>
    </div>
  )
}

export default StepmenuBox