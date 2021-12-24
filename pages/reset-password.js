import { Component, createRef } from "react";
import Header from "../components/Header";
import { withRouter } from "next/router";
import Spinner from "../components/Spinner";
import config from "../config.json";
import Recaptcha from "reaptcha";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spin: false,
      response: null,
    };
    this.recaptchaRef = createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    if (window.localStorage.getItem("token"))
      return window.localStorage.clear();
  }
  triggerEmailErr() {
    document.querySelector("#email").style.border = "2px solid red";
  }
  async handleSubmit(e) {
    e.preventDefault();
    if (this.state.spin) return;
    if(!this.state.response) {
      document.querySelector("#captcha-err").textContent = "Please verify captcha";
      return;
    }
    const email = document.querySelector("#email").value;
    if (!email || !/\S+@\S+\.\S+/.test(email.toLowerCase())) {
      this.triggerEmailErr();
      document.querySelector("#err").textContent = "Invalid Email";
      return;
    }
    try {
      this.setState({ spin: true });
      const res = await fetch(`${config.apiUrl}/s/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();
      this.setState({ spin: false });
      if (res.status != 200) {
        document.querySelector("#err").textContent = data.message;
        this.triggerEmailErr();
        return;
      }
      this.props.router.push(
        "/session_verify?verify=reset-pwd&session=" + data.session
      );
    } catch {
      this.setState({ spin: false });
      this.triggerEmailErr();
      document.querySelector("#err").textContent = "Server ran into an error";
    }
  }
  render() {
    return (
      <>
        <Header title="Reset Password" />
        <div className="items-center justify-center w-full h-fit mx-auto overflow-hidden relative md:mt-0 mt-10 top-1/2 -translate-y-1/2">
          <div className="bg-white relative w-1/4 shadow-xl p-5 md:rounded-xl mx-auto min-w-fit">
            <h1 className="text-3xl font-bold block">Reset Password</h1>
            <h2 className="block text-md font-medium">
              Forgot your password? - No worries we got you covered.
            </h2>
            <div className="w-full h-5"></div>
            <form onSubmit={this.handleSubmit}>
              <label className="text-gray-600">Email</label>
              <input
                id="email"
                type="email"
                className="w-full h-12 border border-gray-900 rounded p-2 focus:outline-none"
                onChange={() => {
                  document.querySelector("#err").textContent = "";
                  document.querySelector("#email").style.border =
                    "1px solid black";
                }}
              />
              <span
                id="err"
                className="text-red-600 font-medium text-sm relative"
              ></span>
              <div className="w-full h-5"></div>
              <Recaptcha
                sitekey={config.recaptcha_site_key}
                ref={this.recaptchaRef}
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
              <div className="w-full h-5"></div>
              <button
                id="con-btn"
                disabled
                className="cursor-not-allowed w-full bg-orange-400 rounded-full p-2 text-white font-semibold hover:bg-orange-500 transition-colors"
              >
                <Spinner visible={this.state.spin} />
                <span className={this.state.spin ? "hidden" : ""}>
                  Continue
                </span>
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(ChangePassword);
