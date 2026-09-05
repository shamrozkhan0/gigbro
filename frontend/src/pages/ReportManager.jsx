import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useNotification } from "../context/NotificationContext"
import FullReport from "../components/reportTemplate/FullReport"
import Waiting from "../components/Waiting"


export default function ReportManager() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const { username, report_id } = useParams()
  const { showNotification } = useNotification()  
  const reportVerificationURL = `${import.meta.env.VITE_BACKEND_URL}getreport/${username}/${report_id}`

  useEffect(() => {
    async function checkIfReportExists() {
      try {
        console.log("req comes here")

        const response = await fetch(reportVerificationURL, {
          credentials: "include"
        })

        if (!response.ok) {
          showNotification({
            success: false,
            message: "Something went wrong"
          })
        console.log("response incorrect")

          return navigate("/dashboard")
        }

        const data = await response.json()

        if (!data.success) {
          console.log("error")
          showNotification({
            success: data.success,
            message: data.message
          })

          return navigate("/dashboard")
        }
        console.log("req comes here2")

        setReport(data.message)
        console.log("req comes here3")

      } catch (err) {
        console.log("error")

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
        <Waiting/>
      )}
  </>
  )
}