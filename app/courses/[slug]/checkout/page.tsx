"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CheckoutRedirect() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  useEffect(() => {
    router.replace(`/courses/${slug}/enroll`);
  }, [slug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div
        className="w-9 h-9 rounded-full border-[3px] animate-spin"
        style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }}
      />
    </div>
  );
}
