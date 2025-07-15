import React, { FC, useState, useEffect } from "react";
import { Text, Box } from "ink";
import { glob } from "glob";
import { execa } from "execa";
import path from "path";
import fs from "fs/promises";
import prettyBytes from "pretty-bytes";
import PackageTable from "./PackageTable.js";
import Header from "./Header.js";
import CompletionSummary from "./CompletionSummary.js";

interface Props {
  path?: string;
}

interface Package {
  path: string;
  size: number;
  modifiedTime: Date;
  selected: boolean;
}

interface RemovedPackage {
  path: string;
  size: number;
  error?: string;
}

const App = ({ path: targetPath = process.cwd() }: Props) => {
  const [status, setStatus] = useState<string>("scanning");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
  const [removedPackages, setRemovedPackages] = useState<RemovedPackage[]>([]);
  const [totalSpaceSaved, setTotalSpaceSaved] = useState(0);

  useEffect(() => {
    const findNodeModules = async () => {
      try {
        const paths = await glob("**/node_modules", {
          cwd: targetPath,
          ignore: ["**/node_modules/**/node_modules/**"],
          absolute: true,
        });

        const packagesInfo = await Promise.all(
          paths.map(async (modulePath) => {
            const stats = await fs.stat(modulePath);
            return {
              path: modulePath,
              size: stats.size,
              modifiedTime: stats.mtime,
              selected: false,
            };
          })
        );

        setPackages(packagesInfo);
        setLoading(false);
      } catch (err) {
        setError(
          `Error scanning directories: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setLoading(false);
      }
    };

    findNodeModules();
  }, [targetPath]);

  const handleSelect = (selectedPath: string) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.path === selectedPath ? { ...pkg, selected: !pkg.selected } : pkg
      )
    );
  };

  const handleSelectAll = () => {
    const areAllSelected = packages.every((pkg) => pkg.selected);
    setPackages((prev) =>
      prev.map((pkg) => ({
        ...pkg,
        selected: !areAllSelected,
      }))
    );
  };

  const handleSubmit = () => {
    const selectedPackages = packages.filter((pkg) => pkg.selected);
    if (selectedPackages.length > 0) {
      setIsDeleting(true);
      deleteSelectedPackages(selectedPackages);
    }
  };

  const deleteSelectedPackages = async (selectedPackages: Package[]) => {
    const removed: RemovedPackage[] = [];
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
      } catch (err) {
        removed.push({
          path: pkg.path,
          size: pkg.size,
          error: err instanceof Error ? err.message : String(err),
        });
        setError(
          `Error deleting ${pkg.path}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        break;
      }
    }

    setRemovedPackages(removed);
    setTotalSpaceSaved(spaceSaved);
    setStatus("completed");
    setIsDeleting(false);
  };

  return (
    <Box flexDirection="column">
      <Header />
      {error ? (
        <Text color="red">{error}</Text>
      ) : isDeleting ? (
        <Box flexDirection="column" padding={1}>
          <Text color="yellow">Deleting selected packages...</Text>
          <Text color="green">
            Progress: {deletedCount}/
            {packages.filter((pkg) => pkg.selected).length} packages
          </Text>
        </Box>
      ) : status === "completed" ? (
        <CompletionSummary
          deletedCount={deletedCount}
          totalSpaceSaved={totalSpaceSaved}
          removedPackages={removedPackages}
        />
      ) : (
        <PackageTable
          packages={packages}
          loading={loading}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
};

export default App;
