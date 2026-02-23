"use client"

import { useEffect, useState } from "react"
import DocumentsTipsCard from "@/components/documents/DocumentsTipsCard"
import DocumentsHeader from "@/components/documents/DocumentsHeader"
import DocumentsProgressCard from "@/components/documents/DocumentsProgressCard"
import AdditionalDocumentsCard from "@/components/documents/AdditionalDocumentsCard"
import RequiredDocumentsCard from "@/components/documents/RequiredDocumentsCard"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

export default function DocumentsPage() {
  const [requiredDocuments, setRequiredDocuments] = useState<any[]>([])
  const [additionalDocuments, setAdditionalDocuments] = useState<any[]>([])
  const [profile, setProfile] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        const res = await axiosInstance.get("/api/profile/documents", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          }
        })

        if (res.status === 200) {
          setRequiredDocuments(res.data.required_documents || [])
          setAdditionalDocuments(res.data.additional_documents || [])
          setProfile(res.data.client|| [])
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération des documents:", err)
        toast.error("Erreur lors du chargement des documents")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // console.log("Required Documents:", requiredDocuments)
  // console.log("Additional Documents:", additionalDocuments)
  // console.log("Profile:", profile)


  return (
    <div className="space-y-6">
      {/* Header */}

      <DocumentsHeader user={profile} />

      {/* Progress Card */}
      <DocumentsProgressCard documents={requiredDocuments} />

      {/* Required Documents */}
    
      <RequiredDocumentsCard documents={requiredDocuments}/>

      {/* Additional Documents */}
     
      <AdditionalDocumentsCard documents={additionalDocuments}/>

      {/* Tips Card */}

      <DocumentsTipsCard />
    </div>
  )
}
