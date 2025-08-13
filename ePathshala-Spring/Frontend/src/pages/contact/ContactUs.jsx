import React, { useState } from 'react';

function ContactUs() {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const handleSubmit = e => {
    e.preventDefault();
    alert('Feedback submitted!');
    setFeedback({ name: '', email: '', message: '' });
  };
  return (
    <div style={{ padding: 20 }}>
      <h2>Contact Us</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 300 }}>
          <b>Institute Address</b>
          <p>123 School Road, City, State</p>
          <p>Email: info@epathshala.edu</p>
          <p>Phone: +91-1234567890</p>
        </div>
        <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 300 }}>
          <b>Feedback</b>
          <form onSubmit={handleSubmit}>
            <input placeholder="Name" value={feedback.name} onChange={e => setFeedback({ ...feedback, name: e.target.value })} /><br />
            <input placeholder="Email" value={feedback.email} onChange={e => setFeedback({ ...feedback, email: e.target.value })} /><br />
            <textarea placeholder="Message" value={feedback.message} onChange={e => setFeedback({ ...feedback, message: e.target.value })} /><br />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 300 }}>
          <b>Find Us</b>
          <div style={{ width: '100%', height: 180, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Google Map Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;