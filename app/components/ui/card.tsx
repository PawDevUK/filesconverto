import React from 'react';

const PricingCard = () => {
  return (
    <div className="max-w-sm w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Standard plan</h3>
      </div>

      <div className="mb-6 flex items-baseline space-x-2 text-gray-900 dark:text-white">
        <span className="text-3xl font-semibold">$</span>
        <span className="text-5xl font-extrabold">49</span>
        <span className="text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
      </div>

      <ul className="mb-6 space-y-4 text-gray-500 dark:text-gray-400">
        <li className="flex items-center">
          <CheckIcon active />
          <span className="ml-3">2 team members</span>
        </li>
        <li className="flex items-center">
          <CheckIcon active />
          <span className="ml-3">20GB Cloud storage</span>
        </li>
        <li className="flex items-center">
          <CheckIcon active />
          <span className="ml-3">Integration help</span>
        </li>
        <li className="flex items-center line-through decoration-gray-500">
          <CheckIcon />
          <span className="ml-3">Sketch Files</span>
        </li>
        <li className="flex items-center line-through decoration-gray-500">
          <CheckIcon />
          <span className="ml-3">API Access</span>
        </li>
        <li className="flex items-center line-through decoration-gray-500">
          <CheckIcon />
          <span className="ml-3">Complete documentation</span>
        </li>
        <li className="flex items-center line-through decoration-gray-500">
          <CheckIcon />
          <span className="ml-3">24×7 phone & email support</span>
        </li>
      </ul>

      <button
        type="button"
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Choose plan
      </button>
    </div>
  );
};

const CheckIcon = ({ active = false }: { active?: boolean }) => (
  <svg
    className={`h-4 w-4 shrink-0 ${active ? 'text-blue-700 dark:text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 
    4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 
    1.414-1.414L9 10.586l3.293-3.293a1 1 
    0 0 1 1.414 1.414Z" />
  </svg>
);

export default PricingCard;