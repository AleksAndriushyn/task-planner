"use client";

import { useCommonStore } from "@/store/common-store";
import Link from "next/link";

const Header = () => {
  const { openCreateTaskModal } = useCommonStore();

  return (
    <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 w-full">
      <Link href="/" className="text-3xl font-bold">
        Task Planner Board
      </Link>

      <button
        onClick={openCreateTaskModal}
        className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md"
      >
        + Add New Task
      </button>
    </header>
  );
};

export default Header;