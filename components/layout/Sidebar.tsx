'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  Users,
  FileText,
  BarChart3,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Polling Centers',
    href: '/polling-centers',
    icon: MapPin,
    children: [
      { name: 'All Centers', href: '/polling-centers' },
      { name: 'By Province', href: '/polling-centers/by-province' },
      { name: 'By District', href: '/polling-centers/by-district' },
      { name: 'By Constituency', href: '/polling-centers/by-constituency' },
      { name: 'PDF Documents', href: '/polling-centers/pdfs' },
      { name: 'Statistics', href: '/polling-centers/stats' },
    ],
  },
  {
    name: 'Candidates',
    href: '/candidates',
    icon: Users,
    children: [
      { name: 'All Candidates', href: '/candidates' },
      { name: 'By District', href: '/candidates/by-district' },
      { name: 'By Party', href: '/candidates/by-party' },
      { name: 'Gender Analysis', href: '/candidates/by-gender' },
      { name: 'Age Analysis', href: '/candidates/by-age' },
      { name: 'Statistics', href: '/candidates/stats' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const NavContent = () => (
    <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
      {navigation.map((item) => (
        <div key={item.name}>
          {item.children ? (
            <>
              <button
                onClick={() => toggleDropdown(item.name)}
                className={`
                  w-full flex items-center justify-between px-4 py-3.5 sm:py-3 rounded-lg text-sm font-medium
                  transition-colors duration-200 active:bg-gray-700
                  ${
                    isActive(item.href)
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  {item.name}
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    openDropdowns.includes(item.name) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdowns.includes(item.name) && (
                <div className="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        block px-4 py-2.5 sm:py-2 rounded-lg text-sm
                        transition-colors duration-200 active:bg-gray-700
                        ${
                          pathname === child.href
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-lg text-sm font-medium
                transition-colors duration-200 active:bg-gray-700
                ${
                  isActive(item.href)
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 safe-area-top">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 rounded-xl bg-gray-800/95 backdrop-blur-sm text-white shadow-lg border border-gray-700/50 active:scale-95 transition-transform"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-[280px] sm:w-64 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <BarChart3 className="text-emerald-500" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Nepal ECN</h1>
            <p className="text-xs text-gray-500">Election Data Portal</p>
          </div>
        </div>

        <NavContent />

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2">
            <a
              href="https://github.com/919Umesh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              aria-label="Umesh's GitHub"
            >
              <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
              >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.016-2.04-3.338.725-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.335-5.466-5.931 0-1.31.468-2.381 1.235-3.22-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.48 11.48 0 013.003-.403c1.02.005 2.045.138 3.003.403 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.874.118 3.176.77.839 1.233 1.91 1.233 3.22 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.103.823 2.222 0 1.606-.015 2.903-.015 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z" />
              </svg>
              @919Umesh
            </a>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Developed by Umesh Shahi Thakuri
            <br />
            © 2026
          </p>
        </div>
      </aside>
    </>
  );
}
