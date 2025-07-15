import React, { useEffect, useState } from "react";
import { Text, Box } from "ink";
import figlet from "figlet";
import gradient from "gradient-string";
const coolGradient = gradient([
    { color: "#FF00FF", pos: 0 },
    { color: "#FF1493", pos: 0.2 },
    { color: "#FF69B4", pos: 0.4 },
    { color: "#FF0000", pos: 0.6 },
    { color: "#FF4500", pos: 0.8 },
    { color: "#FFD700", pos: 1 },
]);
const fontStyle = {
    font: "Star Wars",
    horizontalLayout: "default",
    verticalLayout: "default",
};
const Header = () => {
    const [header, setHeader] = useState("");
    useEffect(() => {
        figlet.text("Clean Mods", fontStyle, (err, data) => {
            if (err) {
                console.error("Something went wrong with figlet");
                return;
            }
            if (data) {
                const coloredHeader = coolGradient(data);
                setHeader(coloredHeader);
            }
        });
    }, []);
    return (React.createElement(Box, { flexDirection: "column", alignItems: "center", marginBottom: 1 },
        React.createElement(Text, null, header),
        React.createElement(Text, { color: "cyan", bold: true }, "\uD83E\uDDF9 Clean up your node_modules with style \uD83E\uDDF9")));
};
export default Header;
