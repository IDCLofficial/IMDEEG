import Image from "next/image";

export default function Wave({className, size}: {className: string, size?:number}) {
    return (
        <Image src="/hand.svg" width={size || 20} height={size || 20} alt="wave" className={`${className}`}/>
    )
}