import { Component, createRef } from "react";
import Header from "../components/Header";
const { apiUrl, recaptcha_site_key } = require("../config.json");
import Recaptcha from "reaptcha";
import Link from "next/link";

export default class Register extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      response: null,
    };
    this.captchaRef = createRef();
  }
  triggerEmailErr() {
    document.querySelector("#email").style.border = "2px solid red";
  }
  triggerPasswordErr() {
    document.querySelector("#password-parent").style.border = "2px solid red";
  }
  triggerNameErr() {
    document.querySelector("#name").style.border = "2px solid red";
  }
  async handleSubmit(e) {
    e.preventDefault();
    if (!this.state.response) {
      document.querySelector("#captcha-err").textContent =
        "Please verify captcha first";
      return;
    }
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const name = document.querySelector("#name").value;

    if (!name) {
      document.querySelector("#name-err").textContent = "Name is required";
      this.triggerNameErr();
      return document.querySelector("#name").focus();
    }
    if (/[^a-zA-Z0-9]/.test(name)) {
      document.querySelector("#name-err").textContent =
        "Name can only contain letters and numbers";
      this.triggerNameErr();
      return document.querySelector("#name").focus();
    }
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
    if (password.length < 6) {
      document.querySelector("#password-err").textContent =
        "Password must be at least 6 characters";
      this.triggerPasswordErr();
      return document.querySelector("#password").focus();
    }
    try {
      const data = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          captcha_response: this.state.response,
        }),
      });
      const json = await data.json();
      if (data.status != 200) {
        this.triggerEmailErr();
        this.triggerPasswordErr();
        document.querySelector("#password-err").textContent = json.message;
        if (!this.captchaRef) return;
        this.captchaRef.current.reset();
        return;
      }
      window.location.href = "/email-verification?session=" + json.session;
    } catch {
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
      <div className="items-center justify-center w-full h-full">
        <Header title="Register" />

        <div className="bg-white w-1/4 shadow-xl p-5 rounded-xl mx-auto min-w-fit mt-10">
          <h1 className="text-3xl font-bold block">Register</h1>
          <h2 className="block text-md font-medium">
            Join the world of lyrics!
          </h2>
          <form onSubmit={this.handleSubmit}>
            <div className="w-full h-5"></div>
            <label className="text-gray-600">Name</label>
            <input
              id="name"
              type={"text"}
              className="w-full h-12 border border-gray-900 rounded p-2 focus:outline-none"
              onChange={() => {
                document.querySelector("#name-err").textContent = "";
                document.querySelector("#name").style.border =
                  "1px solid black";
              }}
            />
            <span
              id="name-err"
              className="text-red-600 font-medium text-sm relative"
            ></span>
            <div className="w-full h-2"></div>
            <label className="text-gray-600">Email</label>
            <input
              id="email"
              type={"text"}
              className="w-full h-12 border border-gray-900 rounded p-2 focus:outline-none"
              onChange={() => {
                document.querySelector("#email-err").textContent = "";
                document.querySelector("#email").style.border =
                  "1px solid black";
              }}
            />
            <span
              id="email-err"
              className="text-red-600 font-medium text-sm relative"
            ></span>
            <div className="w-full h-2"></div>
            <label className="text-gray-600">
              Password (6 or more characters)
            </label>
            <div
              className="flex gap-10 w-full h-12 border border-gray-900 rounded min-w-fit"
              id="password-parent"
            >
              <input
                id="password"
                type={"password"}
                className="w-2/3 mx-1 h-11 p-2 focus:outline-none"
                onChange={() => {
                  document.querySelector("#password-err").textContent = "";
                  document.querySelector("#password-parent").style.border =
                    "1px solid black";
                }}
              />
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
            ></span>
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
              className="cursor-not-allowed block mt-10 text-center border-none outline-none focus:outline-none w-full bg-orange-400 text-white p-3 hover:bg-orange-500 focus:bg-orange-500 rounded-full transition-all"
            >
              Join
            </button>
          </form>
        </div>
        <div className="mx-auto min-w-fit mt-5 text-center">
          <span>Already have an account? </span>
          <Link href="/login">
            <a className="text-blue-700 font-medium text-md hover:underline">
              Login
            </a>
          </Link>
        </div>
      </div>
    );
  }
}
