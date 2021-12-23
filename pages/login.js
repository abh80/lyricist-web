import { Component, createRef } from "react";
import Header from "../components/Header";
const { apiUrl, recaptcha_site_key } = require("../config.json");
import Recaptcha from "reaptcha";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import Spinner from "../components/Spinner";

export default class Login extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.captchaRef = createRef();
    this.state = {
      response: null,
      spin: null,
    };
    this.code = {
      "remove-border-on-change": false,
    };
  }
  removeBorderFromBoth() {
    document.querySelector("#email").style.border = "1px solid black";
    document.querySelector("#password-parent").style.border = "1px solid black";
    document.querySelector("#email-err").textContent = "";
    document.querySelector("#password-err").textContent = "";
    this.code["remove-border-on-change"] = false;
  }
  triggerEmailErr() {
    document.querySelector("#email").style.border = "2px solid red";
  }
  triggerPasswordErr() {
    document.querySelector("#password-parent").style.border = "2px solid red";
  }
  async handleSubmit(e) {
    e.preventDefault();
    if (this.state.spin) return;
    if (!this.state.response) {
      document.querySelector("#captcha-err").textContent =
        "Please verify captcha first";
      return;
    }
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (!email || !/\S+@\S+\.\S+/.test(email.toLowerCase())) {
      document.querySelector("#email-err").textContent = "Email is invalid";
      this.triggerEmailErr();
      return document.querySelector("#email").focus();
    }
    if (!password) {
      document.querySelector("#password-err").textContent =
        "Password is required";
      this.triggerPasswordErr();
      return document.querySelector("#password").focus();
    }
    try {
      this.setState({ spin: true });
      const data = await fetch(`${apiUrl}/s/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          captcha_response: this.state.response,
        }),
      });

      const json = await data.json();
      if (data.status != 200) {
        this.setState({ spin: false });
        this.triggerEmailErr();
        this.triggerPasswordErr();
        document.querySelector("#password-err").textContent = json.message;
        this.code["remove-border-on-change"] = true;
        if (!this.captchaRef) return;
        this.captchaRef.current.reset();
        return;
      }
      localStorage.setItem("token", json.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: json.name,
          image: json.image,
          id: json.id,
          role: json.role,
        })
      );
      window.location.href = "/dashboard";
    } catch (e) {
      this.setState({ spin: false });
      this.code["remove-border-on-change"] = true;
      this.captchaRef.current.reset();
      this.triggerEmailErr();
      this.triggerPasswordErr();
      document.querySelector("#password-err").textContent =
        "Server ran into an error, try again later";
    }
  }
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard";
    } else localStorage.clear();
  }
  render() {
    return (
      <>
        <Header title="Login" />
        <div className="items-center justify-center w-full h-fit mx-auto overflow-hidden relative md:mt-0 mt-10 top-1/2 -translate-y-1/2">
          <div className="bg-white relative w-1/4 shadow-xl p-5 md:rounded-xl mx-auto min-w-fit">
            <h1 className="text-3xl font-bold block">Login</h1>
            <h2 className="block text-md font-medium">
              Resume the world of lyrics!
            </h2>
            <form onSubmit={this.handleSubmit}>
              <div
                className={
                  "h-12 w-full my-5 relative " + styles["input-wrapper"]
                }
              >
                <input
                  id="email"
                  type={"text"}
                  className="w-full h-full border border-gray-900 rounded focus:outline-none"
                  placeholder="Email"
                  onChange={() => {
                    if (this.code["remove-border-on-change"])
                      return this.removeBorderFromBoth();
                    document.querySelector("#email-err").textContent = "";
                    document.querySelector("#email").style.border =
                      "1px solid black";
                  }}
                />
                <span className={styles["floating-label"] + " text-gray-500"}>
                  Email
                </span>
              </div>
              <span
                id="email-err"
                className="text-red-600 font-medium text-sm relative"
                style={{ top: "-15px" }}
              ></span>
              <div
                className={
                  "flex gap-10 w-full h-12 border border-gray-900 rounded my-2 min-w-fit relative " +
                  styles["input-wrapper"]
                }
                style={{
                  paddingLeft: "2px",
                  paddingRight: "2px",
                }}
                id="password-parent"
              >
                <input
                  id="password"
                  type={"password"}
                  placeholder="Password"
                  className="w-2/3 h-11 focus:outline-none"
                  onChange={() => {
                    if (this.code["remove-border-on-change"])
                      return this.removeBorderFromBoth();
                    document.querySelector("#password-err").textContent = "";
                    document.querySelector("#password-parent").style.border =
                      "1px solid black";
                  }}
                />
                <span className={styles["floating-label"] + " text-gray-500"}>
                  Password
                </span>
                <span
                  className="text-sm mt-2 h-fit mx-2 font-medium hover:cursor-pointer hover:bg-orange-300 rounded-full px-3 py-1.5 transition-all"
                  onClick={(e) => {
                    const current = e.target.textContent;
                    if (current == "Show") {
                      e.target.textContent = "Hide";
                      document.getElementById("password").type = "text";
                    } else {
                      e.target.textContent = "Show";
                      document.getElementById("password").type = "password";
                    }
                  }}
                >
                  Show
                </span>
              </div>
              <span
                id="password-err"
                className="text-red-600 font-medium text-sm relative block"
                style={{ top: "-5px" }}
              ></span>
              <Link href="/resetpwd">
                <a className="text-blue-700 font-medium text-md hover:underline">
                  Forgot password?
                </a>
              </Link>
              <div className="h-5 w-full"></div>
              <Recaptcha
                ref={this.captchaRef}
                sitekey={recaptcha_site_key}
                onVerify={(response) => {
                  document.querySelector("#captcha-err").textContent = "";
                  document.querySelector("#con-btn").disabled = false;
                  document
                    .querySelector("#con-btn")
                    .classList.replace("cursor-not-allowed", "cursor-pointer");
                  this.setState({ response });
                }}
              />
              <span
                className="text-red-600 font-medium text-sm relative block"
                id="captcha-err"
              ></span>
              <div className="h-2 w-full"></div>
              <button
                id="con-btn"
                disabled
                className="flex cursor-not-allowed block mt-10 text-center border-none outline-none focus:outline-none w-full bg-orange-400 text-white p-3 hover:bg-orange-500 focus:bg-orange-500 rounded-full transition-all"
              >
                <div className="w-fit mx-auto flex">
                  <Spinner visible={this.state.spin} />
                  <span
                    className={
                      "font-semibold" + (!this.state.spin ? "" : " hidden")
                    }
                  >
                    Continue
                  </span>
                </div>
              </button>
            </form>
          </div>
          <div className="mx-auto min-w-fit mt-5 text-center">
            <span>Don&apos;t have an account? </span>
            <Link href="/register">
              <a className="text-blue-700 font-medium text-md hover:underline">
                Create now
              </a>
            </Link>
          </div>
        </div>
      </>
    );
  }
}
