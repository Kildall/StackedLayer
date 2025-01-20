'use client'

import { Files } from "@/components/views/Files";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "One Time File",
};

export default function FilesPage() {
  return <Files />;
}