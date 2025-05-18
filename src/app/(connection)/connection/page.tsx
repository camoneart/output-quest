import * as Connection from "@/features/connection/components";
import { getPageMetadata } from "@/config/metadata";
import { Metadata } from "next";

export const metadata: Metadata = getPageMetadata("connection");

export default function ConnectionPage() {
  return <Connection.ConnectionPageClient />;
}
