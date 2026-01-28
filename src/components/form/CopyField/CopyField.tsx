'use client';

// import Button from '@/components/ui/button/Button';
import { Button, CircularProgress } from '@mui/material';
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
      <label htmlFor={id} className="block mb-2 text-sm font-medium color-primary dark:text-white">
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
              className="w-full h-[43px]! p-2.5 pr-10 text-sm text-color-primary-light bg-gray-50 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-color-primary-light cursor-text"
            />
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy'}
              aria-label={copied ? 'Copied!' : 'Copy'}
              className="btn absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-lg text-color-primary-light hover:bg-gray-100 dark:text-color-primary-light dark:hover:bg-color-primary"
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
              type="submit"
              onClick={onClick} 
              className={`bg-app-theme! px-6! py-[11px]! text-white! rounded-lg! text-xxs! font-medium! items-center! w-[16%]! ${value ? 'opacity-50! cursor-not-allowed!' : ''}`}
              disabled={value && true || false}
              sx={{ textTransform: 'none', float: 'right' }}
            >
              {update ? (
                  <>
                    Generating...
                    <svg className="h-4 w-4 animate-spin ml-4!" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  </>
              ) : (
                  "Generate Token"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyField;
