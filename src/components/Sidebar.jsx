import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', icon: ChartBarIcon, href: '/' },
  { name: 'Methodology', icon: DocumentTextIcon, href: '/methodology' },
  { name: 'Risk Assessment', icon: ClipboardDocumentListIcon, href: '/risk' },
  { name: 'Synthesis', icon: PresentationChartLineIcon, href: '/synthesis' },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-ey-gray-800 min-h-screen p-4">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center text-ey-gray-300 hover:bg-ey-gray-700 hover:text-white px-3 py-2 rounded-md group"
          >
            <item.icon className="h-6 w-6 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}