// import React from 'react';

// /**
//  * About page describing the Student ERP system.  Five cards
//  * summarise the features and a sixth card introduces the team.
//  */
// const AboutPage = () => {
//   const cards = [
//     {
//       title: 'Centralised Management',
//       text: 'Manage all academic and administrative tasks from a single portal.'
//     },
//     {
//       title: 'Role‑Based Dashboards',
//       text: 'Custom dashboards for admins, teachers, students and parents.'
//     },
//     {
//       title: 'Attendance & Grades',
//       text: 'Track attendance and grades in real time with intuitive reports.'
//     },
//     {
//       title: 'Leave Workflow',
//       text: 'Submit and approve leave requests with multi‑level authorisation.'
//     },
//     {
//       title: 'Academic Calendar',
//       text: 'Stay informed about exams, holidays and events via the integrated calendar.'
//     },
//     {
//       title: 'Know Our Team',
//       text: 'Meet the developers behind the system: Rahul, Priya and Sameer.'
//     }
//   ];
//   return (
//     <div>
//       <h2 className="text-center mb-4">About the Student ERP System</h2>
//       <div className="row row-cols-1 row-cols-md-2 g-4">
//         {cards.map((card, idx) => (
//           <div className="col" key={idx}>
//             <div className="card h-100 shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title">{card.title}</h5>
//                 <p className="card-text">{card.text}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AboutPage;


import React from 'react';

const teamMembers = [
  { name: 'Rahul Sharma', role: 'Project Lead ', img: '/saket.jpeg' },
  { name: 'Priya Verma', role: 'Project Maneger', img: '/ravi.jpeg' },
  { name: 'Anushree Upadhye', role: 'Backend Developer', img: '/anushree.jpeg' },
  { name: 'Anjali Mehta', role: 'Frontend Developer', img: '/gaurav.jpeg' },
  { name: 'Rohit Singh', role: 'Frontend Developer', img: '/satyajit.jpeg' }
];

const AboutPage = () => {
  return (
    <div className="container py-5 page-content">
      <h2 className="text-center mb-4">About the Student ERP System</h2>
      <p className="text-center mb-5">
        ePathshala is a comprehensive Student ERP platform designed to streamline academic and administrative operations. 
        Our goal is to create a user-friendly, efficient, and professional system that benefits administrators, teachers, students, and parents alike.
      </p>

      <h3 className="text-center mb-4">Meet Our Team</h3>
      <div className="row justify-content-center g-4">
        {teamMembers.map((member, idx) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={idx}>
            <div className="card text-center h-100 shadow-sm border-0">
              <img
                src={member.img}
                alt={member.name}
                className="rounded-circle mx-auto mt-4"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{member.name}</h5>
                <p className="text-muted mb-0">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
