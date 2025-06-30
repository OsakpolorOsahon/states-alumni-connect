
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Sun,
  Moon,
  User,
  Award,
  Calendar,
  MapPin,
  Users,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "./NotificationBell";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, member, signOut, loading } = useAuth();
  const location = useLocation();
  
  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "History", href: "/history" },
    { name: "Directory", href: "/directory" },
    { name: "Hall of Fame", href: "/hall-of-fame" },
    { name: "News", href: "/news" },
    { name: "Map", href: "/map" },
    { name: "Contact", href: "/contact" },
  ];
  
  const memberNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: User },
    { name: "Hall of Fame", href: "/hall-of-fame", icon: Award },
    { name: "News & Events", href: "/news-events", icon: Calendar },
    { name: "Map", href: "/map", icon: MapPin },
    { name: "Directory", href: "/directory", icon: Users },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLinkClick = () => {
    setIsOpen(false);
  };
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img
                src="/images/logo-transparent.png"
                alt="SMMOWCUB Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-[#E10600] dark:text-white">
                SMMOWCUB
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && member?.status === "Active" ? (
              // Authenticated Member Navigation
              memberNavItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive(item.href)
                          ? "bg-[#E10600] text-white"
                          : "text-foreground hover:text-[#E10600] hover:bg-muted"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              // Public Navigation
              publicNavItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-[#E10600] text-white"
                        : "text-foreground hover:text-[#E10600] hover:bg-muted"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))
            )}

            {/* Notification Bell */}
            {user && member?.status === "Active" && <NotificationBell />}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth Buttons */}
            {loading ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-2">
                {member?.role === "secretary" && (
                  <Link to="/secretary-dashboard">
                    <Button className="bg-[#E10600] hover:bg-[#C10500]">
                      Secretary
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#E10600] hover:bg-[#C10500]">
                    Join Us
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu & theme */}
          <div className="md:hidden flex items-center gap-2">
            {user && member?.status === "Active" && <NotificationBell />}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {user && member?.status === "Active" ? (
                    <>
                      <div className="pb-4 border-b border-border">
                        <p className="font-medium text-foreground">
                          {member?.nickname || member?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member?.current_council_office ||
                            member?.last_mowcub_position}
                        </p>
                      </div>
                      {memberNavItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isActive(item.href)
                                ? "bg-[#E10600] text-white"
                                : "text-foreground hover:text-[#E10600] hover:bg-muted"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                      {member?.role === "secretary" && (
                        <Link
                          to="/secretary-dashboard"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-[#E10600] text-white"
                        >
                          Secretary Dashboard
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          signOut();
                          handleLinkClick();
                        }}
                        className="flex items-center gap-2 justify-start"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      {publicNavItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={handleLinkClick}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? "bg-[#E10600] text-white"
                              : "text-foreground hover:text-[#E10600] hover:bg-muted"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <div className="pt-4 border-t border-border space-y-2">
                        <Link to="/login" onClick={handleLinkClick}>
                          <Button variant="outline" className="w-full justify-start">
                            Login
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={handleLinkClick}>
                          <Button className="w-full justify-start bg-[#E10600] hover:bg-[#C10500]">
                            Join Us
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
