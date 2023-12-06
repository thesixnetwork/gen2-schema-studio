import { usePathname } from 'next/navigation'

const HomeSidebar = () => {
  const pathname = usePathname();
  const detail = {
    "/home" : "fff",
  }
  return (
    <aside className=" flex justify-end items-end my-8 w-full">
      <div className="border bg-white border-[#44498D]  w-96 h-fit text-[#878CA8] rounded-md  p-4 mx-8">
        {pathname === "/home" &&
          <div>
            <p>{detail['/home']}</p>
            <h2 className="font-bold pb-4">Choose your collection </h2>
            <p className="pt-4">Create new integration, modify existing draft or manage collection which already in production.</p>
          </div>
        }
      </div>
    </aside>
  );
};

export default HomeSidebar;
