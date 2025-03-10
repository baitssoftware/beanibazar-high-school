'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function InstituteSidebar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const navigationItems = [
    {
      name: 'Institute Information',
      link: '/institute-information',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
    {
      name: "Teacher's Information",
      link: '/teachers-information',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
    {
      name: 'Officers & Staff',
      link: '/officers-staff',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
    {
      name: "Student's List",
      link: '/students-list',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
    {
      name: 'Governing Body',
      link: '/governing-body',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
    {
      name: 'Class Routine',
      link: '/class-routine',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
    {
      name: 'Exam Routine',
      link: '/exam-routine',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
    {
      name: 'Exam Result',
      link: '/exam-result',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
    {
      name: 'Syllabus',
      link: '/syllabus',
      icon: <ChevronRight className="inline w-5 mb-1 text-primary_school" />,
    },
  ];

  return (
    <div className="border border-primary_school h-full">
      <h2 className="heading">Institute Resources</h2>
      <ul className="mt-2 space-y-2 px-4 py-5 ">
        {navigationItems.map((item, index) => (
          <li
            key={index}
            className={`transition-all duration-200 hover:translate-x-1 ${
              activeSection === item.name ? 'font-semibold' : ''
            }`}
          >
            <Link href={item.link} passHref onClick={() => setActiveSection(item.name)}>
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
