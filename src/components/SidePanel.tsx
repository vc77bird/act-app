import React, { useState, useEffect, useRef } from 'react';
import { Column, Task, Id } from "../types";

interface SidePanelProps {
  task : Task | null;
  column: Column | undefined;
  selectedTaskId: Id | null;
  onCloseButtonClick: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onAddTask: (newTask: Task) => void;
  onDeleteTask: (deletedTask: Task) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
    task,
    column,
    selectedTaskId,
    onCloseButtonClick,
    onUpdateTask,
    onAddTask,
    onDeleteTask
  }) => {
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [isNewTask, setIsNewTask] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false); // Track sidebar visibility
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update editedTask when task prop changes
    if (task) {
      setEditedTask({ ...task });
      setIsNewTask(task.id === '');
      setIsVisible(true); // Show sidebar when task is available
    }
  }, [task]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onCloseButtonClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCloseButtonClick]);

  useEffect(() => {
    if (selectedTaskId !== null) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedTaskId]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCloseButtonClick();
    }, 500); // Delay closing for 500 milliseconds to allow the sidebar to animate out
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> ) => {
    if (editedTask) {
      const { name, value } = e.target;
      setEditedTask((prevTask) => ({
        ...prevTask!,
        [name]: value,
      }));
    }
  };

  const handleSubmitButtonClick = () => {
    if (editedTask) {
      onUpdateTask(editedTask);
      onCloseButtonClick();
    }
  };

  const handleAddButtonClick = () => {
    if (editedTask) {
      onAddTask(editedTask);
      onCloseButtonClick();
    }
  };

  const handleDeleteButtonClick = () => {
    if (editedTask) {
      onDeleteTask(editedTask);
      onCloseButtonClick();
    }
  }

  if (!editedTask) return;

  return (
    <div className={`fixed top-0 right-0 h-full bg-gray-800 z-50 w-[30rem] transition-transform duration-1000 ease-in-out ${isVisible ? 'transform translate-x-0' : 'transform translate-x-full'}`}>
      <div className="p-4 h-full overflow-y-auto text-gray-300 text-2xl">
        <button
          className="
            close-button
            absolute
            top-0
            right-0
            p-2
            bg-transparent
            border-none
            cursor-pointer
            hover:text-gray-800
            text-4xl
          "
          onClick={handleClose}
        >
          <span>&times;</span>
        </button>
        <h2 className='bg-mainBackgroundColor w-fit p-2 font-bold'>Status: {column?.title}</h2>
        <label
          className="
            block
            my-2
          "
          htmlFor="username"
        >
          User Name
        </label>
        <input
          className="
            block
            bg-gray-300
            text-gray-700
            mb-2
            w-full
            p-1
          "
          type="text"
          name="username"
          id="username"
          autoFocus
          value={editedTask.username}
          onChange={handleInputChange}
          />
        <label
          className="
            block
            mb-2
          "
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="
            block
            bg-gray-300
            text-gray-700
            mb-2
            w-full
            p-1
          "
          type="email"
          name="email"
          id="email"
          value={editedTask.email}
          onChange={handleInputChange}
          />
        <label
          className="
            block
            mb-2
          "
          htmlFor="statusDate"
        >
          Status Date
        </label>
        <input
          className="
            block
            bg-gray-300
            text-gray-700
            mb-5
            w-full
            p-1
          "
          type="text"
          name="statusDate"
          id="statusDate"
          value={editedTask.statusDate}
          onChange={handleInputChange}
        />
        <label
          className="
            block
            mb-2
          "
          htmlFor="department"
        >
          Department
        </label>
        <select
          className="
            block
            bg-gray-300
            text-gray-700
            mb-5
            w-full
            p-1
          "
          name="department"
          id="department"
          value={editedTask.department}
          onChange={handleInputChange}
        >
          <option id='0'>MEDONC</option>
          <option id='1'>RADONC</option>
        </select>
        {isNewTask ? (      
          <div
            className="
              flex
              justify-evenly
            "
          >
            <button
              className="
                flex-shrink-0
                border
                bg-lime-700
                border-lime-500
                hover:bg-lime-500
                hover:border-lime-300
                text-gray-200
                font-bold
                py-2
                w-36
                rounded
              "
              type="button"
              onClick={handleAddButtonClick}
            >
              Add
            </button>
            <button
              className="
                border
                bg-red-700
                border-red-500
                hover:bg-red-500
                hover:border-red-300
                text-2xl
                text-white
                py-2
                w-36
                rounded
              "
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        ) :(
          <div
            className="
              flex
              justify-evenly
            "
          >
            <button
              className="
                border
                bg-lime-700
                border-lime-500
                hover:bg-lime-500
                hover:border-lime-300
                text-gray-200
                font-bold
                py-2
                w-36
                rounded
              "
              type="button"
              onClick={handleSubmitButtonClick}
            >
              Update
            </button>
            <button
              className="
                border
                bg-red-700
                border-red-500
                hover:bg-red-500
                hover:border-red-300
                text-2xl
                text-white
                py-2
                w-36
                rounded
              "
              type="button"
              onClick={handleDeleteButtonClick}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SidePanel