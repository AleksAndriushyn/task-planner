"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types/task";
import clsx from "clsx";

interface DeskItemProps {
  task: Task;
}

const DeskItem: React.FC<DeskItemProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        "bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 cursor-grab",
        isDragging && "opacity-50 ring-2 ring-blue-500"
      )}
    >
      <h3 className="font-medium text-gray-900 dark:text-white">
        {task.title}
      </h3>
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 mt-2">
        <span>{task.priority}</span>
        <span>{new Date(task.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default DeskItem;