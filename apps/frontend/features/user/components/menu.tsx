"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import { getUserProfile } from "../getUserProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/features/auth/components/logoutButton";

export default function UserMenu() {
  const { data, isFetching } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
  });
  if (isFetching) return null;
  if (!data?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="w-fit flex gap-x-2 items-center py-1 px-3 border bg-input/50 font-semibold rounded text-sm">
            {data.user.username}
            <ChevronDownIcon size={14} />
          </button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="rounded w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
