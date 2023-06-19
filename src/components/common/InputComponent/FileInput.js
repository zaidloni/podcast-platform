import { useState } from "react";

const FileInput = ({ accept, id, fileHandleFnc, text }) => {
  const [fileSelected, setFileSelected] = useState("");
  const onChange = (e) => {
    setFileSelected(e.target.files[0].name);
    fileHandleFnc(e.target.files[0])
  };
  return (
    <>
      <label htmlFor={id} className={`custom-input ${!fileSelected  ?  "label-input" :"active"}`}>
        {fileSelected ? `${fileSelected} is selected` : `${text}`}
      </label>
      <input
        type="file"
        id={id}
        accept={accept}
        style={{ display: "none" }}
        onChange={onChange}
      />
    </>
  );
};

export default FileInput;
