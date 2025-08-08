import { Tabs, TabsProps } from "@heroui/react";

export default function MyTabs({...props}:TabsProps) {
    return (
        <Tabs
            placement="start"
            color="primary"
            classNames={{
                base:'sticky top-20',
                tabList: 'bg-white shadow-lg border',
                tabContent: 'text-left text-gray-800 font-semibold text-start',
                panel: 'w-full',
                tab: 'w-[150px] text-left',
            }}
            {...props}
        />
    );
}
