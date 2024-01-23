import { usePathname } from 'next/navigation';
import { promises as fs } from 'fs';
import descriptionData from '../description/descriptionData.json'
import { getCookie } from '@/service/getCookie';
import { useEffect } from 'react';

const HomeSidebar = () => {
  const pathname = usePathname();
  const basePath = `/${pathname.split('/').slice(1, 3).join('/')}`;
  const isActionImage = getCookie("isTransformImage");
  const detail: any = isActionImage === "true" ?  descriptionData[basePath+"-"] : descriptionData[basePath] || [];

  return (
    <aside className={`flex justify-end items-end w-full `}>
      <div className="border bg-white border-Act7 w-96 h-full text-[#878CA8] rounded-lg p-4 mx-8">
        <div>
          {detail.map((item: any) => (
            <div key={item.title}>
              {item.title !== "none" &&<h2 className="font-bold text-xl text-main2">{item.title}</h2>}
              <p className="pt-2 pb-4 text-main2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default HomeSidebar;

