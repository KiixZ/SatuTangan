import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Search, HeartHandshake, LogOut, User, LayoutDashboard, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#f3efe7] dark:border-[#372806] bg-[#fcfbf8]/95 dark:bg-[#211c11]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fcfbf8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-white">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary dark:text-white">
              SatuTangan
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-[#f3efe7] dark:bg-[#2c2619] placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-[#372806] focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
                placeholder="Cari campaign atau lembaga..."
                type="text"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              to="/campaigns"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#8A9A5B] transition-colors"
            >
              Campaign
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#8A9A5B] transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex">
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline-block">{user?.full_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {(user?.role === "CREATOR" || user?.role === "ADMIN") && (
                    <DropdownMenuItem
                      onClick={() => navigate("/creator/dashboard")}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="hidden sm:flex items-center justify-center h-10 px-4 rounded-lg border border-primary text-primary dark:text-white dark:border-white font-medium text-sm hover:bg-primary/5 dark:hover:bg-white/10 transition-colors bg-transparent"
                >
                  Masuk
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-white font-medium text-sm shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Daftar
                </Button>
              </>
            )}

            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-[#f3efe7] dark:border-[#372806] bg-[#fcfbf8] dark:bg-[#211c11]">
          <div className="flex flex-col gap-4 px-4">
            {/* Mobile Search */}
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Search className="h-5 w-5" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-[#f3efe7] dark:bg-[#2c2619] placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-[#372806] focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
                placeholder="Cari campaign atau lembaga..."
                type="text"
              />
            </div>

            <Link
              to="/donasi"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Donasi
            </Link>
            <Link
              to="/galang-dana"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galang Dana
            </Link>
            <Link
              to="/laporan"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Laporan
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Mode</span>
                <ThemeToggle />
              </div>

              {isAuthenticated ? (
                <>
                  <div className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {user?.full_name}
                  </div>
                  <Button
                    onClick={() => {
                      navigate("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full mb-2 justify-start"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  {(user?.role === "CREATOR" || user?.role === "ADMIN") && (
                    <Button
                      onClick={() => {
                        navigate("/creator/dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full mb-2 justify-start"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-center h-10 px-4 rounded-lg border border-primary text-primary dark:text-white font-medium text-sm hover:bg-primary/5 transition-colors"
                  >
                    Masuk
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/register"); // Assuming register route
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-center h-10 px-4 rounded-lg bg-primary text-white font-medium text-sm shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Daftar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
