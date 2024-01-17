import React from 'react'

type Props = {
    title: string
    description: string
}

function DetailBox(props: Props) {
    return (
        <div className="border bg-white border-Act7 w-96 h-fit text-[#878CA8] rounded-lg p-4 mx-8">
            <div >
                <h2 className="font-bold text-xl text-main2">{props.title}</h2>
                <p className="pt-2 pb-4 text-main2">{props.description}</p>
            </div>
        </div>
    )
}

export default DetailBox