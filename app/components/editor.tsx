"use client";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = lazy(() => import("react-quill-new"));

export const Editor = ({
  initialValue,
  name,
  onChange,
}: {
  name?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  value?: string;
}) => {
  const [value, setValue] = useState(initialValue);
  const [isClient, setIsClient] = useState(false);

  const editorRef = useRef(null);

  const handleChange = (content: string) => {
    setValue(content);
    onChange?.(content);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isClient) return null;

  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={value}
        onChange={handleChange}
      />
      <textarea name={name} defaultValue={value} hidden />
    </Suspense>
  );
};
