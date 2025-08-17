// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="container mt-5">
//       <div className="text-center mb-5">
//         <h1 className="display-4 fw-bold">Welcome to Student ERP</h1>
//         <p className="lead">A modern platform for online exams, assignments, attendance, and more—built for schools and colleges.</p>
//         <button className="btn btn-primary btn-lg mt-3" onClick={() => navigate('/login')}>Login</button>
//       </div>
//       <div className="row g-4 justify-content-center">
//         <div className="col-md-4">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body text-center">
//               <h5 className="card-title">Online MCQ Exams</h5>
//               <p className="card-text">Take secure, time-bound online exams with instant results and auto-submission.</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body text-center">
//               <h5 className="card-title">Assignments & Attendance</h5>
//               <p className="card-text">Submit assignments, track attendance, and stay updated with academic events.</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="card h-100 shadow-sm">
//             <div className="card-body text-center">
//               <h5 className="card-title">Notifications & Results</h5>
//               <p className="card-text">Get real-time notifications and view your results and progress anytime.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="text-center mt-5">
//         <h4>Empowering Teachers, Students, and Parents</h4>
//         <p className="text-muted">Seamless, secure, and user-friendly ERP for the next generation of education.</p>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      {/* HERO */}
      <section className="row align-items-center g-4 mb-5">
        <div className="col-12 col-lg-7">
          <p className="fw-semibold small text-primary mb-1">ePathshala</p>
          <h1 className="display-6 fw-bold text-primary">Student ERP for Modern Institutions</h1>
          <p className="lead text-body-secondary">
            Manage <strong>exams</strong>, <strong>results</strong>, <strong>attendance</strong>, <strong>fees</strong>, and more —
            for students, teachers, parents, and admins.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary btn-lg home-login" onClick={() => navigate('/login')}>Login</button>
            {/* <Link className="btn btn-outline-primary btn-lg" to="/about">Learn more</Link> */}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm p-4 h-100">
            <h2 className="h5 mb-3 text-primary">Why ePathshala?</h2>
            <ul className="mb-3 text-body-secondary">
              <li>Clean, professional UI (React + Bootstrap).</li>
              <li>Secure role-based access for all stakeholders.</li>
              <li>Works with your existing APIs — no changes needed.</li>
            </ul>
            <div className="d-flex gap-2">
              <a className="link-primary" href="#modules">Explore modules</a>
              {/* <span className="text-body-tertiary">•</span>
              <a className="link-primary" href="#updates">Latest updates</a> */}
            </div>
          </div>
        </div>
      </section>

      {/* HORIZONTAL SCROLL MODULE RAIL */}
      {/* <section className="mb-5">
        <h2 className="h5 mb-3 text-primary">Key Modules</h2>
        <div className="h-scroll pb-2">
          {[
            { title: 'Exams', text: 'Create, schedule, publish.' },
            { title: 'Results', text: 'View scores and summaries.' },
            { title: 'Library', text: 'Catalog, issue & returns.' },
            { title: 'Announcements', text: 'Notify students & staff.' },
          ].map(m => (
            <div className="tile card shadow-sm p-3 me-3" key={m.title}>
              <div className="h6 mb-1 text-primary">{m.title}</div>
              <div className="text-body-secondary small">{m.text}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* LARGE MODULE GRID (bigger blocks, no “Open” buttons, no “Module” badge) */}
      <section id="modules" className="mb-5">
        <h2 className="h5 mb-3 text-primary">All ePathshala Modules</h2>
        <div className="row g-4">
          {[
            { title: 'Exams', desc: 'Teachers create and publish exams; students take them.' },
            { title: 'Results', desc: 'Students and teachers can review scores and breakdowns.' },
            { title: 'Attendance', desc: 'Track presence by class and date.' },
            { title: 'Leave application', desc: 'send written application specifyng dates and get approvals from teacher and parent.' },
            { title: 'Notifications', desc: 'Get all notifications for exam schedule' },
            { title: 'Announcements', desc: 'Broadcast updates/events across roles.' },
          ].map(card => (
            <div className="col-12 col-md-6 col-lg-4" key={card.title}>
              <div className="card card-xl shadow-sm p-4 h-100">
                <h3 className="h6 mb-2 text-primary">{card.title}</h3>
                <p className="text-body-secondary mb-0">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST UPDATES / ANNOUNCEMENTS */}
      {/* <section id="updates" className="mb-5">
        <h2 className="h5 mb-3 text-primary">Latest Announcements</h2>
        <div className="card shadow-sm">
          <ul className="list-group list-group-flush">
            {[
              { t: 'Exam UI refresh', s: 'Improved layout and readability for taking exams.' },
              { t: 'Dashboard layout', s: 'Left-side sections with cleaner content areas.' },
              { t: 'Performance tweaks', s: 'Faster navigation and loading states.' },
            ].map((u, i) => (
              <li className="list-group-item" key={i}>
                <div className="fw-semibold">{u.t}</div>
                <div className="text-body-secondary small">{u.s}</div>
              </li>
            ))}
          </ul>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;
