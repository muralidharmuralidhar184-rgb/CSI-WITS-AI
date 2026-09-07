import React from 'react';
import { X, Phone, MapPin, Globe } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-[var(--surface)] pb-4">
          <h2 className="text-2xl font-semibold">College Information</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg"
            aria-label="Close information modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* College Name */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">CSI Wesley Institute of Technology and Sciences</h3>
          <p className="text-[var(--text-muted)]">CSI WITS</p>
        </div>

        {/* Key Information Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Location */}
          <div className="border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={20} />
              <h4 className="font-semibold">Location</h4>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              CFRP+5MC, PG Road, Sappu Bagh Apartment, Nallagunta, Begumpet, Hyderabad, Telangana 500003
            </p>
          </div>

          {/* Phone */}
          <div className="border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone size={20} />
              <h4 className="font-semibold">Phone</h4>
            </div>
            <a href="tel:04027818137" className="text-sm hover:underline">
              040 27818137
            </a>
          </div>

          {/* Website */}
          <div className="border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={20} />
              <h4 className="font-semibold">Website</h4>
            </div>
            <a
              href="https://wesleyengineeringcollege.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              wesleyengineeringcollege.com
            </a>
          </div>

          {/* EAMCET Code */}
          <div className="border border-[var(--border)] rounded-lg p-4">
            <h4 className="font-semibold mb-2">EAMCET Code</h4>
            <p className="text-sm">WESL</p>
          </div>
        </div>

        {/* Institutional Details */}
        <div className="space-y-4 mb-8">
          <div>
            <h4 className="font-semibold mb-2">Established</h4>
            <p className="text-sm text-[var(--text-muted)]">2015</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Sponsorship</h4>
            <p className="text-sm text-[var(--text-muted)]">Church of South India Medak Diocese</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Affiliation</h4>
            <p className="text-sm text-[var(--text-muted)]">
              Jawaharlal Nehru Technological University, Hyderabad (JNTUH)
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Approval</h4>
            <p className="text-sm text-[var(--text-muted)]">AICTE, New Delhi</p>
          </div>
        </div>

        {/* Programs */}
        <div className="mb-8">
          <h4 className="font-semibold mb-3">B.Tech Programs</h4>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Duration: 4 Years</p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>• Computer Science and Engineering (CSE)</li>
              <li>• CSE - Artificial Intelligence & Machine Learning (AI&ML)</li>
              <li>• CSE - Data Science</li>
              <li>• Electronics & Communication Engineering (ECE)</li>
              <li>• Electrical & Electronics Engineering (EEE)</li>
            </ul>
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-8">
          <h4 className="font-semibold mb-3">Campus Facilities</h4>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li>✓ Well-equipped laboratories and computing centers</li>
            <li>✓ Library with digital resources</li>
            <li>✓ Sports and recreation facilities</li>
            <li>✓ Hostel accommodations</li>
            <li>✓ Cafeteria</li>
            <li>✓ Health center</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full p-3 rounded-lg bg-[var(--button-primary)] text-[var(--button-primary-text)] hover:opacity-90 transition-opacity min-h-[44px]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
