import { NewsPost } from "../../../../lib/types"
import Image from "next/image"

export const LatestNews = ({item}:{item:NewsPost}) => {
    console.log(item)
    if(!item) return null
    return (
        <div className="bg-[#232323] rounded-xl overflow-hidden flex-1 min-w-[220px] max-w-xs">
            <div className="relative w-full h-28">
                <Image src={`https:${item.fields?.featuredImage?.fields?.file?.url}`} alt={item?.fields?.title} fill className="object-cover" />
            </div>
            <div className="p-4">
                <div className="text-white text-xs font-semibold mb-2 line-clamp-2">{item?.fields?.title}</div>
                <div className="text-gray-400 text-[10px]">{item?.sys?.createdAt}</div>
            </div>
        </div>
    )
}