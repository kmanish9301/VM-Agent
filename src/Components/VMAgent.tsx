import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import './style.css';

const VMAgent = () => {
    const [expanded, setExpanded] = useState(false);
    const [guidelines, setGuidelines] = useState<{ type: string; step_no?: string; description: string }[]>([]);

    useEffect(() => {
        if (expanded) {
            window.electron?.ipcRenderer.send("expand-agent");
        } else {
            window.electron?.ipcRenderer.send("collapse-agent");
        }
    }, [expanded]);

    useEffect(() => {
        // Listen for guidelines from the main process
        const handleSetGuidelines = (_event: any, receivedGuidelines: { type: string; step_no?: string; description: string }[]) => {
            if (Array.isArray(receivedGuidelines) && receivedGuidelines.length > 0) {
                setGuidelines(receivedGuidelines);
            }
        };

        window.electron?.ipcRenderer.on("set-guidelines", handleSetGuidelines);

        return () => {
            window.electron?.ipcRenderer.removeListener("set-guidelines", handleSetGuidelines);
        };
    }, []);

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
                    <div className="display-flex flex-direction-column custom-scrollbar-wrapper" style={{ rowGap: "1rem" }}>
                        {guidelines?.map((rule, index) => (
                            <div key={index}>
                                {rule?.type === "TITLE" && (
                                    <div style={{ display: "flex", columnGap: "0.5rem", marginBottom: "0.5rem" }}>
                                        <strong>
                                            {`Step ${rule?.step_no}: `}
                                        </strong>
                                        <strong>{rule?.description}</strong>
                                    </div>
                                )}
                                {rule?.type === "PLAIN_TEXT" && <div style={{ marginBottom: "1rem" }}>{rule?.description}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {!expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    style={{ position: "absolute", bottom: "20px", right: "20px", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#2C2C2C", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)", cursor: "pointer", zIndex: 3 }}
                    aria-label="Open Guidelines"
                >
                    <MessageSquare size={28} />
                </button>
            )}
        </div>
    );
};

export default VMAgent;