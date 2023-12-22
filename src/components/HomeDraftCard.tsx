import React, { useEffect, useState } from 'react'
import test_img from '../../public/pic/BuaKaw_Pic.png'
import draft_icon from '../../public/pic/draft_icon_nobg.png'
import Image from 'next/image'
import axios from 'axios'
type Props = {
    schema_revision: any;
    CollectionName: any;
    CollectionImage: any;
}

function HomeDraftCard(props: Props) {
    const [imgUrl, setImgUrl] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getImage = async () => {
            try {
               if(props.CollectionImage){
                await axios.get(props.CollectionImage).then((res) => {
                    setImgUrl(res.data.image);
                    setLoading(false);
                });
               }else {
                setLoading(false);
               }
                
            } catch (err) {
                // console.log(err);
                setLoading(false);
            }
        };
        getImage();
    }, []);

    return (
        <div className=' w-draftCardWidth h-draftCardHeight  rounded-2xl bg-gradient-24 from-Act7 via-bg to-Act7 p-[0.08rem] hover:scale-105 duration-500 cursor-pointer'>
            <div className=' w-full h-full rounded-2xl bg-bg p-3 flex flex-col  items-center'>
                {props.CollectionImage === "" ?
                    <div>
                        <p>NO Image</p>
                    </div>
                    :   
                    <img className=' w-40 mb-1' src={imgUrl} alt={''} width={10} height={10}></img>
                }
                <div className=' w-full h-[0.08rem] bg-Act7 '></div>
                <div className=' text-main2 w-full relative mt-3 '>
                    <p className=' font-bold text-sm'>{props.CollectionName}</p>
                    <p className=' font-bold text-sm' >collection</p>
                    <Image className=' absolute right-0 top-0 w-10' src={draft_icon} alt={''} ></Image>
                </div>
            </div>
        </div>
    )
}

export default React.memo(HomeDraftCard)