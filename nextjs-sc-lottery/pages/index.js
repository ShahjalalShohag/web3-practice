import Head from "next/head";
// import ManualHeader from "../components/ManualHeader";
import Header from "../components/Header";
import LotteryEnter from "../components/LotteryEnter";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Decetralized Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <LotteryEnter />
    </div>
  );
}
