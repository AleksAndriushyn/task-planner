"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTask } from "@/lib/tasks";
import type { Task, TaskStatus } from "@/types/task";
import DeskColumn from "@/components/Desk/DeskColumn";
import {
  DndContext,
  type DragEndEvent,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import CreateTaskModal from "@/components/modals/CreateTaskModal";

type OptimisticUpdateContext = {
  previousTasks: Task[] | undefined;
};

const HomePage = () => {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { mutate: handleUpdateTask } = useMutation({
    mutationFn: ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<Task>;
    }) => updateTask(taskId, updates),

    onMutate: async ({ taskId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        );
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      console.error("Failed to update task:", err);
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    tasks?.forEach((task) => {
      groups[task.status].push(task);
    });
    return groups;
  }, [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks?.find((t) => t.id === activeId);

    if (!activeTask) return;

    let overColumnStatus: TaskStatus;

    const overTask = tasks?.find((t) => t.id === overId);
    if (overTask) {
      overColumnStatus = overTask.status;
    } else {
      overColumnStatus = overId as TaskStatus;
    }

    if (activeTask.status === overColumnStatus) {
      console.log("No change in status.");
      return;
    }

    console.log(
      `Task ${activeId} moved from ${activeTask.status} to ${overColumnStatus}`
    );
    handleUpdateTask({
      taskId: activeId,
      updates: { status: overColumnStatus },
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-lg">Loading tasks...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading tasks: {error.message}</div>;
  }

  const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <main className="flex flex-grow overflow-x-auto p-6 space-x-6">
        {taskStatuses.map((status) => (
          <DeskColumn
            key={status}
            status={status}
            title={status.replace("_", " ")}
            tasks={groupedTasks[status]}
          />
        ))}
      </main>
      <CreateTaskModal />
    </DndContext>
  );
}

export default HomePage;