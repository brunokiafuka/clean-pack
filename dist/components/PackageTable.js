import React from "react";
import { Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";
import prettyBytes from "pretty-bytes";
import { formatDistanceToNow } from "date-fns";
import figures from "figures";
import { relative } from "path";
const VIEWPORT_HEIGHT = 15;
const PackageTable = ({ packages, loading, onSelect, onSelectAll, onSubmit, onSearch, searchTerm, }) => {
    const [cursorIndex, setCursorIndex] = React.useState(0);
    const [isSearchMode, setIsSearchMode] = React.useState(false);
    const [scrollOffset, setScrollOffset] = React.useState(0);
    const updateScrollOffset = (newCursorIndex) => {
        if (newCursorIndex < scrollOffset) {
            setScrollOffset(newCursorIndex);
        }
        else if (newCursorIndex >= scrollOffset + VIEWPORT_HEIGHT) {
            setScrollOffset(newCursorIndex - VIEWPORT_HEIGHT + 1);
        }
    };
    useInput((input, key) => {
        if (isSearchMode) {
            if (key.return || key.escape) {
                setIsSearchMode(false);
            }
            else if (key.backspace || key.delete) {
                onSearch(searchTerm.slice(0, -1));
            }
            else if (input && !key.ctrl && !key.meta) {
                onSearch(searchTerm + input);
            }
            return;
        }
        if (packages.length === 0)
            return;
        if (key.upArrow) {
            const newIndex = cursorIndex > 0 ? cursorIndex - 1 : packages.length - 1;
            setCursorIndex(newIndex);
            updateScrollOffset(newIndex);
        }
        else if (key.downArrow) {
            const newIndex = cursorIndex < packages.length - 1 ? cursorIndex + 1 : 0;
            setCursorIndex(newIndex);
            updateScrollOffset(newIndex);
        }
        else if (input === "a") {
            onSelectAll();
        }
        else if (key.return) {
            onSubmit();
        }
        else if (input === " ") {
            onSelect(packages[cursorIndex].path);
        }
        else if (input === "/") {
            setIsSearchMode(true);
        }
    });
    React.useEffect(() => {
        setCursorIndex(0);
        setScrollOffset(0);
    }, [packages.length]);
    if (loading) {
        return (React.createElement(Box, null,
            React.createElement(Text, { color: "yellow" },
                React.createElement(Spinner, { type: "dots" }),
                " Scanning for node_modules...")));
    }
    if (packages.length === 0 && !searchTerm) {
        return React.createElement(Text, { color: "yellow" }, "No node_modules directories found.");
    }
    if (packages.length === 0 && searchTerm) {
        return React.createElement(Text, { color: "yellow" },
            "No matches found for \"",
            searchTerm,
            "\"");
    }
    const totalSize = packages.reduce((acc, pkg) => acc + pkg.size, 0);
    const selectedSize = packages
        .filter((pkg) => pkg.selected)
        .reduce((acc, pkg) => acc + pkg.size, 0);
    const visiblePackages = packages.slice(scrollOffset, scrollOffset + VIEWPORT_HEIGHT);
    return (React.createElement(Box, { flexDirection: "column" },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true }, "Select packages to remove:")),
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { color: isSearchMode ? "blue" : "gray" },
                "Search: ",
                searchTerm,
                isSearchMode ? "█" : "")),
        packages.length > VIEWPORT_HEIGHT && (React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { dimColor: true },
                "Showing ",
                scrollOffset + 1,
                "-",
                Math.min(scrollOffset + VIEWPORT_HEIGHT, packages.length),
                " of",
                " ",
                packages.length,
                " packages"))),
        React.createElement(Box, null,
            React.createElement(Box, { width: 4 },
                React.createElement(Text, { bold: true }, "[ ]")),
            React.createElement(Box, { width: 50 },
                React.createElement(Text, { bold: true }, "Path")),
            React.createElement(Box, { width: 15 },
                React.createElement(Text, { bold: true }, "Size")),
            React.createElement(Box, { width: 25 },
                React.createElement(Text, { bold: true }, "Last Modified"))),
        visiblePackages.map((pkg, index) => {
            const actualIndex = index + scrollOffset;
            return (React.createElement(Box, { key: pkg.path },
                React.createElement(Box, { width: 4 },
                    React.createElement(Text, { color: pkg.selected ? "green" : undefined }, pkg.selected ? figures.radioOn : figures.radioOff)),
                React.createElement(Box, { width: 50 },
                    React.createElement(Text, { color: actualIndex === cursorIndex ? "blue" : undefined },
                        actualIndex === cursorIndex ? "❯ " : "  ",
                        relative(process.cwd(), pkg.path))),
                React.createElement(Box, { width: 15 },
                    React.createElement(Text, { color: actualIndex === cursorIndex ? "blue" : "cyan" }, prettyBytes(pkg.size))),
                React.createElement(Box, { width: 25 },
                    React.createElement(Text, { dimColor: actualIndex !== cursorIndex }, formatDistanceToNow(pkg.modifiedTime, { addSuffix: true })))));
        }),
        React.createElement(Box, { marginTop: 1, flexDirection: "column" },
            React.createElement(Text, null,
                "Total size: ",
                prettyBytes(totalSize),
                " \u2022 Selected:",
                " ",
                prettyBytes(selectedSize),
                " (",
                packages.filter((p) => p.selected).length,
                " packages)"),
            React.createElement(Text, { dimColor: true },
                "Press ",
                React.createElement(Text, { bold: true }, "space"),
                " to select \u2022 ",
                React.createElement(Text, { bold: true }, "a"),
                " to select/deselect all \u2022 ",
                React.createElement(Text, { bold: true }, "enter"),
                " to confirm \u2022",
                " ",
                React.createElement(Text, { bold: true }, "/"),
                " to search"))));
};
export default PackageTable;
