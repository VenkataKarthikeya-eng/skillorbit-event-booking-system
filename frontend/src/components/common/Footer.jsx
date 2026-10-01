import React from 'react';
import { Calendar, Heart, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-xl">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span>
                SkillOrbit <span className="text-indigo-400">Events</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              An end-to-end event discovery, registration, and booking management platform built as a Web Development Capstone Project.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>JWT Authentication</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Real-time Seats</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              Project Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Module 1: User Authentication</li>
              <li>Module 2: Event Management</li>
              <li>Module 3: Ticket Booking</li>
              <li>Module 4: Dashboard & Analytics</li>
              <li>Module 5: Notification & Reports</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SkillOrbit Event Booking System. Capstone Project.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1" />
            <span>using React, Node.js, Express & MongoDB Atlas</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
