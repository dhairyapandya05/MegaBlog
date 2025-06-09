import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {
  Bookmark,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import React from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const profilePic = useSelector(
    (state) => state.auth.userData?.profilepic || ""
  );
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className="w-12">
          <AvatarImage
            className="size-12"
            src={
              profilePic
                ? `profilePic`
                : "https://avatar.iran.liara.run/username?username=anonimous"
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-white rounded-xl shadow-lg py-2">
        <ul className="space-y-1">
          <li>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition flex items-center gap-3"
              onClick={() => {
                navigate("/profile/:prodileId");
              }}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
          </li>
          <li>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition flex items-center gap-3"
              onClick={() => {
                navigate("/posts");
              }}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition flex items-center gap-3"
              onClick={() => {
                navigate("/bookmarks");
              }}
            >
              <Bookmark size={16} />
              <span>Bookmarks</span>
            </button>
          </li>
          <li>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition flex items-center gap-3"
              onClick={() => {
                navigate("/settings");
              }}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition flex items-center gap-3">
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default Profile;
