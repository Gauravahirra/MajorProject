// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosConfig';

// /**
//  * Dashboard for administrators.  Provides forms to create users
//  * (students, teachers, parents), lists existing users, assigns
//  * teachers to subjects and manages academic events.
//  */
// const AdminDashboard = () => {
//   const [users, setUsers] = useState({ students: [], teachers: [], parents: [] });
//   const [role, setRole] = useState('Student');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [className, setClassName] = useState('');
//   const [subject, setSubject] = useState('');
//   const [parentId, setParentId] = useState('');
//   const [message, setMessage] = useState('');
//   const [eventTitle, setEventTitle] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const [eventDescription, setEventDescription] = useState('');
//   const [teachers, setTeachers] = useState([]);
//   const [assignTeacherId, setAssignTeacherId] = useState('');
//   const [assignSubject, setAssignSubject] = useState('');

//   // state for assigning a teacher when creating a student
//   const [studentTeacherId, setStudentTeacherId] = useState('');

//   // state for deleting a user
//   const [deleteUserId, setDeleteUserId] = useState('');

//   // state for updating a user
//   const [updateUserId, setUpdateUserId] = useState('');
//   const [updateName, setUpdateName] = useState('');
//   const [updateEmail, setUpdateEmail] = useState('');
//   const [updateClass, setUpdateClass] = useState('');
//   const [updateSubject, setUpdateSubject] = useState('');
//   const [updateParentId, setUpdateParentId] = useState('');
//   const [updateTeacherId, setUpdateTeacherId] = useState('');

//   const loadUsers = async () => {
//     try {
//       const [studentsRes, teachersRes, parentsRes] = await Promise.all([
//         api.get('/admin/students'),
//         api.get('/admin/teachers'),
//         api.get('/admin/parents')
//       ]);
//       setUsers({
//         students: studentsRes.data,
//         teachers: teachersRes.data,
//         parents: parentsRes.data
//       });
//       setTeachers(teachersRes.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     try {
//       await api.post('/admin/users', {
//         name,
//         email,
//         password,
//         role,
//         class: className || undefined,
//         subject: subject || undefined,
//         parentId: parentId ? parseInt(parentId) : undefined,
//         teacherId: role === 'Student' && studentTeacherId ? parseInt(studentTeacherId) : undefined
//       });
//       setName('');
//       setEmail('');
//       setPassword('');
//       setClassName('');
//       setSubject('');
//       setParentId('');
//       setStudentTeacherId('');
//       setMessage('User created successfully.');
//       loadUsers();
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Error creating user';
//       setMessage(msg);
//     }
//   };

//   const handleCreateEvent = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/admin/events', {
//         title: eventTitle,
//         date: eventDate,
//         description: eventDescription
//       });
//       setEventTitle('');
//       setEventDate('');
//       setEventDescription('');
//       setMessage('Event created successfully.');
//     } catch (err) {
//       setMessage('Error creating event');
//     }
//   };

//   const handleAssignTeacher = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post(`/admin/assign-teacher?teacherId=${assignTeacherId}&subject=${encodeURIComponent(assignSubject)}`);
//       setAssignTeacherId('');
//       setAssignSubject('');
//       setMessage('Teacher assigned successfully.');
//       loadUsers();
//     } catch (err) {
//       setMessage('Error assigning teacher');
//     }
//   };

//   const handleDeleteUser = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     if (!deleteUserId) return;
//     try {
//       await api.delete(`/admin/users/${deleteUserId}`);
//       setDeleteUserId('');
//       setMessage('User deleted successfully.');
//       loadUsers();
//     } catch (err) {
//       setMessage('Error deleting user');
//     }
//   };

