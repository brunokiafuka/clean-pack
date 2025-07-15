import React from "react";
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
  onSearch: (term: string) => void;
  searchTerm: string;
}

const VIEWPORT_HEIGHT = 15;

const PackageTable = ({
  packages,
  loading,
  onSelect,
  onSelectAll,
  onSubmit,
  onSearch,
  searchTerm,
}: Props) => {
  const [cursorIndex, setCursorIndex] = React.useState(0);
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [scrollOffset, setScrollOffset] = React.useState(0);

  const updateScrollOffset = (newCursorIndex: number) => {
    if (newCursorIndex < scrollOffset) {
      setScrollOffset(newCursorIndex);
    } else if (newCursorIndex >= scrollOffset + VIEWPORT_HEIGHT) {
      setScrollOffset(newCursorIndex - VIEWPORT_HEIGHT + 1);
    }
  };

  useInput((input: string, key: any) => {
    if (isSearchMode) {
      if (key.return || key.escape) {
        setIsSearchMode(false);
      } else if (key.backspace || key.delete) {
        onSearch(searchTerm.slice(0, -1));
      } else if (input && !key.ctrl && !key.meta) {
        onSearch(searchTerm + input);
      }
      return;
    }

    if (packages.length === 0) return;

    if (key.upArrow) {
      const newIndex = cursorIndex > 0 ? cursorIndex - 1 : packages.length - 1;
      setCursorIndex(newIndex);
      updateScrollOffset(newIndex);
    } else if (key.downArrow) {
      const newIndex = cursorIndex < packages.length - 1 ? cursorIndex + 1 : 0;
      setCursorIndex(newIndex);
      updateScrollOffset(newIndex);
    } else if (input === "a") {
      onSelectAll();
    } else if (key.return) {
      onSubmit();
    } else if (input === " ") {
      onSelect(packages[cursorIndex].path);
    } else if (input === "/") {
      setIsSearchMode(true);
    }
  });

  React.useEffect(() => {
    setCursorIndex(0);
    setScrollOffset(0);
  }, [packages.length]);

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

  if (packages.length === 0 && !searchTerm) {
    return <Text color="yellow">No node_modules directories found.</Text>;
  }

  if (packages.length === 0 && searchTerm) {
    return <Text color="yellow">No matches found for "{searchTerm}"</Text>;
  }

  const totalSize = packages.reduce((acc, pkg) => acc + pkg.size, 0);
  const selectedSize = packages
    .filter((pkg) => pkg.selected)
    .reduce((acc, pkg) => acc + pkg.size, 0);

  const visiblePackages = packages.slice(
    scrollOffset,
    scrollOffset + VIEWPORT_HEIGHT
  );

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Select packages to remove:</Text>
      </Box>

      {/* Search Input */}
      <Box marginBottom={1}>
        <Text color={isSearchMode ? "blue" : "gray"}>
          Search: {searchTerm}
          {isSearchMode ? "█" : ""}
        </Text>
      </Box>

      {/* Scroll Info */}
      {packages.length > VIEWPORT_HEIGHT && (
        <Box marginBottom={1}>
          <Text dimColor>
            Showing {scrollOffset + 1}-
            {Math.min(scrollOffset + VIEWPORT_HEIGHT, packages.length)} of{" "}
            {packages.length} packages
          </Text>
        </Box>
      )}

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
      {visiblePackages.map((pkg, index) => {
        const actualIndex = index + scrollOffset;
        return (
          <Box key={pkg.path}>
            <Box width={4}>
              <Text color={pkg.selected ? "green" : undefined}>
                {pkg.selected ? figures.radioOn : figures.radioOff}
              </Text>
            </Box>
            <Box width={50}>
              <Text color={actualIndex === cursorIndex ? "blue" : undefined}>
                {actualIndex === cursorIndex ? "❯ " : "  "}
                {relative(process.cwd(), pkg.path)}
              </Text>
            </Box>
            <Box width={15}>
              <Text color={actualIndex === cursorIndex ? "blue" : "cyan"}>
                {prettyBytes(pkg.size)}
              </Text>
            </Box>
            <Box width={25}>
              <Text dimColor={actualIndex !== cursorIndex}>
                {formatDistanceToNow(pkg.modifiedTime, { addSuffix: true })}
              </Text>
            </Box>
          </Box>
        );
      })}

      <Box marginTop={1} flexDirection="column">
        <Text>
          Total size: {prettyBytes(totalSize)} • Selected:{" "}
          {prettyBytes(selectedSize)} (
          {packages.filter((p) => p.selected).length} packages)
        </Text>
        <Text dimColor>
          Press <Text bold>space</Text> to select • <Text bold>a</Text> to
          select/deselect all • <Text bold>enter</Text> to confirm •{" "}
          <Text bold>/</Text> to search
        </Text>
      </Box>
    </Box>
  );
};

export default PackageTable;
