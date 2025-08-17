// import React, { useEffect, useState } from 'react';
// import api from '../api/axiosConfig';

// const NotificationsPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const loadNotifications = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/notification');
//       setNotifications(res.data);
//     } catch {
//       setError('Failed to load notifications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   const markAsRead = async (id) => {
//     try {
//       await api.put(`/notification/${id}/read`);
//       loadNotifications();
//     } catch {}
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Notifications</h2>
//       {loading ? (
//         <div>Loading notifications...</div>
//       ) : error ? (
//         <div className="alert alert-danger">{error}</div>
//       ) : notifications.length === 0 ? (
//         <div className="alert alert-info">No notifications.</div>
//       ) : (
//         <ul className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//           {notifications.map((n) => (
//             <li key={n.id} className={`list-group-item d-flex justify-content-between align-items-start${n.isRead ? '' : ' fw-bold'}`}>
//               <div>
//                 <div>{n.title}</div>
//                 <div className="small text-muted">{n.message}</div>
//                 <div className="small text-secondary">{new Date(n.createdAt).toLocaleString()}</div>
//               </div>
//               {!n.isRead && (
//                 <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => markAsRead(n.id)}>
//                   Mark as read
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default NotificationsPage;


import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notification');
      setNotifications(res.data);
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notification/${id}/read`);
      loadNotifications();
    } catch {}
  };

  return (
    <div 
      className="d-flex flex-column" 
      style={{ minHeight: 'calc(100vh - 130px)' }} // navbar + footer height approx
    >
      <div className="container mt-4 flex-grow-1">
        <h2>Notifications</h2>
        {loading ? (
          <div>Loading notifications...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="alert alert-info">No notifications.</div>
        ) : (
          <ul 
            className="list-group list-group-flush" 
            style={{ maxHeight: '400px', overflowY: 'auto' }}
          >
            {notifications.map((n) => (
              <li 
                key={n.id} 
                className={`list-group-item d-flex justify-content-between align-items-start${n.isRead ? '' : ' fw-bold'}`}
              >
                <div>
                  <div>{n.title}</div>
                  <div className="small text-muted">{n.message}</div>
                  <div className="small text-secondary">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.isRead && (
                  <button 
                    className="btn btn-sm btn-outline-primary ms-2" 
                    onClick={() => markAsRead(n.id)}
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
