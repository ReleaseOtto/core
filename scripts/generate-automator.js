const { TypeScriptFileGenerator, TS_COMMON_PRESET, Logger, typeScriptDefaultModelNameConstraints, typeScriptDefaultPropertyKeyConstraints } = require('@asyncapi/modelina');
const fs = require('fs');
const path = require('path');
const schemaPath = path.resolve(__dirname, '../schemas/automator-options.json');
const schema = require(schemaPath);
Logger.setLogger({
  debug: () => { },
  error: console.error,
  info: console.info,
  warn: console.warn
});
async function generate() {
  const outputDir = path.resolve(__dirname, '../src/models');
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  const generator = new TypeScriptFileGenerator({ 
    modelType: 'class',
    constraints: {
      modelName: (name) => {
        return typeScriptDefaultModelNameConstraints(
          {
            NO_RESERVED_KEYWORDS: (value) => {return value;}
          })(name);
      },
      propertyKey: (name) => {
        return typeScriptDefaultPropertyKeyConstraints(
          {
            NO_RESERVED_KEYWORDS: (value) => {return value;}
          })(name);
      }
    },
    presets: [
      {
        preset: TS_COMMON_PRESET,
        options: { marshalling: true }
      }
    ]
  });
  await generator.generateToFiles(schema, outputDir, {exportType: 'named'});
}

generate();