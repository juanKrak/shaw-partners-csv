import React, { useState, DragEvent, useRef, useEffect } from 'react';
import fileUploadIcon from '../assets/file_upload.svg';
import autoAnimate from '@formkit/auto-animate'

export type DropzoneProps = {
    required?: boolean
}
    
function Dropzone({required=false}:DropzoneProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [draggingOver, setDraggingOver] = useState(false);
    const parent = useRef(null)

    useEffect(() => {
        if (parent.current) {
            autoAnimate(parent.current)
        }
    }, [parent])

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setDraggingOver(true)
    };
    const handleDragLeave = (_: DragEvent<HTMLLabelElement>) => {
        setDraggingOver(false)
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDraggingOver(false)
        if (e.dataTransfer.files && e.dataTransfer.files) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (files:FileList|null) => {
        setDraggingOver(false)
        if (files && files.length > 0) {
            setFiles(Array.from(files));
        }
    };

    const handleReset = () => {
        setFiles([])
    }

    const handleDeletion = (index: number) => {
        return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault()
            e.stopPropagation()
            setFiles(files.filter((_, i)=>i!== index))
        }
    }

    return (
        <label htmlFor="dropzone" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <div ref={parent} className={
                draggingOver ?
                    "border-black w-full h-full px-4 py-8 flex flex-wrap gap-4 rounded bg-gray-200 transition-all shadow-[inset_0_6px_12px_0_rgb(0_0_0_/_0.3)] border-2"
                    : "border-black w-full h-full px-4 py-8 flex flex-wrap gap-4 rounded bg-gray-200 transition-all shadow-[inset_0_4px_8px_0_rgb(0_0_0_/_0.1)] border"
            }>
                {files.length ?
                        files.map((file, index) =>
                            <button key={file.name+index} type="button" onClick={handleDeletion(index)} className="hover:bg-gray-200 hover:text-black transition-all relative rounded bg-gray-800 h-24 px-4 p-3 flex items-end text-white font-medium shadow-lg">
                                <svg className='h-10 w-10 absolute left-3 top-4 text-violet-600' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <span className='text-sm'>
                                    {file.name}
                                </span>
                            </button>
                        )
                    : <div className="lg:p-16 flex flex-col items-center justify-center h-full w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-16 w-16 mb-4 text-violet-600">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>


                        <span className='lg:inline hidden font-medium text-gray-800'>You can easily <span className="font-bold">drag and drop</span> your files here.</span>
                        <span className='lg:hidden inline font-medium text-gray-800'>Click to <span className="font-bold">open and select</span> your files here.</span>
                    </div>}
            </div>
            <FileInput required={required} fileList={files} onChange={handleChange} onReset={handleReset}/>
        </label>
    );
};

export type FileInputProps = {
    fileList: File[];
    onChange(fileList: FileList | null): void;
    onReset():void
    required: boolean
  };
function FileInput({ fileList = [], onChange, required, onReset }: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        fileList.forEach((file) => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
      }
    }, [fileList]);
  
    return (
        <input
            id="dropzone"
            multiple
            accept='text/csv'
            className="sr-only"
            name="files"
            required={required}
            type="file"
            onReset={onReset}
            ref={inputRef}
            data-testid="uploader"
            onChange={(e) => {
            onChange(e.target.files);
            }}
      />
    );
  };
  


export default Dropzone;
