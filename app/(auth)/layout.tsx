"use client";

import Loading from "@/components/shared/Loading";
import { ModeToggle } from "@/components/shared/ModeToggle";
import SideNav from "@/components/shared/SideNav";
import { RootState } from "@/redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Axios } from "@/lib/AxiosConfig";
import { setUser } from "@/redux/slices/AuthSlice";

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

  useEffect(() => {
    const CheckAuth = async () => {
      setLoading(true);

      try {
        const token = Cookies.get("ds-admin-token");

        if (!token) {
          setLoading(false);
          Router.push("/");
          return; // Exit early
        }

        const isAuth = await Axios.get("/admin/token", {
          headers: { "disaster-admin-token": token },
        });

        const data = await isAuth.data;

        dispatch(setUser({ email: data.email }));
      } catch (error) {
        console.log(error);
        setLoading(false);
        Router.push("/");
      }
      setLoading(false); // Ensure loading is false after the check
    };

    CheckAuth();
  }, [dispatch, pathName, Router]);

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