//   const handleUpdateUser = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     if (!updateUserId) return;
//     try {
//       await api.put(`/admin/users/${updateUserId}`, {
//         name: updateName || undefined,
//         email: updateEmail || undefined,
//         class: updateClass || undefined,
//         subject: updateSubject || undefined,
//         parentId: updateParentId ? parseInt(updateParentId) : undefined,
//         teacherId: updateTeacherId ? parseInt(updateTeacherId) : undefined
//       });
//       setUpdateUserId('');
//       setUpdateName('');
//       setUpdateEmail('');
//       setUpdateClass('');
//       setUpdateSubject('');
//       setUpdateParentId('');
//       setUpdateTeacherId('');
//       setMessage('User updated successfully.');
//       loadUsers();
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Error updating user';
//       setMessage(msg);
//     }
//   };

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       {message && <div className="alert alert-info">{message}</div>}
//       <div className="row g-4">
//         {/* Create User Form */}
//         <div className="col-md-6">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Add User</h5>
//               <form onSubmit={handleCreateUser}>
//                 <div className="mb-2">
//                   <label className="form-label">Role</label>
//                   <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
//                     <option value="Student">Student</option>
//                     <option value="Teacher">Teacher</option>
//                     <option value="Parent">Parent</option>
//                   </select>
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Name</label>
//                   <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Email</label>
//                   <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Password</label>
//                   <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                 </div>
//                 {role === 'Student' && (
//                   <>
//                     <div className="mb-2">
//                       <label className="form-label">Class</label>
//                       <input className="form-control" value={className} onChange={(e) => setClassName(e.target.value)} required />
//                     </div>
//                     <div className="mb-2">
//                       <label className="form-label">Parent ID (optional)</label>
//                       <input type="number" className="form-control" value={parentId} onChange={(e) => setParentId(e.target.value)} />
//                     </div>
//                     <div className="mb-2">
//                       <label className="form-label">Assign Teacher (optional)</label>
//                       <select className="form-select" value={studentTeacherId} onChange={(e) => setStudentTeacherId(e.target.value)}>
//                         <option value="">--Select Teacher--</option>
//                         {teachers.map((t) => (
//                           <option key={t.id} value={t.id}>{t.name} (ID:{t.id})</option>
//                         ))}
//                       </select>
//                     </div>
//                   </>
//                 )}
//                 {role === 'Teacher' && (
//                   <div className="mb-2">
//                     <label className="form-label">Subject</label>
//                     <input className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} required />
//                   </div>
//                 )}
//                 <button type="submit" className="btn btn-primary mt-2">Add {role}</button>
//               </form>
//             </div>
//           </div>
//         </div>
//         {/* Assign Teacher */}
//         <div className="col-md-6">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Assign Teacher</h5>
//               <form onSubmit={handleAssignTeacher}>
//                 <div className="mb-2">
//                   <label className="form-label">Teacher</label>
//                   <select className="form-select" value={assignTeacherId} onChange={(e) => setAssignTeacherId(e.target.value)} required>
//                     <option value="">--Select--</option>
//                     {teachers.map((t) => (
//                       <option key={t.id} value={t.id}>{t.name} (ID:{t.id})</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Subject</label>
//                   <input className="form-control" value={assignSubject} onChange={(e) => setAssignSubject(e.target.value)} required />
//                 </div>
//                 <button type="submit" className="btn btn-primary mt-2">Assign</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="row g-4 mt-4">
//         {/* Academic Event Form */}
//         <div className="col-md-6">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Create Academic Event</h5>
//               <form onSubmit={handleCreateEvent}>
//                 <div className="mb-2">
//                   <label className="form-label">Title</label>
//                   <input className="form-control" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Date</label>
//                   <input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Description</label>
//                   <textarea className="form-control" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} rows="3"></textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary mt-2">Add Event</button>
//               </form>
//             </div>
//           </div>
//         </div>
//         {/* Lists */}
//         <div className="col-md-6">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Users Summary</h5>
//               <p><strong>Students:</strong> {users.students.length}</p>
//               <p><strong>Teachers:</strong> {users.teachers.length}</p>
//               <p><strong>Parents:</strong> {users.parents.length}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Detailed Lists */}
//       <div className="row g-4 mt-4">
//         <div className="col-md-4">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Students</h5>
//               <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                 {users.students.map((s) => {
//                   // Find assigned teacher name if available
//                   const teacher = teachers.find((t) => t.id === s.teacherId);
//                   const teacherLabel = teacher ? `Teacher: ${teacher.name}` : s.teacherId ? `Teacher ID: ${s.teacherId}` : 'No teacher';
//                   return (
//                     <li key={s.id} className="list-group-item">
//                       {s.id}. {s.name} ({s.class}) — {teacherLabel}
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Teachers</h5>
//               <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                 {users.teachers.map((t) => (
//                   <li key={t.id} className="list-group-item">
//                     {t.id}. {t.name} ({t.subject || 'N/A'})
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Parents</h5>
//               <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                 {users.parents.map((p) => (
//                   <li key={p.id} className="list-group-item">
//                     {p.id}. {p.name}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete and Update Users */}
//       <div className="row g-4 mt-4">
//         <div className="col-md-6">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Delete User</h5>
//               <form onSubmit={handleDeleteUser}>
//                 <div className="mb-2">
//                   <label className="form-label">User ID</label>
//                   <input type="number" className="form-control" value={deleteUserId} onChange={(e) => setDeleteUserId(e.target.value)} required />
//                 </div>
//                 <button type="submit" className="btn btn-danger mt-2">Delete</button>
//               </form>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-6">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Update User</h5>
//               <form onSubmit={handleUpdateUser}>
//                 <div className="mb-2">
//                   <label className="form-label">User ID</label>
//                   <input type="number" className="form-control" value={updateUserId} onChange={(e) => setUpdateUserId(e.target.value)} required />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Name</label>
//                   <input className="form-control" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Email</label>
//                   <input type="email" className="form-control" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Class (for Students)</label>
//                   <input className="form-control" value={updateClass} onChange={(e) => setUpdateClass(e.target.value)} />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Subject (for Teachers)</label>
//                   <input className="form-control" value={updateSubject} onChange={(e) => setUpdateSubject(e.target.value)} />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Parent ID (for Students)</label>
//                   <input type="number" className="form-control" value={updateParentId} onChange={(e) => setUpdateParentId(e.target.value)} />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">Teacher ID (for Students)</label>
//                   <input type="number" className="form-control" value={updateTeacherId} onChange={(e) => setUpdateTeacherId(e.target.value)} />
//                 </div>
//                 <button type="submit" className="btn btn-primary mt-2">Update</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



