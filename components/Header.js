import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Header({ title }) {
  return (
    <div className="absolute top-0 w-full h-full">
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
        <div className="md:hidden flex absolute right-5 top-8">
          <button
            id="open-menu-btn"
            className="focus:outline-none focus:border-2 rounded-md p-1 focus:border-orange-500"
            onClick={() => {
              document.querySelector("#mobile-menu").classList.toggle("hidden");
              document.querySelector("#close-menu-btn").focus();
              document.querySelector(".r-menu").style.transform = "scale(1)";
            }}
          >
            <svg
              className="w-6 h-6"
              stroke="#8f8f8f"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div
          className="z-10 select-none hidden absolute block md:hidden w-full p-5 h-full backdrop-blur-lg"
          id="mobile-menu"
        >
          <div
            className="z-10 r-menu block bg-slate-100 w-full h-full shadow-xl rounded-lg p-5 transition-all"
            style={{
              transitionDuration: "0.25s",
              transform: "scale(0)",
            }}
          >
            <div className="flex">
              <Image src="/logo-round.png" alt="logo" width="50" height="50" />
              <button
                className="ml-auto focus:outline-none focus:border-2 rounded-md p-2 focus:border-orange-500"
                id="close-menu-btn"
                onClick={() => {
                  document.querySelector(".r-menu").style.transform =
                    "scale(0)";
                  setTimeout(() => {
                    document
                      .querySelector("#mobile-menu")
                      .classList.toggle("hidden");
                    document.querySelector("#open-menu-btn").focus();
                  }, 250);
                }}
              >
                <svg
                  className="w-6 h-6"
                  stroke="#8f8f8f"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-rows-2 grid-flow-row gap-5 m-10">
              <Link href="/">
                <a className="font-bold text-lg hover:text-orange-500 transition-colors my-2">
                  Home
                </a>
              </Link>
              <Link href="/about">
                <a className="font-bold text-lg hover:text-orange-500 transition-colors my-2">
                  About Us
                </a>
              </Link>
            </div>
            <div
              className="absolute bottom-10 flex gap-2"
              style={{
                left: "5%",
                right: "5%",
                width: "90%",
              }}
            >
              <Link href="/login" passHref>
                <button className="rounded-full w-1/2 border-2 hover:bg-orange-600 bg-orange-500 py-2 border-transparent text-white transition-colors px-4 font-bold text-md w-1/2">
                  Login
                </button>
              </Link>
              <Link href="/register" passHref>
                <button className="rounded-full border-2 border-gray-900 hover:bg-slate-200 transition-colors px-4 font-bold text-md w-1/2">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="gap-5 p-5 right-0 absolute hidden md:flex">
          <Link href="/about">
            <a className="font-bold text-lg hover:text-orange-500 transition-colors my-2">
              About Us
            </a>
          </Link>
          <div className="h-10 bg-gray-300 w-0.5"></div>
          <Link href="/login" passHref>
            <button className="rounded-full border-2 border-gray-900 hover:bg-orange-500 hover:text-white py-2 hover:border-transparent transition-colors px-4 font-bold text-md">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
