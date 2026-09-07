import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useNotification } from "../context/NotificationContext"
import FullReport from "../components/reportTemplate/FullReport"
import Waiting from "../components/Waiting"

export default function ReportManager() {
  const navigate = useNavigate()

  const { username, report_id } = useParams()

  const { showNotification } = useNotification()

  const [isReportExist, setIsReportExist] = useState(null)
  const [report, setReport] = useState(null)

  useEffect(() => {
    async function checkReport() {
      try {

        setIsReportExist(null)
        setReport(null)

        const backendURL = import.meta.env.VITE_BACKEND_URL


        const existenceResponse = await fetch(
          `${backendURL}reportexist/${username}/${report_id}`,
          {
            credentials: "include",
          }
        )

        if (!existenceResponse.ok) {
          showNotification({
            success: false,
            message: "Something went wrong",
          })

          navigate("/dashboard")
          return
        }

        const existenceData = await existenceResponse.json()

        console.log("Report existence:", existenceData)


        if (!existenceData.success) {
          showNotification({
            success: false,
            message: existenceData.message,
          })

          navigate("/dashboard")
          return
        }

        if (!existenceData.exists) {
          setIsReportExist(false)
          return
        }

        setIsReportExist(true)

        const reportResponse = await fetch(
          `${backendURL}getreport/${username}/${report_id}`,
          {
            credentials: "include",
          }
        )


        if (!reportResponse.ok) {
          showNotification({
            success: false,
            message: "Failed to load report",
          })

          navigate("/dashboard")
          return
        }

        const reportData = await reportResponse.json()
        console.log(reportData)

        if (!reportData.success) {
          showNotification({
            success: false,
            message: reportData.message,
          })

          navigate("/dashboard")
          return
        }
        
        setReport(reportData.message)

      } catch (error) {
        console.error("Report error:", error)

        showNotification({
          success: false,
          message: "Something went wrong",
        })

        navigate("/dashboard")
      }
    }

    checkReport()
  }, [username, report_id])


  if (isReportExist === null) {
    return <Loading />
  }

  if (isReportExist === false) {
    return <Waiting />
  }

  return report && <FullReport gig_data={report} />
}