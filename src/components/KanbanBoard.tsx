import { useCallback, useEffect, useMemo, useState } from "react";
import { Column, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import api from '../api'
import SidePanel from "./SidePanel";

const KanbanBoard: React.FC = () => {
  
  const dbNames = ['reviewer', 'staff']

  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dbName, setDBName] = useState<string>(dbNames[0]);

  const fetchTasks = useCallback(async () => {
    const response = await api.get(`/all_accounts/?dbname=eReg_${dbName}`);
    setTasks(response.data);
  }, [dbName]);

  const fetchStatuses = useCallback(async () => {
    const response = await api.get(`/statuses/?dbname=eReg_${dbName}`);
    setColumns(response.data);
  }, [dbName]);
  
  useEffect(() => {
    fetchStatuses();
    fetchTasks();
    updatePageTitle();
  }, [dbName]);
  
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  
  const [activeColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeTaskStatus, setActiveTaskStatus] = useState<any>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
    
  const updatePageTitle = () => {
    document.title = `[${dbName.charAt(0).toUpperCase() + dbName.slice(1)}] - OnTrack eReg Account Creation Tracker`
  }

  // API request to create a new task
  const createAPITask = async (newTask: Task) => {
    try {
      // Make an HTTP POST request using axios and the api instance
      const response = await api.post(`/accounts/?dbname=eReg_${dbName}`, newTask);
  
      // If the request is successful, return the created task
      return response.data;
    } catch (error) {
      // Handle any errors
      console.error('Error creating task:', error);
      return null;
    }
  };

  // API request to update a task
  const updateAPITask = async (task: Task) => {
    try {
      // Make an HTTP POST request using axios and the api instance
      const response = await api.put(`/account/?dbname=eReg_${dbName}&id=${task.id}`, task);
  
      // If the request is successful, return the created task
      return response.data;
    } catch (error) {
      // Handle any errors
      console.error('Error updating task:', error);
      return null;
    }
  };

  // API request to delete a task
  const deleteAPITask = async (task: Task) => {
    try {
      // Make an HTTP POST request using axios and the api instance
      const response = await api.delete(`/account/?dbname=eReg_${dbName}&id=${task.id}`);
  
      // If the request is successful, return the created task
      return response.data;
    } catch (error) {
      // Handle any errors
      console.error('Error updating task:', error);
      return null;
    }
  };

  // X Side Panel button click
  const handleCloseButtonClick = () => {
    setShowSidePanel(false);
    setActiveTask(null);
  };

  // Togle Side Panel when Edit button clicked on a card
  const toggleSidePanel = (task: Task) => {
    
    if (activeTask?.id == task.id) {
      handleCloseButtonClick();
    } else {
      setActiveTask(task);
      setShowSidePanel(true);
    }
  };
  
  // Update button click in the Side Panel
  const handleUpdateTask = async (updatedTask: Task) => {
    const updatedAPITask = await updateAPITask(updatedTask);
    if (updatedAPITask) {
      setShowSidePanel(false);
      setActiveTask(null);
      fetchTasks();
    }
  };

  // Add button click in the Requested column
  const createTask = async () => {
    const newTask: Task = {
      id : '',
      username: '',
      email: '',
      status: 'requested',
      statusDate: getFormattedDate(),
      department: 'MEDONC',
    };

    setActiveTask(newTask);
    setShowSidePanel(true);
  };

  // Add button click in the Side Panel
  const handleAddTask = async (newTask: Task) => {
    const createdAPITask = await createAPITask(newTask);
    if (createdAPITask) {
      fetchTasks();
    }
  };

  // Delete button click in the Side Panel
  const handleDeleteTask = async (deleteTask: Task) => {
    const deletedAPITask = await deleteAPITask(deleteTask);
    if (deletedAPITask) {
      fetchTasks();
    }
  };

  // If more than 5 columns change the presentation
  const autoCols = columns.length > 5 ? 'fr' : 'max'

  return (
    <div
      className="
        m-auto
        grid
        h-full
        w-full
        overflow-x-auto
        overflow-y-hidden
        px-[1rem]
      "
    >
      <div className="grid grid-cols-2 p-2">
        <div className="text-4xl font-bold">
          Total: { tasks.length }
        </div>
        {dbNames.length > 1 &&
          <div className="absolute top-0 right-0 mt-3 mr-6 text-2xl">
            <select
              className="p dark:bg-gray-800"
              name="dbNameSelect"
              id="dbNameSelect"
              defaultValue={dbName}
              onChange={e => setDBName(e.target.value)}
            >
              {dbNames.map(db => (
                <option
                  className="dark:bg-gray-800"
                  key={db}
                  id={db}
                  value={db}
                >
                  {db.charAt(0).toUpperCase() + db.slice(1)}
                </option>
              ))}
            </select>
          </div>
        }
      </div>
      <div>
        <div className="overflow-y-scroll">
          <DndContext
            sensors     = { sensors }
            onDragStart = { onDragStart }
            onDragEnd   = { onDragEnd }
            onDragOver  = { onDragOver }
          >

            <div className={`grid grid-flow-col auto-cols-${autoCols} gap-2`}>
              <SortableContext items={ columnsId }>
                {columns.map(col => (
                  <ColumnContainer
                    key             = { col.id }
                    column          = { col }
                    createTask      = { createTask }
                    copyText        = { copyText }
                    updateTaskClick = { toggleSidePanel }
                    activeTaskId    = { activeTask ? activeTask.id : null }
                    tasks           = { tasks.filter(
                                        task =>
                                          task.status === col.id
                                        )
                                      }
                  />
                ))}
              </SortableContext>
            </div>

            {createPortal(
              <DragOverlay>
                {activeColumn && (
                    <ColumnContainer
                        column          = { activeColumn }
                        createTask      = { createTask }
                        copyText        = { copyText }
                        updateTaskClick = { toggleSidePanel }
                        activeTaskId    = { activeTask ? activeTask.id : null }                        
                        tasks           = { tasks.filter(
                                            task => 
                                              task.status === activeColumn.id
                                            )
                                          }
                    />
                )}
                {activeTask && (
                  <TaskCard
                    task            = { activeTask }
                    copyText        = { copyText }
                    isActive        = { true }
                    updateTaskClick = { toggleSidePanel }
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>

        {showSidePanel &&
          <SidePanel
            task               = { activeTask }
            column             = { columns.find(column => column.id === activeTask?.status) }
            selectedTaskId     = { activeTask?.id ?? null }
            onCloseButtonClick = { handleCloseButtonClick }
            onUpdateTask       = { handleUpdateTask }
            onAddTask          = { handleAddTask }
            onDeleteTask       = { handleDeleteTask }
          />}
      
      </div>
    </div>
  );

  function copyText(text: string) {
    unsecuredCopyToClipboard(text)
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      setActiveTaskStatus(event.active.data.current.task.status);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;
    
    const activeIndex = tasks.findIndex((task) => task.id === activeId);
    
    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const overIndex = tasks.findIndex((task) => task.id === overId);

      setTasks((tasks) => {
        if (tasks[activeIndex].status != tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(tasks, activeIndex, tasks.length);
        }

        return tasks;
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].status = '' + overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
    // if (activeTask && isActiveATask && isOverAColumn) {
    //   const overColumnId = overId as Id; // Convert to Id type
    //   const lastTaskIndex = tasks
    //     .slice()
    //     .reverse()
    //     .findIndex((task) => task.status === overColumnId);
    //   if (lastTaskIndex !== -1) {
    //     const newIndex = tasks.length - lastTaskIndex;
    //     setTasks((tasks) => {
    //       activeTask.status = String(overColumnId);
    //       return arrayMove(tasks, activeIndex, newIndex);
    //     });
    //   }
    // }
  }

  function onDragEnd() {
    if (activeTask && activeTask.status !== activeTaskStatus) {
      activeTask.statusDate = getFormattedDate();
      handleUpdateTask(activeTask)
    }
  }
}

// Generate string 'mm/dd/yyy' of current date
const getFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
  const year = today.getFullYear();
  return `${month}/${day}/${year}`;
};

const unsecuredCopyToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus({preventScroll:true});
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
}

export default KanbanBoard;
