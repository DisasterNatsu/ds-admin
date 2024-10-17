"use client";

import Loading from "@/components/shared/Loading";
import { ModeToggle } from "@/components/shared/ModeToggle";
import SideNav from "@/components/shared/SideNav";
import { RootState } from "@/redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(false);

  const Router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.navState.open);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="h-screen fixed">
        <SideNav />
      </div>
      <div
        className={`${
          open ? "ml-72" : "ml-20"
        } duration-300 text-2xl flex-1 h-screen`}
      >
        <ModeToggle />
        {children}
      </div>
    </div>
  );
}
