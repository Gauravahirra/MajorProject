// import React, { useEffect, useState } from 'react';
// import api from '../api/axiosConfig';

// /**
//  * Shows basic profile information for the logged‑in user.  The
//  * endpoint queried depends on the user role stored in localStorage.
//  */
// const ProfilePage = () => {
//   const [profile, setProfile] = useState(null);
//   const role = localStorage.getItem('role');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!role) return;
//       try {
//         const response = await api.get(`/${role.toLowerCase()}/profile`);
//         setProfile(response.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProfile();
//   }, [role]);

//   if (!role) {
//     return <p>Please log in to view your profile.</p>;
//   }
//   if (!profile) {
//     return <p>Loading profile…</p>;
//   }
//   // return (
//   //   <div className="card shadow-sm">
//   //     <div className="card-body">
//   //       <h3 className="card-title">Profile</h3>
//   //       <ul className="list-group list-group-flush">
//   //         {Object.keys(profile).map((key) => (
//   //           <li className="list-group-item" key={key}>
//   //             <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {Array.isArray(profile[key]) ? profile[key].join(', ') : profile[key]}
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     </div>
//   //   </div>
//   // );

//   return (
//   <section className="page-screen">
//     <div className="container py-4">
//       <div className="row justify-content-center">
//         <div className="col-12">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h3 className="card-title">Profile</h3>
//               <ul className="list-group list-group-flush">
//                 {Object.keys(profile).map((key) => (
//                   <li className="list-group-item" key={key}>
//                     <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
//                     {Array.isArray(profile[key]) ? profile[key].join(', ') : String(profile[key])}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </section>
// );

// };

// export default ProfilePage;

import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!role) return;
      try {
        const response = await api.get(`/${role.toLowerCase()}/profile`);
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [role]);

  if (!role) {
    return <p>Please log in to view your profile.</p>;
  }
  if (!profile) {
    return <p>Loading profile…</p>;
  }

  return (
    <div 
      className="d-flex flex-column" 
      style={{ minHeight: 'calc(100vh - 160px)' }} // adjust for navbar + footer height
    >
      <div className="container mt-4 flex-grow-1">
        <div className="card shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-body">
            <h3 className="card-title">Profile</h3>
            <ul className="list-group list-group-flush">
              {Object.keys(profile).map((key) => (
                <li className="list-group-item" key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
                  {Array.isArray(profile[key]) ? profile[key].join(', ') : profile[key]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
