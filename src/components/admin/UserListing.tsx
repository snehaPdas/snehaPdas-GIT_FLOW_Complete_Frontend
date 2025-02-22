import React, { useEffect, useState } from 'react';
import adminAxiosInstance from '../../../axios/adminAxiosInstance';
import { User } from '../../types/user';

function UserListing() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminAxiosInstance.get('/api/admin/users');
        setUsers(response.data.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleBlockUnblock = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await adminAxiosInstance.patch(`/api/admin/${userId}/block-unblock`, { status: !currentStatus });
      if (response.status === 200 && response.data) {
        const updatedUserStatus = response.data.data;
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, isBlocked: updatedUserStatus } : user
          )
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error in block-unblock of user:', error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };
  const filteredUsers=users.filter(user=>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())

  )

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">User Management</h1>
          <div className='mb-4 flex justify-end'>
           <input 
           type='text'
           placeholder='search by name email'
           value={searchTerm}
           onChange={(e)=>setSearchTerm(e.target.value)}
           className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#572c52]"

            />
          </div>



      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-[#572c52] text-white">
            <th className="py-3 px-4 text-left uppercase">Name</th>
            <th className="py-3 px-4 text-left uppercase">Email</th>
            <th className="py-3 px-4 text-left uppercase">Phone</th>
            <th className="py-3 px-4 text-center uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentSessions.length > 0 ? (
            currentSessions.map(user => (
              <tr key={user._id} className="even:bg-gray-100 hover:bg-indigo-50 transition duration-200">
                <td className="py-3 px-4 border-b border-gray-200">{user.name}</td>
                <td className="py-3 px-4 border-b border-gray-200 truncate">{user.email}</td>
                <td className="py-3 px-4 border-b border-gray-200">{user.phone}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                  <button
                    onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                    className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition transform hover:scale-105 ${user.isBlocked ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-gray-600">Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}</span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastItem >= users.length}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserListing;
