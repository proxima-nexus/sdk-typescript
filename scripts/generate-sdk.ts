// scripts/generate-sdk.ts
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const openapiYamlPath = require.resolve('@proxima-nexus/openapi/openapi.yaml');
const generatedDir = path.join(__dirname, '../generated');
const srcDir = path.join(__dirname, '../src');

// Step 1: Generate SDK
console.log('Generating SDK from OpenAPI spec...');
if (fs.existsSync(generatedDir)) {
  fs.rmSync(generatedDir, { recursive: true });
}
fs.mkdirSync(generatedDir, { recursive: true });

const additionalProperties = [
  'withSeparateModelsAndApi=true',
  'modelPackage=models',
  'apiPackage=api',
  'enumPropertyNaming=original',
  'supportsES6=true',
  'withInterfaces=true',
  'stringEnums=true'
].join(',');

execSync(
  `npx @openapitools/openapi-generator-cli generate -i "${openapiYamlPath}" -g typescript-axios -o "${generatedDir}" --additional-properties=${additionalProperties}`,
  { stdio: 'inherit' }
);

// Step 2: Remove unnecessary files
console.log('Removing unnecessary files...');
const filesToRemove = [
  'docs',
  'git_push.sh',
  '.npmignore',
  '.openapi-generator-ignore',
  '.openapi-generator',
  'api.ts',
  'index.ts'
];

filesToRemove.forEach(file => {
  const filePath = path.join(generatedDir, file);
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true });
  }
});

// Step 3: Post-process configuration.ts
console.log('Post-processing configuration.ts...');
const configPath = path.join(generatedDir, 'configuration.ts');
if (fs.existsSync(configPath)) {
  let content = fs.readFileSync(configPath, 'utf-8');
  
  // Update apiKey type to support function types
  content = content.replace(
    /apiKey\?: string;/g,
    'apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);'
  );
  
  fs.writeFileSync(configPath, content);
}

// Step 4: Post-process common.ts
console.log('Post-processing common.ts...');
const commonPath = path.join(generatedDir, 'common.ts');
if (fs.existsSync(commonPath)) {
  let content = fs.readFileSync(commonPath, 'utf-8');
  
  // Remove unused auth functions - match complete function blocks
  const authFunctions = ['setBasicAuthToObject', 'setBearerAuthToObject', 'setOAuthToObject', 'setAWSv4ToObject'];
  authFunctions.forEach(funcName => {
    // Match: export const funcName = ... { ... } (handles nested braces)
    const funcStart = content.indexOf(`export const ${funcName}`);
    if (funcStart === -1) return;
    
    // Find matching closing brace
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let i = funcStart;
    
    // Find opening brace
    while (i < content.length && content[i] !== '{') i++;
    if (i >= content.length) return;
    
    braceCount = 1;
    i++;
    
    // Find matching closing brace
    while (i < content.length && braceCount > 0) {
      const char = content[i];
      const prevChar = i > 0 ? content[i - 1] : '';
      
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
      } else if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }
      i++;
    }
    
    // Remove function and trailing whitespace
    let endPos = i;
    while (endPos < content.length && /[\s;]/.test(content[endPos])) endPos++;
    content = content.slice(0, funcStart) + content.slice(endPos);
  });
  
  // Clean up extra newlines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(commonPath, content);
}

// Step 5: Copy files to src/
console.log('Copying files to src/...');

// Copy models
const srcModelsDir = path.join(srcDir, 'models');
if (fs.existsSync(srcModelsDir)) {
  fs.rmSync(srcModelsDir, { recursive: true });
}
fs.cpSync(path.join(generatedDir, 'models'), srcModelsDir, { recursive: true });

// Copy API clients
const srcApiDir = path.join(srcDir, 'api');
if (fs.existsSync(srcApiDir)) {
  fs.rmSync(srcApiDir, { recursive: true });
}
fs.cpSync(path.join(generatedDir, 'api'), srcApiDir, { recursive: true });

// Copy base files
['base.ts', 'common.ts', 'configuration.ts'].forEach(file => {
  const src = path.join(generatedDir, file);
  const dest = path.join(srcDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// Step 6: Simplify API method names (remove Controller prefix)
console.log('Simplifying API method names...');
const apiFiles = ['event-api.ts', 'user-api.ts', 'group-api.ts'];
const controllerPrefixes = ['eventController', 'userController', 'groupController'];

apiFiles.forEach(apiFile => {
  const apiFilePath = path.join(srcApiDir, apiFile);
  if (!fs.existsSync(apiFilePath)) return;
  
  let content = fs.readFileSync(apiFilePath, 'utf-8');
  const controllerPrefix = controllerPrefixes.find(prefix => content.includes(prefix));
  
  if (controllerPrefix) {
    // Find all method names and create replacement map
    const methodMap: Record<string, string> = {};
    const methodRegex = new RegExp(`\\b${controllerPrefix}([A-Z]\\w*)`, 'g');
    const matches = content.matchAll(methodRegex);
    
    for (const match of matches) {
      const fullName = match[0];
      const methodName = match[1];
      const simplifiedName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
      methodMap[fullName] = simplifiedName;
    }
    
    // Replace all occurrences
    Object.entries(methodMap).forEach(([oldName, newName]) => {
      content = content.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
      
      // Replace in operationServerMap references
      const apiClass = apiFile.replace('-api.ts', '');
      const apiClassName = apiClass.charAt(0).toUpperCase() + apiClass.slice(1) + 'Api';
      content = content.replace(
        new RegExp(`${apiClassName}\\.${oldName}`, 'g'),
        `${apiClassName}.${newName}`
      );
    });
    
    fs.writeFileSync(apiFilePath, content);
    console.log(`  - Simplified ${apiFile}: ${Object.keys(methodMap).length} methods`);
  }
});

console.log('✓ SDK generated and simplified');
console.log('  - src/models/ (DTOs)');
console.log('  - src/api/ (API clients)');
console.log('  - src/base.ts, src/common.ts, src/configuration.ts');
