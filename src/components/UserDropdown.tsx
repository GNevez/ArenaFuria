import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  UserCircle,
  Dna,
  MessageSquare,
  LayoutDashboard,
  Home,
} from "lucide-react";
import Button from "../UI/button";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

interface UserDropdownProps {
  userName: string;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userName, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="primary"
        size="md"
        className="font-medium flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="w-5 h-5" />
        <span>{userName}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-lg py-2 z-50">
          <Link href="/">
            <button className="w-full px-4 py-2 text-left text-white hover:bg-white hover:text-black flex items-center gap-2">
              <Home className="w-5 h-5" />
              Inicio
            </button>
          </Link>
          <Link href="/perfil">
            <button className="w-full px-4 py-2 text-left text-white hover:bg-white hover:text-black flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              Perfil
            </button>
          </Link>
          <Link href="/dna">
            <button className="w-full px-4 py-2 text-left text-white hover:bg-white hover:text-black flex items-center gap-2">
              <Dna className="w-5 h-5" />
              DNA Furioso
            </button>
          </Link>
          {user?.role === "admin" && (
            <Link href="/dashboard">
              <button className="w-full px-4 py-2 text-left text-white hover:bg-white hover:text-black flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            </Link>
          )}
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-left text-white hover:bg-white hover:text-black flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
