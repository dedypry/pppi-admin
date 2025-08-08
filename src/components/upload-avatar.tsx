import { Avatar, Button } from '@heroui/react';
import { useRef } from 'react';

interface Props {
    file: any;
    setFile: CallableFunction;
    post?: () => void;
    label?: string;
    showButtonUpload?:boolean
}
export default function UploadAvatar({ file, setFile, post, label, showButtonUpload=false }: Props) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="flex justify-center gap-2">
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

            <Avatar
                isBordered
                className="h-32 w-32 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                src={file instanceof File ? URL.createObjectURL(file) : (file as string) || ''}
            />

            <div className="flex flex-col gap-1 self-center">
                {label && <p className="text-xs italic text-gray-400">{label}</p>}

                <Button size="sm" radius="full" className="px-10" onPress={() => setFile('')}>
                    Reset
                </Button>
                {showButtonUpload && (
                    <Button size="sm" radius="full" className="bg-info px-10" onPress={() => fileInputRef.current?.click()}>
                        Upload
                    </Button>
                )}

                {post && (
                    <Button size="sm" radius="full" color="primary" className="px-10" onPress={post}>
                        Simpan
                    </Button>
                )}
            </div>
        </div>
    );
}
