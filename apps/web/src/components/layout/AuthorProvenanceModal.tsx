'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, Copy, Check, X, Award, Lock, Sparkles } from 'lucide-react';
import { getProvenanceCertificate, AuthorshipProvenanceCertificate } from '@akems/shared';

export function AuthorProvenanceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [cert, setCert] = useState<AuthorshipProvenanceCertificate | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate and validate certificate
    try {
      const data = getProvenanceCertificate();
      setCert(data);
    } catch (err) {
      console.error('Failed to initialize provenance:', err);
    }

    // Custom event listener for programmatic or UI triggers (e.g. 5-click easter eggs)
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-author-provenance', handleOpen);

    // Secret shortcut: Ctrl + Shift + Alt + R
    const handleKeyDown = (e: KeyboardEvent) => {
      const isR = e.key === 'r' || e.key === 'R' || e.code === 'KeyR';
      const hasModifiers = (e.ctrlKey || e.metaKey) && e.shiftKey && e.altKey;

      if (hasModifiers && isR) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Global console verification hook for developer tools
    if (typeof window !== 'undefined') {
      (window as unknown as { __verifyAuthor: () => void }).__verifyAuthor = () => {
        const c = getProvenanceCertificate();
        console.group('%c [AKEMS] SYSTEM PROVENANCE & AUTHORSHIP CERTIFICATE', 'color: #2563eb; font-weight: bold; font-size: 14px;');
        console.log('%c Status:         ', 'color: #10b981; font-weight: bold;', c.status);
        console.log('%c Lead Architect: ', 'color: #3b82f6; font-weight: bold;', c.architect);
        console.log('%c Organization:   ', 'color: #64748b;', c.organization);
        console.log('%c System:         ', 'color: #64748b;', c.system);
        console.log('%c Role:           ', 'color: #64748b;', c.role);
        console.log('%c Genesis Hash:   ', 'color: #8b5cf6;', c.genesisHash);
        console.log('%c Legal Notice:   ', 'color: #ef4444;', c.legalNotice);
        console.groupEnd();
        setIsOpen(true);
      };
    }

    return () => {
      window.removeEventListener('open-author-provenance', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const copyCert = useCallback(() => {
    if (!cert) return;
    const text = [
      'AKEMS System Authorship & Provenance Certificate',
      '------------------------------------------------',
      `Architect: ${cert.architect}`,
      `Role: ${cert.role}`,
      `System: ${cert.system}`,
      `Institution: ${cert.organization}`,
      `Genesis Hash: ${cert.genesisHash}`,
      `Verification Status: ${cert.status} (100% Match)`,
      '',
      `Legal Statement: ${cert.legalNotice}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cert]);

  if (!isOpen || !cert) return null;

  return (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 text-white relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
              <Award size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] tracking-widest uppercase font-bold text-blue-300">
                  Official Provenance Record
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-200 border border-blue-400/30 font-mono">
                  <Sparkles size={10} /> AKEMS-CORE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                System Authorship Certificate
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-300/90 leading-relaxed mt-1">
            Cryptographically sealed system integrity and intellectual property verification for AIIMS Kalyani Examination Management System.
          </p>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-5">
          {/* Authenticity Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">Original Architecture Verified</p>
                <p className="text-[11px] text-emerald-700">Cryptographic hash matches Genesis block</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-600 text-white font-bold tracking-wider shadow-sm">
              100% MATCH
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs divide-y divide-slate-100">
            <div className="pt-2 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Original Creator & Architect</span>
              <span className="font-bold text-slate-900 text-sm tracking-wide bg-blue-50 text-blue-900 px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                {cert.architect}
              </span>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-slate-500 font-medium">System Role</span>
              <span className="font-semibold text-slate-800">{cert.role}</span>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Designated Institution</span>
              <span className="font-medium text-slate-700">{cert.organization}</span>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-slate-500 font-medium">System Architecture</span>
              <span className="font-medium text-slate-700">{cert.system}</span>
            </div>

            <div className="pt-3 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Lock size={12} className="text-slate-400" /> Genesis Hash (SHA-256)
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED ORIGINAL
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-600 break-all select-all leading-relaxed shadow-inner">
                {cert.genesisHash}
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <span>Proprietary Intellectual Property</span>
            </p>
            This system was architected and authored by <strong className="text-slate-900">{cert.architect}</strong>. Unauthorized copying, hosting under another person's name, or stripping of developer verification is strictly prohibited and legally invalid.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={copyCert}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Proof'}</span>
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm active:scale-95 shadow-blue-500/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
