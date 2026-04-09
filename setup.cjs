#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function setup() {
  console.log("Setting up the project...");

  console.log("Creating config.js from config.example.js...");
  fs.copyFileSync(
    path.join(__dirname, "example/config.example.js"),
    path.join(__dirname, "config.js"),
  );

  console.log("Creating data and output directories...");

  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });

  fs.mkdirSync(path.join(__dirname, "output"), { recursive: true });

  console.log("Setup completed successfully!");
}

setup();
