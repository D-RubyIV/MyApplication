import React, { useRef, useState } from 'react';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    children?: React.ReactNode;
    required?: boolean
}

const InputWithFocusDiv = React.forwardRef<HTMLInputElement, IProps>(
    ({ label, required, children, ...props }, ref) => {
        const divRef = useRef<HTMLDivElement>(null);
        const [isFocused, setIsFocused] = useState(false);

        const handleFocus = () => {
            setIsFocused(true);
        };

        const handleBlur = () => {
            setIsFocused(false);
        };

        return (
            <div
                ref={divRef}
                className={`p-2 mt-2 rounded-md flex flex-col border-2 ${isFocused ? 'ring-1 ring-blue-500' : ''}`}
            >
                <label className='text-[12.5px] font-semibold text-gray-500'>
                    <span>{label}</span>
                    <span>{required ? " (*)": ""}</span>
                </label>
                <input
                    ref={ref}
                    className="focus:outline-none text-sm"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
                {children}
            </div>
        );
    }
);

export default InputWithFocusDiv;
