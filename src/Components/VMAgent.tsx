import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import './style.css';

const VMAgent = () => {
    const [expanded, setExpanded] = useState(false);

    const guidelines = [
        "Do not refresh the browser.",
        "Save files regularly.",
        "Use terminal for coding assessments.",
        "Ensure stable internet connection.",
        "Do not close the agent window.",
        "All activity may be logged.",
        "Keep an eye on time limits.",
        "Seek help only when permitted.",
        "Complete each task before moving on.",
        "Avoid switching to unrelated tabs/apps.",
    ];

    useEffect(() => {
        if (expanded) {
            window.electron?.ipcRenderer.send("expand-agent");
        } else {
            window.electron?.ipcRenderer.send("collapse-agent");
        }
    }, [expanded]);

    return (
        <div style={{ width: "100%", height: "100%", padding: "20px", boxSizing: "border-box", position: "relative", fontFamily: "sans-serif" }}>
            <div style={{
                position: "absolute", bottom: "40px", right: "20px", width: "30rem", height: "35rem", padding: "1.5rem 0 1.5rem 2.5rem", backgroundColor: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)", opacity: expanded ? 1 : 0, transform: expanded ? "translateY(0)" : "translateY(20px)",
                pointerEvents: expanded ? "auto" : "none", zIndex: 2, overflow: "hidden", borderRadius: "0.5rem"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h4 style={{ margin: 0 }}>VM Guidelines</h4>
                    <button
                        onClick={() => setExpanded(false)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                        aria-label="Close Guidelines"
                    >
                        <X size={23} />
                    </button>
                </div>
                <div
                    style={{ overflowY: "auto", maxHeight: "calc(100% - 40px)", paddingRight: "8px" }}
                    className="guidelines-scroll"
                >
                    <ul
                        style={{ padding: "1rem 0 1rem 1rem", margin: 0, fontSize: "1rem", lineHeight: "1.3rem", listStyleType: "disc", }}>
                        {guidelines.map((text, index) => (
                            <li key={index} style={{ marginBottom: "0.75rem" }}>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {!expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    style={{ position: "absolute", bottom: "20px", right: "20px", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#2C2C2C", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)", cursor: "pointer", zIndex: 3, }}
                    aria-label="Open Guidelines"
                >
                    <MessageSquare size={28} />
                </button>
            )}
        </div>
    );
};

export default VMAgent;