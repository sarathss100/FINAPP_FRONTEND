"use client";
import { AdminSideBar } from '@/components/adminsidebar/AdminSideBar';

const Test = function () {
  return (
    <div className='flex h-screen'>
      <AdminSideBar />
      <main className={`flex-1 bg-gray-100 transition-all duration-300`}>
        <div className='p-6'>
          <h1 className='text-2xl font-bold'>Main Content</h1>
          <p>This is the main content area. It adjusts dynamically based on the sidebar state.</p>
        </div>
      </main>
    </div>
  );
};

export default Test;
