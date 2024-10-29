import { Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CopyIcon from "../icons/CopyIcon";
import EditIcon from "../icons/EditIcon";

interface Props {
  task: Task;
  isActive: boolean;
  copyText: (text: string) => void;
  updateTaskClick: (task : Task) => void;
}

function TaskCard({ task, isActive, copyText, updateTaskClick }: Props) {
  
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          opacity-30
        bg-mainBackgroundColor
          p-2.5
          h-[10rem]
          min-h-[8rem]
          rounded-xl
          border-2
          border-lime-600
          cursor-grab
          relative
          text-2xl
        "
      />
    );
  }

return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-mainBackgroundColor
        p-2.5
        h-[7rem]
        min-h-[7rem]
        rounded-xl
        hover:ring-2
        hover:ring-inset
        hover:ring-lime-600
        cursor-grab
        border-lime-600
        ${isActive ? 'border-l-4' : 'border-0'}
      `}
    >

      <div
        className="
          grid
          grid-cols-8
          grid-rows-3
          gap-x-5
        "
      >
        <div
          className="col-span-1"
        >
          <button
            onClick={() => {              
              copyText(task.username);
            }}
            className="
              stroke-white
              bg-columnBackgroundColor
              rounded
              opacity-20
              hover:opacity-100
            "
          >
            <CopyIcon />
          </button>
        </div>

        <div className="col-span-6">
          {task.username}
        </div>

        <div
          className="col-span-1"
        >
          <button
            onClick={() => updateTaskClick(task)}
            className="
              stroke-white
              bg-columnBackgroundColor
              rounded
              opacity-20
              hover:opacity-100
            "
          >
            <EditIcon />
          </button>
        </div>


        <div
          className="col-span-1"
        >
          <button
            onClick={() => {
              copyText(task.email);
            }}
            className="
              bg-columnBackgroundColor
              rounded
              opacity-20
              hover:opacity-100
            "
          >
            <CopyIcon />
          </button>
        </div>

      <div
        className="
          text-slate-400
          col-span-6
          truncate
          text-lg
        "
        >
          {task.email}
      </div>

      <div
          className={task.department === 'RADONC' ? `col-span-2 text-xl text-yellow-500` : 'col-span-2 text-xl text-green-500'}
        >
          {task.department}
        </div>
        <div
          className="col-span-6 text-xl text-right"
        >
          {task.statusDate}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
