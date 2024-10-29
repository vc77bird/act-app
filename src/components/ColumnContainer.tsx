import { Column, Id, Task } from "../types";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

interface Props {
  column: Column;
  tasks: Task[];
  activeTaskId: Id | null;
  createTask: (columnId: Id) => void;
  updateTaskClick: (task : Task) => void;
  copyText: (text: string) => void;
}

function ColumnContainer({
          column,
          tasks,
          activeTaskId,
          createTask,
          updateTaskClick,
          copyText,
        }: Props) {

  const { setNodeRef, transform, transition, } =
    useSortable({
      id: column.id,
      data: {
          type: "Column",
          column,
      },
    });

const sortedTasks = tasks.sort((a, b) => {
  const dateA = new Date(a.statusDate);
  const dateB = new Date(b.statusDate);
  return dateA.getTime() - dateB.getTime();
})

  const style = {
      transition,
      transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-columnBackgroundColor
        min-w-[25rem]
        h-[95vh]
        rounded-md
        flex
        flex-col
        text-2xl
        overflow-y-scroll
      "
    >
      {/* Column title */}
      <div
        className="
          bg-mainBackgroundColor
          text-md
          h-[6rem]
          rounded-md
          rounded-b-none
          p-3
          font-bold
          border-columnBackgroundColor
          border-4
          text-3xl
        "
      >
        <div className="grid grid-cols-8">
          <div className="col-span-5">
            {column.title}
          </div>
          {column.title === 'AU Created' ?
            <div className="col-span-2">
              <a
                className="
                  block
                  text-center
                  text-xl
                  border
                  bg-yellow-700
                  border-yellow-500
                  hover:bg-yellow-600
                  hover:border-yellow-300
                  text-gray-200
                  font-bold
                  p-2
                  rounded
                "
                href="https://advarrauniversity.learnupon.com/users"
                target="blank">
                  AU
              </a>
            </div>
           : column.title === 'eReg Created' ?
            <div className="col-span-2">
              <a
                className="
                  block
                  text-center
                  text-xl
                  border
                  bg-lime-700
                  border-lime-500
                  hover:bg-lime-500
                  hover:border-lime-300
                  text-gray-200
                  font-bold
                  p-2
                  rounded
                "
                href="https://gcc-ereg.advarracloud.com/forte-platform-web/contacts"
                target="blank">
                  eReg
              </a>
            </div>
          : <div className="col-span-2"></div>
          }
          <div className="col-span-1 text-right">
            {sortedTasks.length}
          </div>
        </div>
      </div>

      {/* Column task container */}
      <div
        className="
          flex
          h-full
          max-h-full
          flex-col
          gap-4
          p-2
          overflow-x-hidden
          overflow-y-auto
        "
      >
        {sortedTasks.map((task) => (
          <TaskCard
            key             = { task.id }
            task            = { task }
            updateTaskClick = { updateTaskClick }
            copyText        = { copyText }
            isActive        = { activeTaskId === task.id }
          />
        ))}
      </div>
      {/* Column footer */}
      {column.id === 'requested' && (
        <button
          className="
            flex
            gap-2
            items-center
            border-2
            rounded-md
            p-4
            m-2
            border-gray-600
            hover:bg-mainBackgroundColor
            hover:text-lime-500
            active:bg-black
            text-xl
          "
          onClick={() => {
            createTask(column.id);
          }}
        >
          <PlusIcon />
          Add
        </button>
      )}
    </div>
  );
}

export default ColumnContainer;
