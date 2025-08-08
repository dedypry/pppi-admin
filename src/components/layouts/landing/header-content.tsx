import { ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    title?: string;
    subtitle?: string;
}
export default function HeaderContent({ children, title, subtitle }: Props) {
    return (
        <div className={`-mt-[60px] mb-10 flex h-[200px] w-full items-end bg-gradient-to-b from-primary-900 to-primary-700 pb-5 shadow-lg`}>
            <div className="container mx-auto px-10">
                {children}
                <div className="container mx-auto flex flex-col gap-2">
                    <p className="text-[40px] font-bold text-white">{title}</p>
                    <p className="italic text-gray-100">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}
