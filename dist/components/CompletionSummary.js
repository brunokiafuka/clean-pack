import React from "react";
import { Text, Box } from "ink";
import path from "path";
import prettyBytes from "pretty-bytes";
const CompletionSummary = ({ deletedCount, totalSpaceSaved, removedPackages, }) => (React.createElement(Box, { flexDirection: "column", padding: 1 },
    React.createElement(Text, { color: "green", bold: true }, "\u2728 Cleanup completed!"),
    React.createElement(Text, null,
        "Successfully removed ",
        deletedCount,
        " node_modules directories."),
    React.createElement(Text, { color: "green", bold: true },
        "Total space saved: ",
        prettyBytes(totalSpaceSaved)),
    React.createElement(Box, { marginY: 1 },
        React.createElement(Text, { bold: true }, "Removed packages:")),
    removedPackages.map((pkg, index) => (React.createElement(Box, { key: pkg.path, marginLeft: 1 },
        React.createElement(Text, null,
            index + 1,
            ". ",
            path.relative(process.cwd(), pkg.path),
            " - ",
            React.createElement(Text, { color: "cyan" }, prettyBytes(pkg.size)),
            pkg.error && React.createElement(Text, { color: "red" },
                " (Error: ",
                pkg.error,
                ")")))))));
export default CompletionSummary;
