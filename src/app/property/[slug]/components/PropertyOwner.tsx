import Image from "next/image";
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Shield,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitials, getAvatarColor } from "@/lib/utils";

interface OwnerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  image: string;
}

interface PropertyOwnerProps {
  owner: OwnerInfo;
}

export default function PropertyOwner({ owner }: PropertyOwnerProps) {
  const initials = getInitials(owner.name);
  const bgColor = getAvatarColor(owner.name);
  const hasValidImage = owner.image && !owner.image.includes("default");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5 flex items-center">
        <UserCheck className="h-6 w-6 mr-2 text-blue-600" />
        Meet the Owner
      </h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative h-24 w-24 rounded-full overflow-hidden flex items-center justify-center">
          {hasValidImage ? (
            <Image
              src={owner.image}
              alt={owner.name}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className={`${bgColor} w-full h-full flex items-center justify-center text-white text-2xl font-bold`}
            >
              {initials}
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-green-500 h-5 w-5 rounded-full border-2 border-white"></div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium">{owner.name}</h3>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </span>
          </div>

          <p className="text-gray-500 text-sm mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Member since {owner.joinDate}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {owner.email && (
              <div className="flex items-center text-gray-700">
                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                <a
                  href={`mailto:${owner.email}`}
                  className="hover:text-blue-600"
                >
                  {owner.email}
                </a>
              </div>
            )}

            {owner.phone && (
              <div className="flex items-center text-gray-700">
                <Phone className="h-4 w-4 mr-2 text-blue-500" />
                <a href={`tel:${owner.phone}`} className="hover:text-blue-600">
                  {owner.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          <Button className="w-full sm:w-auto gap-2 rounded-full">
            <MessageSquare className="h-4 w-4" />
            Message Owner
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          About the Owner
        </h4>
        <p className="text-sm text-gray-700">
          I've been hosting rooms and properties for over{" "}
          {parseInt(owner.joinDate.split(" ")[2]) -
            new Date().getFullYear() +
            5}{" "}
          years. I ensure all my properties are well-maintained and provide a
          comfortable living experience for all tenants. Feel free to message me
          with any questions about this property!
        </p>
      </div>
    </div>
  );
}
