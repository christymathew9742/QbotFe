'use client';

import Button from '@/components/ui/button/Button';
import { CircularProgress } from '@mui/material';
import { useRef, useState } from 'react';

interface FieldProps {
  id: string;
  label: string;
  value: string;
  title:string;
  disabled?: boolean;
  onClick?: () => void;
  update?: boolean;
  type?: string;

}

const CopyField = ({ id, label, value, title, disabled=false, onClick, update, type="text" }: FieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!inputRef.current) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 relative">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
        <span
          className="ml-2 inline-block bg-black text-white rounded-full w-3 h-3 text-xs text-center leading-3 cursor-pointer text-[10px] dark:border dark:border-gray-600"
          title={` ${title} `}
        >
          i
        </span>
      </label>
      <div className="custom-scrollbar overflow-x-auto sm:w-full">
        <div className="flex items-center gap-2 min-w-[840px]">
          <div className={`relative ${onClick ? 'w-[84%]' : 'w-full'} group`}>
            <input
              id={id}
              ref={inputRef}
              value={value}
              readOnly
              type={type}
              disabled={disabled}
              className="w-full p-2.5 pr-10 text-sm text-gray-500 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-text"
            />
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy'}
              aria-label={copied ? 'Copied!' : 'Copy'}
              className="btn absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {copied ? (
                <svg className="w-4 h-4 text-blue-700 dark:text-blue-500" fill="none" viewBox="0 0 16 12">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 18 20">
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                </svg>
              )}
            </button>
          </div>

          {onClick && (
            <Button
              onClick={onClick}
              size="sm"
              type="submit"
              className="w-[16%] !py-[11px]"
              disabled={value && true || false}
            >
              {update ? <><CircularProgress size={20} className="mr-2 !text-white"/></> : <>Generate Token</>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyField;
