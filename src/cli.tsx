#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./components/App.js";

const cli = meow(
  `
  Usage
    $ clean-pack [path]

  Options
    --help     Show this help message
    --version  Show version number

  Examples
    $ clean-pack
    $ clean-pack ./my-project
`,
  {
    importMeta: import.meta,
    flags: {},
  }
);

render(<App path={cli.input[0]} />);
