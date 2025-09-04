import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';
import React, { useEffect, useRef } from 'react'; // 1. Import useEffect and useRef
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users }
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const sidebarRef = useRef(); // 2. Create a ref for the sidebar element

  // 3. Add effect to handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the sidebar is open and the click is outside of the sidebar element, close it
      if (sidebar && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebar(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebar, setSidebar]); // Re-run effect if sidebar state changes

  return (
    <div
      ref={sidebarRef} // Attach the ref to the sidebar's main div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 z-50 ${ // 4. Add a high z-index
        sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="w-16 h-16 rounded-full mx-auto"
        />
        <h1 className="mt-2 text-center text-gray-800 text-sm font-medium">
          {user.fullName || user.username || user.firstName || 'User'}
        </h1>
        
        <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)} // This still closes the sidebar on nav item click
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors duration-200 ${
                  isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
        <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
          <img src={user.imageUrl} alt="" className='w-8 rounded-full'/>
          <div>
            <h1 className='text-sm font-medium'>{user.fullName || 'User'}</h1>
            <p className='text-xs text-gray-500'>
              <Protect plan='premium' fallback="Free">Premium </Protect>
              Plan
            </p>
          </div>
        </div>
        <LogOut onClick={() => signOut()} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'/>
      </div>
    </div>
  );
};

export default Sidebar;