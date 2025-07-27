type TitleProps = {
    label: string;
}

export const Title = ({ label }: TitleProps) => {
    return(
        <h1 className="w-full md:w-max text-[14px]  md:text-[16px] font-medium bg-white rounded-[2rem] px-[1rem] py-[0.5rem] text-wrap">
            {label}
        </h1>
    )
}
