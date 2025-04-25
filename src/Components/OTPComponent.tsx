import { useEffect, useState } from "react";
import OtpInput from 'react-otp-input';
import "./style.css";
import VMAgent from "./VMAgent";

const OTPComponent = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const [verified, setVerified] = useState(false);

    // Handle OTP change (only digits, no hyphen)
    const handleOtpChange = (value: string) => {
        // Ensure the OTP is limited to 10 characters (only digits, no hyphen)
        if (value.length <= 10 && /^[0-9]*$/.test(value)) {
            setOtp(value);
        }
    };

    const handleVerifyOTP = () => {
        window.electron.ipcRenderer.send("verify-otp", otp); // IPC call
        setError("");
        setShowLoader(true);
        setTimeout(() => {
            setShowLoader(false);
        }, 40000);
    };

    useEffect(() => {
        const handleOtpError = (_: any, data: string) => {
            setError(data);
            setShowLoader(false);
        };

        const handleOtpVerified = () => {
            setVerified(true); // Update the state when OTP is verified
        };

        window.electron.ipcRenderer.on("otp-error", handleOtpError);
        window.electron.ipcRenderer.on("otp-verified", handleOtpVerified); // Listen for successful OTP verification

        return () => {
            window.electron.ipcRenderer.removeListener("otp-error", handleOtpError);
            window.electron.ipcRenderer.removeListener("otp-verified", handleOtpVerified); // Cleanup event listeners
        };
    }, []);

    if (verified) {
        return <VMAgent />;
    }

    return (
        <div className="otp-wrapper">
            <div className="container">
                {showLoader && (
                    <div className="overlay" id="overlay">
                        <div className="loader"></div>
                    </div>
                )}
                <h2 style={{ marginBottom: "1rem" }}>Enter Code to Access Guide Labs</h2>
                <h3>To start, please enter the code displayed on the labs page</h3>
                <div id="inputs" className="inputs">
                    <OtpInput
                        value={otp}
                        onChange={handleOtpChange}
                        numInputs={10}
                        renderInput={(props: any) => <input {...props} />}
                        inputStyle={{ width: '1.5rem', height: '1.5rem', margin: '0.5rem', fontSize: '1.2rem', borderRadius: '0.4rem', border: '1px solid #ccc', textAlign: 'center', }} />
                </div>

                <button
                    disabled={!otp || otp.length !== 10}
                    id="btnCheckOTP"
                    type="button"
                    className="button button1"
                    onClick={handleVerifyOTP}
                    style={{
                        padding: "0.5rem 1.5rem",
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        width: "auto",
                        height: "auto",
                        marginTop: "1.5rem",
                        backgroundColor: "#000",
                        color: "#fff",
                        cursor: !otp || otp.length !== 10 ? "not-allowed" : "pointer",
                        opacity: !otp || otp.length !== 10 ? 0.6 : 1,
                        border: "none",
                        transition: "all 0.3s ease",
                    }}
                >
                    Verify
                </button>

                <div className="error">{error}</div>
            </div>
        </div>
    );
};

export default OTPComponent;