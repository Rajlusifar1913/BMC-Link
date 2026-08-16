import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-nu-charcoal text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-nu-purple rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                BMC Link
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              The modern link-in-bio platform built for creators, designers, and builders worldwide.
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Product
            </h4>
            <a href="#showcase" className="text-xs text-gray-400 hover:text-white transition-colors">
              Showcase
            </a>
            <a href="#features" className="text-xs text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <Link to="/login" className="text-xs text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Security & Docs
            </h4>
            <a href="#safety" className="text-xs text-gray-400 hover:text-white transition-colors">
              Security Protocol
            </a>
            <a href="/api-docs" target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">
              Swagger API Docs
            </a>
            <span className="text-xs text-gray-400">Privacy Policy</span>
          </div>

          {/* Links Col 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-gray-800 hover:bg-nu-purple rounded-lg transition-colors text-gray-300 hover:text-white">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-nu-purple rounded-lg transition-colors text-gray-300 hover:text-white">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BMC Link. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>using React & Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
