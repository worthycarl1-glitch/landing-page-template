import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Logo + copyright */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="font-mono font-bold text-[10px] text-primary-foreground">SA</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              © {new Date().getFullYear()} Simple Appointments Inc.
            </span>
          </div>

          {/* Center: System status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
              All systems operational
            </span>
          </div>

          {/* Right: Legal links */}
          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[48px]"
            >
              <Shield className="w-3.5 h-3.5" /> Privacy
            </Link>
            <Link
              to="/terms"
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[48px]"
            >
              <FileText className="w-3.5 h-3.5" /> Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}