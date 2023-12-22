import React from 'react'

type Props = {
  step : number ,
  stepName : string ,
  currentStep:number, 
}

function StepmenuBox(props: Props) {
  return (
    <div className=' w-24 flex justify-between items-center '>
      <div className={` w-16 h-16 ${props.currentStep===props.step ? " bg-Act6 ": "bg-bg " } border  border-Act6 flex justify-center items-center`}>
        <p className={` font-bold ${props.currentStep===props.step ? " text-white ": " text-Act6 font-thin" }  text-4xl`}>{props.step}</p>
      </div>
      <div className=' flex justify-center items-center w-14'>
        <p className=' text-Act6'>{props.stepName}</p>
      </div>
    </div>
  )
}

export default StepmenuBox