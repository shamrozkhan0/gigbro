import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen flex-col gap-5 md:gap-10">
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold">Coming Soon ...</h1>
      <Link className="text-lg bg-fiver-green px-15 py-2 rounded-full text-white font-bold" to={"/"}>Home</Link>
    </div>
  )
}

export default Dashboard;
