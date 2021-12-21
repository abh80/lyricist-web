import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Header({ title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="w-full flex select-none">
        <div
          className="flex p-5 gap-2 hover:cursor-pointer w-fit"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <Image src="/logo-round.png" alt="logo" width="50" height="50" />
          <span className="main__header text-3xl my-2 font-bold">Lyricist</span>
        </div>
        <div className="gap-5 p-5 right-0 absolute hidden md:flex">
          
          <Link href="/about">
            <a className="font-bold text-lg hover:text-orange-500 transition-colors my-2">
              About Us
            </a>
          </Link>
          <div className="h-10 bg-gray-300 w-0.5"></div>
          <Link href="/login" passHref>
            <button className="rounded-full border-2 border-gray-900 hover:bg-orange-500 hover:text-white py-2 hover:border-transparent transition-colors px-4 font-bold text-md">Login</button>
          </Link>
        </div>
      </div>
    </>
  );
}
