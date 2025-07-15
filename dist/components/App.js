import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import { glob } from "glob";
import { execa } from "execa";
import path from "path";
import fs from "fs/promises";
import PackageTable from "./PackageTable.js";
import Header from "./Header.js";
import CompletionSummary from "./CompletionSummary.js";
const App = ({ path: targetPath = process.cwd() }) => {
    const [status, setStatus] = useState("scanning");
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletedCount, setDeletedCount] = useState(0);
    const [removedPackages, setRemovedPackages] = useState([]);
    const [totalSpaceSaved, setTotalSpaceSaved] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const findNodeModules = async () => {
            try {
                const paths = await glob("**/node_modules", {
                    cwd: targetPath,
                    ignore: ["**/node_modules/**/node_modules/**"],
                    absolute: true,
                });
                const packagesInfo = await Promise.all(paths.map(async (modulePath) => {
                    const stats = await fs.stat(modulePath);
                    return {
                        path: modulePath,
                        size: stats.size,
                        modifiedTime: stats.mtime,
                        selected: false,
                    };
                }));
                setPackages(packagesInfo);
                setLoading(false);
            }
            catch (err) {
                setError(`Error scanning directories: ${err instanceof Error ? err.message : String(err)}`);
                setLoading(false);
            }
        };
        findNodeModules();
    }, [targetPath]);
    const handleSelect = (selectedPath) => {
        setPackages((prev) => prev.map((pkg) => pkg.path === selectedPath ? { ...pkg, selected: !pkg.selected } : pkg));
    };
    const handleSelectAll = () => {
        const areAllSelected = packages.every((pkg) => pkg.selected);
        setPackages((prev) => prev.map((pkg) => ({
            ...pkg,
            selected: !areAllSelected,
        })));
    };
    const handleSubmit = () => {
        const selectedPackages = packages.filter((pkg) => pkg.selected);
        if (selectedPackages.length > 0) {
            setIsDeleting(true);
            deleteSelectedPackages(selectedPackages);
        }
    };
    const handleSearch = (term) => {
        setSearchTerm(term);
    };
    const deleteSelectedPackages = async (selectedPackages) => {
        const removed = [];
        let spaceSaved = 0;
        for (const pkg of selectedPackages) {
            try {
                await execa("rm", ["-rf", pkg.path]);
                removed.push({
                    path: pkg.path,
                    size: pkg.size,
                });
                spaceSaved += pkg.size;
                setDeletedCount((prev) => prev + 1);
            }
            catch (err) {
                removed.push({
                    path: pkg.path,
                    size: pkg.size,
                    error: err instanceof Error ? err.message : String(err),
                });
                setError(`Error deleting ${pkg.path}: ${err instanceof Error ? err.message : String(err)}`);
                break;
            }
        }
        setRemovedPackages(removed);
        setTotalSpaceSaved(spaceSaved);
        setStatus("completed");
        setIsDeleting(false);
    };
    const filteredPackages = searchTerm
        ? packages.filter((pkg) => path
            .relative(process.cwd(), pkg.path)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
        : packages;
    return (React.createElement(Box, { flexDirection: "column" },
        React.createElement(Header, null),
        error ? (React.createElement(Text, { color: "red" }, error)) : isDeleting ? (React.createElement(Box, { flexDirection: "column", padding: 1 },
            React.createElement(Text, { color: "yellow" }, "Deleting selected packages..."),
            React.createElement(Text, { color: "green" },
                "Progress: ",
                deletedCount,
                "/",
                packages.filter((pkg) => pkg.selected).length,
                " packages"))) : status === "completed" ? (React.createElement(CompletionSummary, { deletedCount: deletedCount, totalSpaceSaved: totalSpaceSaved, removedPackages: removedPackages })) : (React.createElement(PackageTable, { packages: filteredPackages, loading: loading, onSelect: handleSelect, onSelectAll: handleSelectAll, onSubmit: handleSubmit, onSearch: handleSearch, searchTerm: searchTerm }))));
};
export default App;