//trial 2
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const MENU = [
  { key: 'createUser', label: 'Add User' },
  { key: 'assignTeacher', label: 'Assign Teacher' },
  { key: 'event', label: 'Create Event' },
  { key: 'summary', label: 'Users Summary' },
  { key: 'lists', label: 'Detailed Lists' },
  { key: 'delete', label: 'Delete User' },
  { key: 'update', label: 'Update User' },
];

const AdminDashboard = () => {
  // state (unchanged)
  const [users, setUsers] = useState({ students: [], teachers: [], parents: [] });
  const [role, setRole] = useState('Student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [parentId, setParentId] = useState('');
  const [message, setMessage] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [assignTeacherId, setAssignTeacherId] = useState('');
  const [assignSubject, setAssignSubject] = useState('');
  const [studentTeacherId, setStudentTeacherId] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');
  const [updateUserId, setUpdateUserId] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updateClass, setUpdateClass] = useState('');
  const [updateSubject, setUpdateSubject] = useState('');
  const [updateParentId, setUpdateParentId] = useState('');
  const [updateTeacherId, setUpdateTeacherId] = useState('');
  const [active, setActive] = useState('createUser');

  const loadUsers = async () => {
    try {
      const [studentsRes, teachersRes, parentsRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/teachers'),
        api.get('/admin/parents')
      ]);
      setUsers({ students: studentsRes.data, teachers: teachersRes.data, parents: parentsRes.data });
      setTeachers(teachersRes.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { loadUsers(); }, []);

  // handlers (unchanged)
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/admin/users', {
        name, email, password, role,
        class: className || undefined,
        subject: subject || undefined,
        parentId: parentId ? parseInt(parentId) : undefined,
        teacherId: role === 'Student' && studentTeacherId ? parseInt(studentTeacherId) : undefined
      });
      setName(''); setEmail(''); setPassword('');
      setClassName(''); setSubject(''); setParentId(''); setStudentTeacherId('');
      setMessage('User created successfully.');
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating user';
      setMessage(msg);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/events', { title: eventTitle, date: eventDate, description: eventDescription });
      setEventTitle(''); setEventDate(''); setEventDescription('');
      setMessage('Event created successfully.');
    } catch { setMessage('Error creating event'); }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/assign-teacher?teacherId=${assignTeacherId}&subject=${encodeURIComponent(assignSubject)}`);
      setAssignTeacherId(''); setAssignSubject('');
      setMessage('Teacher assigned successfully.');
      loadUsers();
    } catch { setMessage('Error assigning teacher'); }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!deleteUserId) return;
    try {
      await api.delete(`/admin/users/${deleteUserId}`);
      setDeleteUserId('');
      setMessage('User deleted successfully.');
      loadUsers();
    } catch { setMessage('Error deleting user'); }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!updateUserId) return;
    try {
      await api.put(`/admin/users/${updateUserId}`, {
        name: updateName || undefined,
        email: updateEmail || undefined,
        class: updateClass || undefined,
        subject: updateSubject || undefined,
        parentId: updateParentId ? parseInt(updateParentId) : undefined,
        teacherId: updateTeacherId ? parseInt(updateTeacherId) : undefined
      });
      setUpdateUserId(''); setUpdateName(''); setUpdateEmail('');
      setUpdateClass(''); setUpdateSubject(''); setUpdateParentId(''); setUpdateTeacherId('');
      setMessage('User updated successfully.');
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating user';
      setMessage(msg);
    }
  };

  // focus-safe: inline JSX, not nested components
  const renderActive = () => {
    switch (active) {
      case 'createUser':
        return (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Add User</h5>
              <form onSubmit={handleCreateUser} className="d-grid gap-2">
                <div>
                  <label className="form-label">Role</label>
                  <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Parent">Parent</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Name</label>
                  <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {role === 'Student' && (
                  <>
                    <div>
                      <label className="form-label">Class</label>
                      <input className="form-control" value={className} onChange={(e) => setClassName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="form-label">Parent ID (optional)</label>
                      <input type="number" className="form-control" value={parentId} onChange={(e) => setParentId(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Assign Teacher (optional)</label>
                      <select className="form-select" value={studentTeacherId} onChange={(e) => setStudentTeacherId(e.target.value)}>
                        <option value="">--Select Teacher--</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} (ID:{t.id})</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {role === 'Teacher' && (
                  <div>
                    <label className="form-label">Subject</label>
                    <input className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                  </div>
                )}

                <button type="submit" className="btn btn-primary mt-1">Add {role}</button>
              </form>
            </div>
          </div>
        );

      case 'assignTeacher':
        return (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Assign Teacher</h5>
              <form onSubmit={handleAssignTeacher} className="d-grid gap-2">
                <div>
                  <label className="form-label">Teacher</label>
                  <select className="form-select" value={assignTeacherId} onChange={(e) => setAssignTeacherId(e.target.value)} required>
                    <option value="">--Select--</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} (ID:{t.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <input className="form-control" value={assignSubject} onChange={(e) => setAssignSubject(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary mt-1">Assign</button>
              </form>
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Create Academic Event</h5>
              <form onSubmit={handleCreateEvent} className="d-grid gap-2">
                <div>
                  <label className="form-label">Title</label>
                  <input className="form-control" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary mt-1">Add Event</button>
              </form>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Users Summary</h5>
              <p><strong>Students:</strong> {users.students.length}</p>
              <p><strong>Teachers:</strong> {users.teachers.length}</p>
              <p><strong>Parents:</strong> {users.parents.length}</p>
            </div>
          </div>
        );

      case 'lists':
        return (
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">Students</h5>
                  <ul className="list-group list-group-flush" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                    {users.students.map((s) => {
                      const teacher = teachers.find((t) => t.id === s.teacherId);
                      const teacherLabel = teacher ? `Teacher: ${teacher.name}` : s.teacherId ? `Teacher ID: ${s.teacherId}` : 'No teacher';
                      return (
                        <li key={s.id} className="list-group-item">
                          {s.id}. {s.name} ({s.class}) — {teacherLabel}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">Teachers</h5>
                  <ul className="list-group list-group-flush" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                    {users.teachers.map((t) => (
                      <li key={t.id} className="list-group-item">
                        {t.id}. {t.name} ({t.subject || 'N/A'})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">Parents</h5>
                  <ul className="list-group list-group-flush" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                    {users.parents.map((p) => (
                      <li key={p.id} className="list-group-item">
                        {p.id}. {p.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Delete User</h5>
              <form onSubmit={handleDeleteUser} className="d-grid gap-2">
                <div>
                  <label className="form-label">User ID</label>
                  <input type="number" className="form-control" value={deleteUserId} onChange={(e) => setDeleteUserId(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-danger mt-1">Delete</button>
              </form>
            </div>
          </div>
        );

      case 'update':
        return (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Update User</h5>
              <form onSubmit={handleUpdateUser} className="d-grid gap-2">
                <div>
                  <label className="form-label">User ID</label>
                  <input type="number" className="form-control" value={updateUserId} onChange={(e) => setUpdateUserId(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Name</label>
                  <input className="form-control" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Class (for Students)</label>
                  <input className="form-control" value={updateClass} onChange={(e) => setUpdateClass(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Subject (for Teachers)</label>
                  <input className="form-control" value={updateSubject} onChange={(e) => setUpdateSubject(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Parent ID (for Students)</label>
                  <input type="number" className="form-control" value={updateParentId} onChange={(e) => setUpdateParentId(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Teacher ID (for Students)</label>
                  <input type="number" className="form-control" value={updateTeacherId} onChange={(e) => setUpdateTeacherId(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary mt-1">Update</button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-grid">
      <aside className="admin-grid__sidebar">
        <div className="p-3">
          <div className="h5 mb-3 text-white">Admin</div>
          <nav className="nav flex-column">
            {MENU.map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(item.key)}
                className={`nav-link text-start admin-sidelink ${active === item.key ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="admin-grid__content">
        <div className="py-4 px-3 px-md-4">
          <h1 className="h3 text-primary mb-1">Admin Dashboard</h1>
          <p className="text-secondary mb-3">Choose a section from the left menu.</p>
          {message && <div className="alert alert-info">{message}</div>}
          {renderActive()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;



