"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useCommonStore } from "@/store/common-store";
import type { TaskPriority, TaskStatus } from "@/types/task";
import { createTask } from "@/lib/tasks";
import { useForm } from "@tanstack/react-form";

type CreateFormFields = {
	title: string;
	description: string;
	priority: TaskPriority;
	status: TaskStatus;
};

const CreateTaskModal = () => {
	const { isCreateTaskModalOpen, closeCreateTaskModal } = useCommonStore();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			closeCreateTaskModal();
		},
		onError: (error) => {
			console.error("Failed to create task:", error);
		},
	});

	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			priority: "MEDIUM",
			status: "TODO",
		},
		onSubmit: async ({ value }: { value: CreateFormFields }) => {
			mutate(value);
		},
	});

	const handleClose = () => {
		form.reset();
		closeCreateTaskModal();
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	};

	return (
		<Transition appear show={isCreateTaskModalOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={handleClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0">
					<div className="fixed inset-0 bg-black bg-opacity-50" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95">
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
									Create New Task
								</Dialog.Title>

								<form
									onSubmit={handleSubmit}
									className="mt-4 space-y-4">
									<form.Field
										name="title"
										validators={{
											onChange: ({ value }) =>
												!value ? "Title is required" : undefined,
										}}
										children={(field) => (
											<div>
												<label
													htmlFor={field.name}
													className="block text-sm font-medium text-gray-700 dark:text-gray-300">
													Title
												</label>
												<input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													className="mt-1 block w-full rounded-md py-2 px-3 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
												/>
												{field.state.meta.errors && (
													<em className="text-sm text-red-500">
														{field.state.meta.errors.join(", ")}
													</em>
												)}
											</div>
										)}
									/>

									<form.Field
										name="description"
										children={(field) => (
											<div>
												<label
													htmlFor={field.name}
													className="block text-sm font-medium text-gray-700 dark:text-gray-300">
													Description (Optional)
												</label>
												<textarea
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													rows={3}
													className="mt-1 block w-full rounded-md py-2 px-3 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
												/>
											</div>
										)}
									/>

									<form.Field
										name="priority"
										children={(field) => (
											<div>
												<label
													htmlFor={field.name}
													className="block text-sm font-medium text-gray-700 dark:text-gray-300">
													Priority
												</label>
												<select
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(e.target.value as TaskPriority)
													}
													className="mt-1 block w-full rounded-md py-2 px-3 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
													<option value="LOW">Low</option>
													<option value="MEDIUM">Medium</option>
													<option value="HIGH">High</option>
												</select>
											</div>
										)}
									/>

									<div className="mt-6 flex justify-end space-x-3">
										<button
											type="button"
											onClick={handleClose}
											className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition">
											Cancel
										</button>
										<button
											type="submit"
											disabled={isPending}
											className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50">
											{isPending ? "Creating..." : "Create Task"}
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default CreateTaskModal;
