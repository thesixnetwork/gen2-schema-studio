import React from 'react';
import deleate_icon from '../../../public/pic/deleate_attribute_card.png';
import Image from 'next/image';
import AttributeCard from './AttributeCard';

type Props = {
  name: string;
  dataType: string;
  traitType: string;
  value: string | undefined;
  onDelete: () => void; // Add onDelete as a prop with a function signature
  onSettingBarClick: () => void; // Add onSettingBarClick as a prop with a function signature
};

function AttributeCardAndDelete(props: Props) {
  return (
    <div className=" relative w-draftCardWidth hover:scale-105 duration-300 cursor-pointer   " >
      <Image
        className='z-20 w-7 h-7 hover:scale-110 duration-300 cursor-pointer absolute top-2 right-2'
        src={deleate_icon}
        alt={'delete'}
        onClick={props.onDelete}  
      ></Image>
      <div onClick={props.onSettingBarClick}>  
        <AttributeCard name={props.name} dataType={props.dataType} traitType={props.traitType} value={props.value}></AttributeCard>
      </div>
    </div>
  );
}

export default AttributeCardAndDelete;
