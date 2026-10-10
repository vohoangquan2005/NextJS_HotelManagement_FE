"use client";

import { useParams } from "next/navigation";
import RoomDetail from "@/components/rooms/RoomDetail";

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>();

  return <RoomDetail roomId={Number(params.id)} />;
}
