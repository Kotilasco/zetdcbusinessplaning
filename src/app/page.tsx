import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import DashboardPage from "@/components/Dash";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Zetdc Bussiness Planning",
  description: "This is the application for all the reporting",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
       {/*  <ECommerce /> */}
           <DashboardPage />
      </DefaultLayout>
    </>
  );
}
