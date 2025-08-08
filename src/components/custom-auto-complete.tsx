import { Autocomplete, AutocompleteProps } from '@heroui/react';

export default function CustomAutoComplete({ ...props }: AutocompleteProps) {
    return (
        <Autocomplete
            variant="bordered"
            labelPlacement="outside"
            color="primary"
            classNames={{
                base: 'text-gray-800',
            }}
            {...props}
        />
    );
}
