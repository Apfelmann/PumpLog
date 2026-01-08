import React, { useState, useEffect } from 'react';

// BAD: Any type
export const UserList = (props: any) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // BAD: Secret exposed in code
  const API_KEY = "sk_prod_1234567890abcdef1234567890abcdef";

  // BAD: useEffect missing dependency array (infinite loop risk)
  useEffect(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    setLoading(true);
    // BAD: No error handling
    const response = await fetch(`https://api.example.com/users?key=${API_KEY}`);
    const data = await response.json();
    setUsers(data);
    setLoading(false);
  }

  // BAD: Inline arrow function in render (performance)
  // BAD: Using index as key
  return (
    <div className="user-list">
      <h1>Users List</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {users.map((user: any, index) => (
            <li key={index} onClick={() => console.log('Clicked user', user)}>
              {user.name} - {user.email}
              {/* BAD: Inline style */}
              <button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => {
                // BAD: Direct DOM manipulation
                document.getElementById('modal').style.display = 'block';
              }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* BAD: Dangerous inner HTML */}
      <div dangerouslySetInnerHTML={{ __html: props.customHtml }} />
    </div>
  );
};
