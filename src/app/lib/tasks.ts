import type { Task } from "@/types/task";
import { apiClient } from "./axiosInstance";

type CreateTaskDTO = Omit<Task, "id" | "created_at">;
type UpdateTaskDTO = Partial<Omit<Task, "id" | "created_at">>;

export const getTasks = async(): Promise<Task[]> => {
    const response = await apiClient<Task[]>({
        url: "tasks",
        method: "GET",
        params: {
            select: "*",
            order: "created_at.desc",
        },
    });

    return response;
}

export const createTask = async (taskData: CreateTaskDTO): Promise<void> => {
  const dataToInsert = [taskData];

  await apiClient<void>({
    url: "tasks",
    method: "POST",
    data: dataToInsert,
    config: {
      headers: {
        "Prefer": "return=minimal",
      },
    },
  });
};


export const updateTask = async (
  taskId: string,
  updates: UpdateTaskDTO
): Promise<void> => {
  await apiClient<void>({
    url: "tasks",
    method: "PATCH",
    data: updates,
    params: {
      id: `eq.${taskId}`,
    },
    config: {
      headers: {
        "Prefer": "return=minimal",
      },
    },
  });
};
