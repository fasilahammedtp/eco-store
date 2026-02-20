import { useEffect } from "react";
import "./Contact.css";

function Contact() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page">
      <h1>Contact Us 📩</h1>

      <form className="contact-form">
        <input placeholder="Your Name" />
        <input placeholder="Your Email" />
        <textarea placeholder="Your Message"></textarea>
        <button>Send Message</button>
      </form>
    </div>
  );
}

export default Contact;
