import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import './style.css';

const VMAgent = () => {
    const [expanded, setExpanded] = useState(false);

    const guidelines = `
VM Guidelines:
- Do not refresh the browser.
- Save files regularly.
- Use terminal for coding assessments.
- Ensure stable internet connection.
(repeated for demonstration...)
`.repeat(20);

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
                position: "absolute", bottom: "100px", right: "20px", width: "25rem", height: "35rem", padding: "1.5rem 0 1.5rem 2.5rem", backgroundColor: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)", opacity: expanded ? 1 : 0, transform: expanded ? "translateY(0)" : "translateY(20px)",
                pointerEvents: expanded ? "auto" : "none", zIndex: 2, overflow: "hidden"
            }}>
                <h4 style={{ margin: "0 0 10px 0" }}>VM Guidelines</h4>
                <div
                    style={{ overflowY: "auto", maxHeight: "calc(100% - 40px)", paddingRight: "8px" }}
                    className="guidelines-scroll"
                >
                    <pre
                        style={{ fontSize: "13px", whiteSpace: "pre-wrap", margin: 0, }}>
                        {guidelines}
                    </pre>
                </div>
            </div>

            <button
                onClick={() => setExpanded((prev) => !prev)}
                style={{ position: "absolute", bottom: "20px", right: "20px", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)", cursor: "pointer", zIndex: 3, }}
                aria-label={expanded ? "Collapse Agent" : "Open Guidelines"}
            >
                <MessageSquare size={28} />
            </button>
        </div>
    );
};

export default VMAgent;