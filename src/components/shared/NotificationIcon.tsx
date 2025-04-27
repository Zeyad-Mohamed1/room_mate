import { Bell } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationsProvider";
import { usePathname } from "next/navigation";

interface NotificationIconProps {
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

const NotificationIcon = ({
  className = "",
  iconClassName = "h-5 w-5",
  onClick,
}: NotificationIconProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/notifications";
  const { hasUnread } = useNotifications();

  return (
    <div className={`relative ${className}`}>
      <Bell
        className={`${iconClassName} ${
          isActive
            ? "text-primary stroke-[2.5px]"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={onClick}
      />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
      )}
    </div>
  );
};

export default NotificationIcon;
