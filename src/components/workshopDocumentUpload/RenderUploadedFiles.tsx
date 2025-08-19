import React from "react";
import { UploadedFile } from "./types";
import FilePreview from "./FilePreview";

interface RenderUploadedFilesProps {
    files: UploadedFile[];
    fieldIndex: number;
    setFiles: any;
    filesArray: any[];
}

const RenderUploadedFiles: React.FC<RenderUploadedFilesProps> = ({
    files,
    fieldIndex,
    setFiles,
    filesArray,
}) => {
    const handleDelete = (fileIndex: number) => {
        const updatedFiles = filesArray[fieldIndex].filter(
            (_: any, i: number) => i !== fileIndex
        );
        const updatedFilesArray = [...filesArray];
        updatedFilesArray[fieldIndex] = updatedFiles;
        setFiles(updatedFilesArray);
    };

    return (
        <div className="space-y-3">
            {files.map((file: UploadedFile, i: number) => (
                <div
                    key={i}
                    className="border border-gray-300 rounded-md p-3 shadow-sm relative text-sm text-gray-700 bg-white"
                >
                    <div className="flex justify-between items-center">
                        {/* {file instanceof File ? (
                            <FilePreview file={{ name: file.name, url: URL.createObjectURL(file), type: file.type }} />
                        ) : (
                            <FilePreview file={{ name: file.name, url: file.url, type: file.type || "" }} />
                        )} */}
                        <div>
                            <p className="font-medium">{file.name}</p>
                        </div>
                        <button
                            className="text-red-500 hover:text-red-700 text-lg"
                            onClick={() => handleDelete(i)}
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </div>

                    {/* Optional: Progress bar */}
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `100%` }}
                        />
                    </div>

                    <div className="mt-2">
                        {file instanceof File ? (
                            <a
                                href={URL.createObjectURL(file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-xs underline"
                            >
                                Click to view
                            </a>
                        ) : (
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-xs underline"
                            >
                                Click to view
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RenderUploadedFiles;
