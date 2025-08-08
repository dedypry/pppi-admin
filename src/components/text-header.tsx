import { ReactNode } from 'react';

interface Props {
    title: string;
    val: string;
    rightIcon?: ReactNode;
    fontSize?: string;
    width?: number;
}
export default function TextHeader({ title, val, rightIcon, fontSize = '12px', width = 60 }: Props) {
    return (
        <div className={`flex items-center gap-2 align-middle text-[${fontSize}] text-gray-500`}>
            <p style={{ width: width }}>{title}</p>
            <p>:</p>
            <p>{val}</p>
            {rightIcon && rightIcon}
        </div>
    );
}
