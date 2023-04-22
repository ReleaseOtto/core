# Otto

This library is build for auto-generation, i.e. something changes version, some action is performed, and the version meta data is then saved either locally or remotely for next time it's time to run again.

## Use cases

- AsyncAPI JSON Schema library updates (completely independent), triggers a re-generation of auto-generated models representing AsyncAPI as parser models.
- AsyncAPI document changes version, triggers a re-generation of libraries enabling 3 lines of code to call. 

## Supported dependencies (version checks)

This stage is all about finding the version of "something" (API version, library version, etc), that will be used to figure out if it's changed. 

Version Retrievers
- github-repository
  - specific branch
  - reading file i.e. package.json
- github-releases
  - specific version match

Version Meta retrievers
- github-repository
  - local file
  - in specific branch

## Actions

This stage is all about performing some action, once it figures out if the version changed.

This could for example be generating code with

- Modelina
- AsyncAPI generator


## Initialize

This stage is used to define a behavior for when the repository of the automation does not yet exist. If the library detects this it helps you set it up based on the configuration.

Initializers:
- GitHub Template
  - This lets you use a GH template as starting point, and then allow you to make additional changes to the repository, before continuing with it's automation.