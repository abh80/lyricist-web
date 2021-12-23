import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function () {
  const [text, setText] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setText(query.get("text"));
    setRedirectTo(query.get("redirectTo"));
  }, []);
  return (
    <div className="h-full w-full">
      <Header title="Success" />
      <div className="container w-fit h-fit m-auto relative top-1/2 -translate-y-1/2">
        <div className="bg-green-500 md:h-80 md:w-80 h-60 w-60 rounded-full py-10 mx-auto">
          <svg
            className="md:h-60 md:w-60 w-40 h-40 mx-auto"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div
          className="w-full text-center mt-5 text-lg font-medium md:text-2xl md:mt-10"
          id="text-content"
        >
          {text}
        </div>
        {text && (
          <div className="w-fit h-fit mx-auto mt-2 md:mt-5">
            <button onClick={()=>window.location.href = redirectTo || "/"} className=" w-fit p-2 text-center bg-orange-500 rounded shadow-lg hover:bg-orange-600 transition-colors text-white text-lg font-semibold">
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
