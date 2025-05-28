import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Missions", href: "/missions" },
    { name: "Rapports", href: "/reports" },
    { name: "Paramètres", href: "/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50 font-sans antialiased text-secondary-900">
      <header className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-primary-600 font-bold text-xl">Audit Mission</span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-4">
                {navigation.map((item) => {
                  const isActive = item.href === location || 
                    (item.href !== "/" && location.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium ${
                        isActive
                          ? "text-primary-700 border-b-2 border-primary-500"
                          : "text-secondary-600 hover:text-primary-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Button>
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile photo" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="ml-2 text-sm font-medium">Antoine Dupont</span>
              </div>
            </div>
            <div className="flex md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-secondary-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = item.href === location || 
                  (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "text-primary-700 bg-primary-50"
                        : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 pb-3 border-t border-secondary-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-secondary-800">Antoine Dupont</div>
                  <div className="text-sm font-medium text-secondary-500">antoine@exemple.fr</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-secondary-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-semibold">Audit Mission Platform</span>
              <p className="text-secondary-400 text-sm mt-1">© {new Date().getFullYear()} Tous droits réservés</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-secondary-400 hover:text-white transition-colors">Aide</Link>
              <Link href="#" className="text-secondary-400 hover:text-white transition-colors">Mentions légales</Link>
              <Link href="#" className="text-secondary-400 hover:text-white transition-colors">Confidentialité</Link>
              <Link href="#" className="text-secondary-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
