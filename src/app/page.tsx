"use client"
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/RiyadhMap"), { ssr: false });

const Home = () => {
  return <Map />;
};

export default Home;
