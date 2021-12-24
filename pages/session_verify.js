import Link from "next/link";
import { withRouter } from "next/router";
import { Component } from "react";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
const { apiUrl } = require("../config.json");
import styles from "../styles/Login.module.css";
class Session_Verify extends Component {
  constructor(props) {
    super(props);
    this.state = { verificationType: null, session: null, spin: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  triggerPwdError() {
    document.querySelector("#password-parent").style.border = "2px solid red";
  }
  triggerTokenError() {
    document.querySelector("#reset-token").style.border = "2px solid red";
  }
  async handleSubmit(e) {
    e.preventDefault();
    if (!this.state.verificationType) return;
    if (this.state.spin) return;
    document.querySelector("#err").textContent = "";
    const { session, verificationType } = this.state;
    if (verificationType == "verify-email") {
      const otp = Array.from(document.querySelectorAll("input"))
        .map((el) => el.value)
        .join("");
      if (!otp) return;
      try {
        this.setState({ spin: true });
        const res = await fetch(`${apiUrl}/sessions/${session}/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        });
        const json = await res.json();
        this.setState({ spin: false });
        if (res.status != 200) {
          document.querySelector("#err").textContent = json.message;
          return;
        }
        this.props.router.push(
          "/success?text=Successfully+created+account+website+not+complete&redirectTo=/login"
        );
      } catch {
        this.setState({ spin: false });
        document.querySelector("#err").textContent =
          "Server ran into an error.";
      }
    } else if (verificationType == "reset-pwd") {
      const pwd = document.querySelector("#new-pwd").value;
      const token = document.querySelector("#reset-token").value;
      if (!token) {
        document.querySelector("#err").textContent = "Token is required.";
        this.triggerTokenError();
        return;
      }
      if (!pwd) {
        document.querySelector("#err").textContent =
          "Password cannot be empty.";
        return this.triggerPwdError();
      }
      if (pwd.length < 6) {
        document.querySelector("#err").textContent =
          "Password must be at least 6 characters.";
        return this.triggerPwdError();
      }
      try {
        this.setState({ spin: true });
        const res = await fetch(`${apiUrl}/s/reset/${session}/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pin: token, password: pwd }),
        });
        const json = await res.json();
        this.setState({ spin: false });
        if (res.status != 200) {
          document.querySelector("#err").textContent = json.message;
          this.triggerTokenError();
          return;
        }
        window.localStorage.clear();
        this.props.router.push(
          "/success?text=Password+reset+successful&redirectTo=/login"
        );
      } catch {
        this.setState({ spin: false });
        document.querySelector("#err").textContent =
          "Server ran into an error.";
      }
    }
  }
  handleInpChange(e) {
    document.querySelector("#err").textContent = "";
    const { id } = e.target;
    const val = e.target.value;
    if (!/^\d+$/.test(val)) {
      return (e.target.value = "");
    }
    let n = parseInt(id.split("-")[1]);
    if (n >= 6) return;
    let el = document.getElementById(`inp-${n + 1}`);
    if (el) el.focus();
  }
  componentDidMount() {
    const token = window.localStorage.getItem("token");
    if (token) return this.props.router.push("/dashboard");
    const query = new URLSearchParams(window.location.search);
    if (!query.get("verify")) {
      this.props.router.push("/404");
    }
    if (!["reset-pwd", "verify-email"].includes(query.get("verify"))) {
      this.props.router.push("/404");
    }
    if (!query.get("session")) return this.props.router.push("/404");
    const session = query.get("session");
    const verify = query.get("verify");
    this.setState({ verificationType: verify, session });
    if (verify == "verify-email") {
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.keyCode == 86) {
          e.preventDefault();
          navigator.clipboard.readText().then((text) => {
            if (text.length < 6 || text.length > 6)
              return (document.querySelector("#err").textContent =
                "Cannot paste verfication code less than or greater than 6 digits.");
            Array.from(document.querySelectorAll("input")).forEach((el, i) => {
              el.value = text[i];
            });
            document.querySelector("#err").textContent = "";
          });
        }
      });
    }
  }
  render() {
    return (
      <>
        <Header title="Verify Session" />
        <div className="items-center justify-center w-fult h-fit mx-auto overflow-hidden relative md:mt-0 mt-10 top-1/2 -translate-y-1/2">
          <div className="bg-white relative w-1/4 shadow-xl p-5 md:rounded-xl mx-auto min-w-fit min-w-fit min-h-fit">
            <h1 className="text-3xl font-bold block">Verification</h1>
            <h2 className="block text-md font-medium">
              We have sent an email to your email address. Please check your
              email for{" "}
              {this.state.verificationType
                ? this.state.verificationType == "reset-pwd"
                  ? "password reset token"
                  : "email verification code"
                : "email verification code"}
              .
            </h2>
            {(this.state.verificationType &&
              this.state.verificationType == "verify-email" && (
                <form onSubmit={this.handleSubmit}>
                  <span
                    id="err"
                    className="text-red-600 font-medium text-sm relative block mt-5"
                  ></span>
                  <div className="flex gap-2 mt-2 h-12 w-full">
                    <input
                      autoFocus
                      maxLength={1}
                      id="inp-1"
                      type="text"
                      className="h-full w-10 border border-gray-900 rounded p-2 focus:outline-none text-center"
                      autoComplete="off"
                      onChange={this.handleInpChange}
                    />
                    <input
                      id="inp-2"
                      maxLength={1}
                      type="text"
                      className="h-full w-10 border border-gray-900 rounded p-2 focus:outline-none text-center"
                      autoComplete="off"
                      onChange={this.handleInpChange}
                    />
                    <input
                      id="inp-3"
                      maxLength={1}
                      type="text"
                      className="h-full w-10 border border-gray-900 rounded p-2 focus:outline-none text-center"
                      autoComplete="off"
                      onChange={this.handleInpChange}
                    />
                    <input
                      id="inp-4"
                      maxLength={1}
                      type="text"
                      className="h-full w-10 border border-gray-900 rounded p-2 focus:outline-none text-center"
                      autoComplete="off"
                      onChange={this.handleInpChange}
                    />
                    <input
                      id="inp-5"
                      maxLength={1}
                      type="text"
                      className="h-full w-10 border border-gray-900 rounded p-2 focus:outline-none text-center"
                      autoComplete="off"
                      onChange={this.handleInpChange}
                    />
                    <input
                      id="inp-6"
                      maxLength={1}
                      type="text"
                      className="h-full w-10 border border-gray-900 rounded p-2 focus:outline-none text-center"
                      autoComplete="off"
                      onChange={this.handleInpChange}
                    />
                  </div>
                  <button className="mt-5 w-12 h-12 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors justify-center text-center">
                    <Spinner visible={this.state.spin} />
                    <svg
                      className={
                        "w-6 h-6 mx-auto " + (this.state.spin ? "hidden" : "")
                      }
                      fill="none"
                      stroke="white"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </form>
              )) || (
              <form onSubmit={this.handleSubmit}>
                <span
                  id="err"
                  className="text-red-600 font-medium text-sm relative block mt-5"
                ></span>
                <div className={"gap-2 mt-2 h-full w-full"}>
                  <div
                    className={
                      "h-12 w-full relative " + styles["input-wrapper"]
                    }
                  >
                    <input
                      id="reset-token"
                      className="w-full h-12 border border-gray-900 rounded p-2 focus:outline-none"
                      type="text"
                      autoFocus
                      placeholder="Password Reset Token"
                      autoComplete="off"
                      onChange={() => {
                        document.querySelector("#err").textContent = "";
                        document.querySelector("#reset-token").style.border =
                          "1px solid black";
                      }}
                    />
                    <span
                      className={styles["floating-label"] + " text-gray-500"}
                    >
                      Password reset token
                    </span>
                  </div>
                  <div
                    id="password-parent"
                    className={
                      "flex gap-10 w-full h-12 border border-gray-900 rounded px-0.5 my-2 min-w-fit relative " +
                      styles["input-wrapper"]
                    }
                  >
                    <input
                      id="new-pwd"
                      className="w-2/3 h-11 focus:outline-none"
                      type="password"
                      autoFocus
                      placeholder="New Password"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      onChange={() => {
                        document.querySelector("#err").textContent = "";
                        document.querySelector(
                          "#password-parent"
                        ).style.border = "1px solid black";
                      }}
                    />
                    <span
                      className={styles["floating-label"] + " text-gray-500"}
                    >
                      New password
                    </span>
                    <div
                      className="text-sm min-w-fit mx-auto text-center mt-2 h-fit font-medium hover:cursor-pointer hover:bg-orange-300 rounded-full px-3 py-1.5 transition-all"
                      onClick={(e) => {
                        const current = e.target.textContent;
                        if (current == "Show") {
                          e.target.textContent = "Hide";
                          document.getElementById("new-pwd").type = "text";
                        } else {
                          e.target.textContent = "Show";
                          document.getElementById("new-pwd").type = "password";
                        }
                      }}
                    >
                      Show
                    </div>
                  </div>
                </div>

                <button className="mt-5 w-12 h-12 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors justify-center text-center">
                  <Spinner visible={this.state.spin} />
                  <svg
                    className={
                      "w-6 h-6 mx-auto " + (this.state.spin ? "hidden" : "")
                    }
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>
          <div className="mx-auto min-w-fit mt-5 text-center relative">
            <span>Something is not working? </span>
            <Link
              href={
                (this.state.verificationType &&
                  this.state.verificationType == "verify-email" &&
                  "/register") ||
                "/home"
              }
            >
              <a className="text-blue-700 font-medium text-md hover:underline">
                Start over
              </a>
            </Link>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(Session_Verify);
