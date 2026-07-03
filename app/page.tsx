import { getPortfolioData } from "@/lib/blob";
import PortfolioClient from "./_components/PortfolioClient";

export default async function Home() {
  const data = await getPortfolioData();
  return <PortfolioClient data={data} />;
}
