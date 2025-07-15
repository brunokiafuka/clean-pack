import React, { FC } from "react";
import { Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";
import prettyBytes from "pretty-bytes";
import { formatDistanceToNow } from "date-fns";
import figures from "figures";
import { relative } from "path";

interface Package {
  path: string;
  size: number;
  modifiedTime: Date;
  selected: boolean;
}

interface Props {
  packages: Package[];
  loading: boolean;
  onSelect: (path: string) => void;
  onSelectAll: () => void;
  onSubmit: () => void;
}

const PackageTable = ({
  packages,
  loading,
  onSelect,
  onSelectAll,
  onSubmit,
}: Props) => {
  useInput((input: string, key: any) => {
    if (input === "a") {
      onSelectAll();
    } else if (key.return) {
      onSubmit();
    } else if (input === " " && packages.length > 0) {
      onSelect(packages[0].path);
    }
  });

  if (loading) {
    return (
      <Box>
        <Text color="yellow">
          <Spinner type="dots" />
          {" Scanning for node_modules..."}
        </Text>
      </Box>
    );
  }

  if (packages.length === 0) {
    return <Text color="yellow">No node_modules directories found.</Text>;
  }

  const totalSize = packages.reduce((acc, pkg) => acc + pkg.size, 0);
  const selectedSize = packages
    .filter((pkg) => pkg.selected)
    .reduce((acc, pkg) => acc + pkg.size, 0);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Select packages to remove:</Text>
      </Box>

      {/* Table Header */}
      <Box>
        <Box width={4}>
          <Text bold>[ ]</Text>
        </Box>
        <Box width={50}>
          <Text bold>Path</Text>
        </Box>
        <Box width={15}>
          <Text bold>Size</Text>
        </Box>
        <Box width={25}>
          <Text bold>Last Modified</Text>
        </Box>
      </Box>

      {/* Table Rows */}
      {packages.map((pkg) => (
        <Box key={pkg.path}>
          <Box width={4}>
            <Text color={pkg.selected ? "green" : undefined}>
              {pkg.selected ? figures.radioOn : figures.radioOff}
            </Text>
          </Box>
          <Box width={50}>
            <Text>{relative(process.cwd(), pkg.path)}</Text>
          </Box>
          <Box width={15}>
            <Text color="cyan">{prettyBytes(pkg.size)}</Text>
          </Box>
          <Box width={25}>
            <Text dimColor>
              {formatDistanceToNow(pkg.modifiedTime, { addSuffix: true })}
            </Text>
          </Box>
        </Box>
      ))}

      <Box marginTop={1} flexDirection="column">
        <Text>
          Selected size: {prettyBytes(selectedSize)} of {prettyBytes(totalSize)}{" "}
          ({((selectedSize / totalSize) * 100).toFixed(1)}%)
        </Text>
        <Text dimColor>
          Press <Text bold>A</Text> to select/deselect all •
          <Text bold>Space</Text> to toggle •<Text bold>Enter</Text> to confirm
        </Text>
      </Box>
    </Box>
  );
};

export default PackageTable;
