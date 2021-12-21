import Header from "./../components/Header";
import Link from "next/link";
export default function not_found() {
  return (
    <>
      <Header title="404 | Not Found" />
      <div
        className="relative mx-auto text-center p-5 w-fit gap-2 top-1/2"
        style={{ marginTop: "-100px", height: "100px" }}
      >
        <div className="flex gap-2">
          <span className="font-bold text-orange-500 text-3xl md:text-5xl">
            404
          </span>
          <div className="h-10 w-0.5 bg-gray-400"></div>
          <span className="font-bold text-3xl md:text-5xl">Page not found</span>
        </div>
        <div className="flex mt-5 mx-auto w-fit">
          <Link href="/" passHref>
            <button className="w-fit p-2 bg-orange-500 text-white hover:bg-orange-600 rounded-md shadow-lg">
              Go to home
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
