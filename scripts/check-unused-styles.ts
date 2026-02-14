#!/usr/bin/env bun
// oxlint-disable no-console

import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules") {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function checkUnusedStyles(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");

  // Find createStyles starting position - pattern: createStyles((t) => ({
  const createMatch = content.match(/createStyles\s*\(\s*\([^)]*\)\s*=>\s*\(\s*\{/);
  if (!createMatch || !createMatch.index) return [];

  // Find the variable name it's assigned to (e.g., "const s = useStyles()")
  const varMatch = content
    .slice(0, createMatch.index)
    .match(/const\s+(\w+)\s*=\s*useStyles\s*\(\s*\)\s*;?\s*$/m);
  if (!varMatch) return [];
  const varName = varMatch[1];

  // Find matching closing brace
  let depth = 1;
  let i = createMatch.index + createMatch[0].length;
  while (i < content.length && depth > 0) {
    if (content[i] === "{") depth++;
    if (content[i] === "}") depth--;
    i++;
  }

  if (depth !== 0) return []; // Unbalanced braces

  const stylesBlock = content.slice(createMatch.index + createMatch[0].length, i - 1);

  // Extract top-level style names (keys at the root level of the object)
  const styleNames: string[] = [];
  const lines = stylesBlock.split("\n");
  depth = 0;

  for (const line of lines) {
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    if (depth === 0) {
      const match = line.match(/^\s*(\w+)\s*:/);
      if (match) {
        styleNames.push(match[1]);
      }
    }

    depth += openBraces - closeBraces;
  }

  const unused: string[] = [];

  for (const styleName of styleNames) {
    // Check if style is used outside createStyles
    const beforeStyleSheet = content.slice(0, createMatch.index);
    const afterStyleSheet = content.slice(i);

    // Look for varName.styleName or varName[styleName] (e.g., s.root or s['root'])
    const usageRegex = new RegExp(
      `${varName}\\.${styleName}|${varName}\\[['"\`]${styleName}['"\`]\\]`,
    );
    if (!usageRegex.test(beforeStyleSheet + afterStyleSheet)) {
      unused.push(styleName);
    }
  }

  return unused;
}

const srcDir = join(import.meta.dir, "..", "src");
const files = getAllFiles(srcDir);

console.log(`Checking ${files.length} files...`);

let hasUnusedStyles = false;

for (const file of files) {
  const unused = checkUnusedStyles(file);
  if (unused.length > 0) {
    console.error(`\n❌ ${file.replace(process.cwd(), ".")}`);
    for (const styleName of unused) {
      console.error(`   - Unused style: ${styleName}`);
    }
    hasUnusedStyles = true;
  }
}

if (hasUnusedStyles) {
  console.error("\n❌ Found unused styles\n");
  process.exit(1);
}

console.log("✅ No unused styles found");
