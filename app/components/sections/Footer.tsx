'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Adventure Triangle</h3>
            <p className="text-sm leading-relaxed">
              Connecting travelers with verified adventure experiences worldwide. Launching January 26, 2026.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#about" className="hover:text-white transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="#partner-cta" className="hover:text-white transition-colors">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link href="#campaign" className="hover:text-white transition-colors">
                  #FeelTheAdventure
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@adventuretriangle.com" className="hover:text-white transition-colors">
                  support@adventuretriangle.com
                </a>
              </li>
              <li className="text-sm">Toronto, Canada</li>
              <li>
                <Link href="#social" className="hover:text-white transition-colors">
                  Social Media
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 text-center text-sm">
          <p>
            © {currentYear} Adventure Triangle. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Building the future of adventure - trusted, transformative, and truly global.
          </p>
        </div>
      </div>
    </footer>
  );
}

