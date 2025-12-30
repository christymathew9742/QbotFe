import React from "react";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Profile | Qbot admin Profile",
  description:
    "This is Qbot Profile page for Users",
};

export default function Profile() {
  return (
    <div>
      <PageBreadcrumb pagePath="User Profile" />
      <div className="rounded-md shadow-xl backdrop-blur-sm bg-white p-5 dark:border-color-primary dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-color-primary dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </div>
  );
}
