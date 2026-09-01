import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useNotification } from "../context/NotificationContext"
import FullReport from "../components/reportTemplate/FullReport"


export default function ReportManager() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const { username, report_id } = useParams()
  const { showNotification } = useNotification()  
  const reportVerificationURL = `${import.meta.env.VITE_BACKEND_URL}getreport/${username}/${report_id}`

  useEffect(() => {
    async function checkIfReportExists() {
      try {
        const response = await fetch(reportVerificationURL, {
          credentials: "include"
        })

        if (!response.ok) {
          showNotification({
            success: false,
            message: "Something went wrong"
          })

          return navigate("/dashboard")
        }

        const data = await response.json()

        if (!data.success) {
          showNotification({
            success: data.success,
            message: data.message
          })

          return navigate("/dashboard")
        }

        console.log(data.message)
        setReport(data.message)
      } catch (err) {
        console.log("Error ", err)
      }
    }

    checkIfReportExists()
  }, [username, report_id])

  return (
  <>
     {report ? (
        <FullReport gig_data={report} />
      ) : (
        <Loading/>
      )}
  </>
  )
}