import React, { useState } from 'react';

/**
 * Contact page containing institute details, a feedback form and a
 * Google Maps embed.  The feedback form does not submit data in
 * this skeleton.
 */
const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application you would send this to the backend
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div>
      <h2 className="text-center mb-4">Contact Us</h2>
      <div className="row g-4">
        {/* Institute Address */}
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Institute Address</h5>
              <p className="card-text">
                ABC International School<br />
                123 Learning Lane<br />
                Nashik, Maharashtra, India<br />
                Phone: +91 98765 43210
              </p>
            </div>
          </div>
        </div>
        {/* Feedback Form */}
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Feedback Form</h5>
              {submitted && <div className="alert alert-success">Thank you for your feedback!</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
        {/* Google Map */}
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Find Us</h5>
              <div style={{ width: '100%', height: '200px' }}>
                {/* Placeholder map embed.  Replace src with your map embed URL. */}
                <iframe
                  title="Map"
                  src="https://maps.google.com/maps?q=Nashik,%20Maharashtra&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;