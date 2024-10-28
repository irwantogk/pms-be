# Project Management System API

## Prerequisites

- Node.js : Ensure that Node.js is installed on your machine.

## Install project dependency pakcages

```
npm install
```

## Configuration

create server_config.json file in the root directory and save
it. Inside that file, add the desired configuration values in
the format KEY:VALUE.

- Configuration| Configuration Key | Description
  |
  | ----------------- | ------------------------------------ |
  | PORT
  | The port number on which project run | options

## Compile Project

Once you are in the project's root directory, you can use the
tsc command with the --watch flag to enable automatic
recompilation when changes are detected. Run the following
command

```
tsc --watch
```

## Run Project

- On local machine run during development

```
nodemon dist/src/main.js
```

- On server after development

```
node dist/src/main.js
```
