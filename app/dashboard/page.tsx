"use client"

import ListingDashboardPage from "@/components/dashboard/apercu/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent";
import { useGetApercu } from "@/hooks/agence/useGetApercu"




export default function DashboardPage() {
  const { data, loading, error } = useGetApercu();
  const { user, loading: userLoading } = useAuthAgent();
  // console.log("DashboardPage - data:", data);
  // console.log("DashboardPage - user:", user);

  if (loading) return <div>Chargement...</div>;

  return (
     <ListingDashboardPage data={data} user={user} />
  )
}