import { useState, useEffect } from "react";
import FileExplorer from "../Component/FileExplorer";

// Define FileItemProps type
interface FileItemProps {
  name: string;
  type: string;
  size: string;
  date: string; // Add a property for the date
  children: FileItemProps[];
}

function LandingPage() {
  const [DataList, setDataList] = useState<FileItemProps[]>([]); // Provide initial value as an empty array
  const [newItemName, setNewItemName] = useState<string>(''); // State for the name of the new folder/file

  useEffect(() => {
    // Save DataList to localStorage whenever it changes
    localStorage.setItem('DataList', JSON.stringify(DataList));
  }, [DataList]);

  const randomNum = () => {
    return (Math.floor(Math.random() * 50000))
  }
  
  // Function to get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // Function to add a new folder
  const addFolder = () => {
    if (newItemName.trim() !== '') {
      const currentDate = getCurrentDate(); // Get the current date
      const newFolder: FileItemProps = { name: newItemName, type: "FOLDER", size: randomNum() + "KB", date: currentDate, children: [] };
      setDataList([...DataList, newFolder]);
      setNewItemName(''); // Reset the input field after adding
    }
  };

  // Function to add a new file
  const addFile = () => {
    if (newItemName.trim() !== '') {
      const currentDate = getCurrentDate(); // Get the current date
      const newFile: FileItemProps = { name: newItemName, type: "FILE", size: randomNum() + "0KB", date: currentDate, children: [] };
      setDataList([...DataList, newFile]);
      setNewItemName(''); // Reset the input field after adding
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
          placeholder="Enter folder/file name"
        />
        <button onClick={addFolder}>Add Folder</button>
        <button onClick={addFile}>Add File</button>
      </div>
      <FileExplorer DataList={DataList} setDataList={setDataList} />
    </>
  );
}

export default LandingPage;
