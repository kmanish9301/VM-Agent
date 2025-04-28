import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import "./style.css";
import axios from "axios";

const OTPComponent = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleOtpChange = (value: string) => {
        if (value.length <= 5 && /^[0-9]*$/.test(value)) {
            setOtp(value);
        }
    };

    const handleVerifyOTP = async () => {
        setError("");
        setShowLoader(true);

        try {
            const response = await axios.get(`https://dev.makemylabs.in/v1/template-lab-instructions`, {
                params: { unique_code: otp }
            });

            const data = response.data;
            console.log(" data", data);

            const guidelines = data.lab_instructions && data.lab_instructions.length > 0
                ? data.lab_instructions
                : [];

            window.electron.ipcRenderer.send("verify-otp", {
                otp,
                guidelines: Array.isArray(guidelines) ? guidelines : [String(guidelines)]
            });

        } catch (error: any) {
            if (error.response) {
                setError(error.response.data?.message || "Invalid code. Please try again.");
            } else if (error.request) {
                setError("No response from server. Please try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setShowLoader(false);
        }
    };

    useEffect(() => {
        const handleOtpError = (_event: any, data: string) => {
            setError(data);
            setShowLoader(false);
        };

        const handleOtpVerified = () => {
            setVerified(true);
            setShowLoader(false);
        };

        window.electron.ipcRenderer.on("otp-error", handleOtpError);
        window.electron.ipcRenderer.on("otp-verified", handleOtpVerified);

        return () => {
            window.electron.ipcRenderer.removeListener("otp-error", handleOtpError);
            window.electron.ipcRenderer.removeListener("otp-verified", handleOtpVerified);
        };
    }, []);

    return (
        <div className="otp-wrapper">
            <div className="container">
                {showLoader && (
                    <div className="overlay" id="overlay">
                        <div className="loader"></div>
                    </div>
                )}

                {verified ? (
                    <div style={{ textAlign: "center" }}>
                        <h2>Verified Successfully!</h2>
                        <p>VM Agent has been launched.</p>
                    </div>
                ) : (
                    <>
                        <h2 style={{ marginBottom: "1rem" }}>Enter Code to Access Guide Labs</h2>
                        <h3>To start, please enter the code displayed on the labs page</h3>
                        <div id="inputs" className="inputs">
                            <OtpInput
                                value={otp}
                                onChange={handleOtpChange}
                                numInputs={5}
                                renderInput={(props: any) => <input {...props} />}
                                inputStyle={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    margin: '0.5rem',
                                    fontSize: '1.2rem',
                                    borderRadius: '0.4rem',
                                    border: '1px solid #ccc',
                                    textAlign: 'center',
                                }}
                            />
                        </div>

                        <button
                            disabled={!otp || otp.length !== 5}
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
                                cursor: !otp || otp.length !== 5 ? "not-allowed" : "pointer",
                                opacity: !otp || otp.length !== 5 ? 0.6 : 1,
                                border: "none",
                                transition: "all 0.3s ease",
                            }}
                        >
                            Verify
                        </button>

                        <div className="error">{error}</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OTPComponent;