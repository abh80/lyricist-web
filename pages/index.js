import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import Header from "../components/Header";

export default function Home() {
  useEffect(() => {
    const elem = document.getElementById(styles["animated-h-text"]);
    const texts = ["collection", "hub", "network"];
    let index = 0;
    function clear() {
      const l = elem.textContent.length;
      let i = 0;
      let interval = setInterval(() => {
        if (i >= l + 1) {
          if (index >= texts.length - 1) {
            index = 0;
            clearInterval(interval);
            return update(texts[index]);
          }
          index += 1;
          clearInterval(interval);
          return update(texts[index]);
        }
        elem.textContent = elem.textContent.slice(0, -1);
        i += 1;
      }, 100);
    }
    function update(t) {
      t = t + "!";
      const l = t.length;
      let i = 0;
      let interval = setInterval(() => {
        if (i >= l - 1) {
          setTimeout(clear, 2000);
          clearInterval(interval);
        }
        elem.textContent += t[i];
        i += 1;
      }, 100);
    }
    update(texts[index]);
  }, []);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Header title={"Lyricist"} />
      <div className="w-full h-2/6 hero-banner text-center py-5">
        <span className="main__header text-5xl my-5 font-bold text-white block">
          Lyricist
        </span>
        <span className="font-semibold text-2xl text-white">
          World&apos;s largest lyrics{" "}
        </span>
        <span
          className="mx-auto font-semibold text-2xl text-white"
          id={styles["animated-h-text"]}
        ></span>
      </div>
    </div>
  );
}
