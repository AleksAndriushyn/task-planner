import type { Task, TaskStatus } from "@/types/task";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useMemo } from "react";
import DeskItem from "./DeskItem";

interface DeskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

const DeskColumn: React.FC<DeskColumnProps> = ({
  status,
  title,
  tasks,
}) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-80 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 flex-shrink-0"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {title} ({tasks.length})
      </h2>

      <SortableContext
        id={status}
        items={taskIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-grow space-y-3 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No tasks here yet.
            </p>
          ) : (
            tasks.map((task) => <DeskItem key={task.id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default DeskColumn;