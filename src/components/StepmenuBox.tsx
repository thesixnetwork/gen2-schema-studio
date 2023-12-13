import React from 'react'

type Props = {
  step : number ,
  stepName : string , 
}

function StepmenuBox(props: Props) {
  return (
    <div className=' flex '>
      <div className={`w-10 h-16 bg-Act6 border border-Act6 flex justify-center items-center`}>
        <p className={` font-bold text-white text-4xl`}>{props.step}</p>
      </div>
      <div className=' flex justify-center items-center'>
        <p className=' text-Act6'>{props.stepName}</p>
      </div>
    </div>
  )
}

export default StepmenuBox