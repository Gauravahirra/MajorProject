// // import React, { useState, useContext } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import api from '../api/axiosConfig';
// // import { AuthContext } from '../contexts/AuthContext';

// // /**
// //  * Login page for all roles.  Wrapped in a card for a clean look.
// //  */
// // const LoginPage = () => {
// //   const navigate = useNavigate();
// //   const { login } = useContext(AuthContext);
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [role, setRole] = useState('');
// //   const [error, setError] = useState('');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     try {
// //       const response = await api.post('/auth/login', { email, password, role });
// //       const { token, name } = response.data;
// //       login(token, role, name);
// //       navigate(`/${role.toLowerCase()}`);
// //     } catch (err) {
// //       const msg = err.response?.data?.message || 'Login failed';
// //       setError(msg);
// //     }
// //   };

// //   return (
// //     <div className="row justify-content-center">
// //       <div className="col-md-6">
// //         <div className="card shadow-sm">
// //           <div className="card-body p-4">
// //             <h2 className="text-center mb-4">ERP Login</h2>
// //             {error && <div className="alert alert-danger">{error}</div>}
// //             <form onSubmit={handleSubmit}>
// //               <div className="mb-3">
// //                 <label className="form-label">Email</label>
// //                 <input
// //                   type="email"
// //                   className="form-control"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   required
// //                 />
// //               </div>
// //               <div className="mb-3">
// //                 <label className="form-label">Password</label>
// //                 <input
// //                   type="password"
// //                   className="form-control"
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   required
// //                 />
// //               </div>
// //               <div className="mb-3">
// //                 <label className="form-label">Role</label>
// //                 <select
// //                   className="form-select"
// //                   value={role}
// //                   onChange={(e) => setRole(e.target.value)}
// //                   required
// //                 >
// //                   <option value="" disabled>Select role</option>
// //                   <option value="Admin">Admin</option>
// //                   <option value="Teacher">Teacher</option>
// //                   <option value="Student">Student</option>
// //                   <option value="Parent">Parent</option>
// //                 </select>
// //               </div>
// //               <button type="submit" className="btn btn-primary w-100">Login</button>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginPage;


// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axiosConfig';
// import { AuthContext } from '../contexts/AuthContext';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const res = await api.post('/auth/login', { email, password, role });
//       const { token, name } = res.data;
//       login(token, role, name);
//       navigate(`/${role.toLowerCase()}`);
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Login failed';
//       setError(msg);
//     }
//   };

//   return (
//     <div className="container" style={{ maxWidth: 520 }}>
//       <div className="card shadow-sm mt-5">
//         <div className="card-body p-4">
//           <h1 className="h4 text-center mb-4">ERP Login</h1>

//           {error && <div className="alert alert-danger">{error}</div>}

//           <form className="d-grid gap-3" onSubmit={handleSubmit}>
//             <div>
//               <label className="form-label">Email</label>
//               <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
//             </div>
//             <div>
//               <label className="form-label">Password</label>
//               <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
//             </div>
//             <div>
//               <label className="form-label">Role</label>
//               <select className="form-select" value={role} onChange={e=>setRole(e.target.value)} required>
//                 <option value="">Select role</option>
//                 <option value="Admin">Admin</option>
//                 <option value="Teacher">Teacher</option>
//                 <option value="Student">Student</option>
//                 <option value="Parent">Parent</option>
//               </select>
//             </div>
//             <button className="btn btn-primary w-100" type="submit">Sign in</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password, role });
      const { token, name } = res.data;
      login(token, role, name);
      navigate(`/${role.toLowerCase()}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
    }
  };

  return (
    <section className="login-wrap">
      <div className="container mt-2">
        <div className="row justify-content-center">
          <div className="col-12" style={{ maxWidth: 520 }}>
            <div className="card shadow-sm login-card">
              <div className="card-body p-4">
                <h1 className="h4 text-center mb-3 login-title">ePathshala — Sign in</h1>
                <p className="text-center text-muted mb-4">Access your dashboard</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form className="d-grid gap-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="Admin">Admin</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </div>

                  <button className="btn btn-brand w-100" type="submit">Sign in</button>
                </form>
              </div>
            </div>

            <div className="text-center mt-3 small">
              <a href="/contact" className="text-decoration-none">Need help?</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
