"use client";
import dynamic from "next/dynamic";

const ProductSection = dynamic(() => import("./ProductSection"), { ssr: false });

export default function ProductSectionClient() {
  return <ProductSection />;
}