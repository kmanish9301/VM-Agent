import ReactDOM from "react-dom/client";
import OtpInputComponent from "./OTPComponent";
import VMAgent from "./VMAgent";

const isAgentWindow = new URLSearchParams(window.location.search).has('agent');

ReactDOM.createRoot(document.getElementById("app")!).render(
    isAgentWindow ? <VMAgent /> : <OtpInputComponent />
);