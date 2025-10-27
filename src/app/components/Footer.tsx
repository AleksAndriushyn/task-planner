const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full text-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-auto">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © {currentYear} Task Planner. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;