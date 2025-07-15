import React from "react";
import { Text, Box } from "ink";
import path from "path";
import prettyBytes from "pretty-bytes";

interface RemovedPackage {
  path: string;
  size: number;
  error?: string;
}

interface Props {
  deletedCount: number;
  totalSpaceSaved: number;
  removedPackages: RemovedPackage[];
}

const CompletionSummary = ({
  deletedCount,
  totalSpaceSaved,
  removedPackages,
}: Props) => (
  <Box flexDirection="column" padding={1}>
    <Text color="green" bold>
      ✨ Cleanup completed!
    </Text>
    <Text>Successfully removed {deletedCount} node_modules directories.</Text>
    <Text color="green" bold>
      Total space saved: {prettyBytes(totalSpaceSaved)}
    </Text>

    <Box marginY={1}>
      <Text bold>Removed packages:</Text>
    </Box>

    {removedPackages.map((pkg, index) => (
      <Box key={pkg.path} marginLeft={1}>
        <Text>
          {index + 1}. {path.relative(process.cwd(), pkg.path)}
          {" - "}
          <Text color="cyan">{prettyBytes(pkg.size)}</Text>
          {pkg.error && <Text color="red"> (Error: {pkg.error})</Text>}
        </Text>
      </Box>
    ))}
  </Box>
);

export default CompletionSummary;
