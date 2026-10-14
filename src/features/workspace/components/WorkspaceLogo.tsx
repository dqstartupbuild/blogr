import Image from "next/image";
import blogrPen from "../assets/blogr-pen.png";

export const WorkspaceLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        alt=""
        className="h-9 w-9 lg:h-10 lg:w-10"
        priority
        src={blogrPen}
      />
      <span className="text-lg font-semibold text-black lg:text-xl">Blogr</span>
    </div>
  );
};
