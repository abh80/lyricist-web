import Head from "next/head";
import Image from "next/image";

export default function Header({ title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="w-full">
        <div className="flex p-5 gap-2 hover:cursor-pointer w-fit" onClick={() => {
          window.location.href = "/";
        }}>
          <Image src="/logo-round.png" alt="logo" width="50" height="50" />
          <span className="main__header text-3xl my-2 font-bold">Lyricist</span>
        </div>
      </div>
    </>
  );
}
