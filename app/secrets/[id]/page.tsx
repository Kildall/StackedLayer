'use client'
import { Secret } from "@/components/views/Secret";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "One Time Secret",
};

export default function SecretPage() {
  return <Secret />;
}