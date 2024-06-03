import React, { useState } from "react";
import styled from "styled-components";

interface FileItemProps {
  name: string;
  type: string;
  size: string;
  date: string;
  children: FileItemProps[];
}

interface FileExplorerProps {
  DataList: FileItemProps[];
  setDataList: React.Dispatch<React.SetStateAction<FileItemProps[]>>;
}

const FileExplorerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`;

const FileExplorerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: black;
  font-weight: bold;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FileItemWrapper = styled.li<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.isExpanded ? "black" : "#3c3d3e")};
  &:hover {
    background-color: #3c3d3e;
  }
`;

const FileIcon = styled.span`
  margin-right: 8px;
`;

const FileName = styled.span`
  flex-grow: 1;
`;

const FileSize = styled.span`
  margin-right: 10%;
  margin-left: 20%;
`;

const FileType = styled.span`
  margin-left: 15%;
  margin-right: 15%;
  color: #aaa;
`;

const InputField = styled.input`
  margin-bottom: 8px;
`;

const FileExplorer: React.FC<FileExplorerProps> = ({
  DataList,
  setDataList,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store the selected file

  const toggleFolder = (name: string) => {
    setExpandedFolders((prevExpandedFolders) => ({
      ...prevExpandedFolders,
      [name]: !prevExpandedFolders[name],
    }));
    setCurrentFolder(name); // Set the current folder when toggling
  };

  const addFolder = () => {
    if (currentFolder !== null && newItemName.trim() !== "") {
      const currentDate = new Date().toLocaleDateString();
      const updatedDataList = DataList.map((item) => {
        if (item.name === currentFolder && item.type === "FOLDER") {
          const newFolder: FileItemProps = {
            name: newItemName,
            type: "FOLDER",
            size: "0KB",
            date: currentDate,
            children: [],
          };
          return { ...item, children: [...item.children, newFolder] };
        }
        return item;
      });
      setDataList(updatedDataList);
      setNewItemName("");
    }
  };

  const addFile = () => {
    if (currentFolder !== null && newItemName.trim() !== "" && selectedFile) {
      const currentDate = new Date().toLocaleDateString(); // Get the current date
      const newFile: FileItemProps = {
        name: newItemName,
        type: "FILE",
        size: selectedFile.size.toString() + "KB", // Include the size of the file
        date: currentDate,
        children: [],
      };
      setDataList((prevDataList) => {
        const updatedDataList = prevDataList.map((item) => {
          if (item.name === currentFolder && item.type === "FOLDER") {
            return { ...item, children: [...item.children, newFile] };
          }
          return item;
        });
        return updatedDataList;
      });
      setNewItemName(""); // Reset the input field after adding
      setSelectedFile(null); // Clear the selected file
      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
      if (fileInput) fileInput.value = ""; // Clear the file input field
    }
  };
  

  const renderFiles = (files: FileItemProps[]) => {
    return files.map((file, index) => {
      const isExpanded = expandedFolders[file.name] || false;
      return (
        <FileItemWrapper key={index} isExpanded={isExpanded}>
          <div onClick={() => toggleFolder(file.name)}>
            <FileIcon>
              {file.type === "FOLDER" ? (isExpanded ? "📂" : "📁") : "📄"}
            </FileIcon>
            <FileName>{file.name}</FileName>
            <FileSize>{file.size}</FileSize>
            <FileType>{file.type}</FileType>
            <span>{file.date}</span>
          </div>
          {isExpanded && file.children.length > 0 && (
            <FileList>{renderFiles(file.children)}</FileList>
          )}
        </FileItemWrapper>
      );
    });
  };

  return (
    <FileExplorerWrapper>
      <FileExplorerHeader>
        <span>File Explorer</span>
        <span>Size</span>
        <span>Type</span>
        <span>Date</span>
      </FileExplorerHeader>
      <InputField
        type="text"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        placeholder="Enter folder/file name"
      />
      <input
        id="fileInput"
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setNewItemName(e.target.files[0].name); // Set the name of the selected file as the input value
          }
        }}
      />
      <button onClick={addFolder}>Add Folder</button>
      <button onClick={addFile}>Upload File</button>
      <FileList>{renderFiles(DataList)}</FileList>
    </FileExplorerWrapper>
  );
};

export default FileExplorer;
