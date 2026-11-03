import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-slate-950 py-14 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-2xl font-black">dexolt<span className="text-emerald-400">.</span></h3>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Thoughtful cleaning essentials for a fresher, happier everyday.</p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Explore</h4>
          <ul className="space-y-2">
            <li><Link to="/products" className="text-slate-400 hover:text-white">Products</Link></li>
            <li><Link to="/about" className="text-slate-400 hover:text-white">About</Link></li>
            <li><Link to="/contact" className="text-slate-400 hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li><Link to="/orders" className="hover:text-brand-blue">My Orders</Link></li>
            <li><Link to="/profile" className="hover:text-brand-blue">Profile</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <div className="space-y-2">
            <a href="tel:+919876543210" className="block text-slate-400 hover:text-white"><FaPhone className="mr-2 inline" /> +91 98765 43210</a>
            <a href="mailto:info@dexolt.com" className="block text-slate-400 hover:text-white"><FaEnvelope className="mr-2 inline" /> info@dexolt.com</a>
            <a
              href="https://wa.me/919876543210?text=Hello%20Dexolt%2C%20I%20need%20help%20with%20your%20products."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-slate-400 hover:text-green-400"
            >
              <FaWhatsapp className="mr-2 text-green-400" /> WhatsApp us
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Dexolt Enterprises. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer