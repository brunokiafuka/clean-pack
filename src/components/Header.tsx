import React, { FC, useEffect, useState } from "react";
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
} as const;

const Header = () => {
  const [header, setHeader] = useState<string>("");

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

  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      <Text>{header}</Text>
      <Text color="cyan" bold>
        🧹 Clean up your node_modules with style 🧹
      </Text>
    </Box>
  );
};

export default Header;
