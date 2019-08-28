# react-transform-tool
Transform tool component for `editor-like` application

## Install
    // Use yarn
    yarn add react-transform-tool

    // Use npm
    npm install react-transform-tool

## Usage

    import React from "react";
    import TransformTool from "react-transform-tool";

    // Col major matrix
    const [value, setValue] = useState([
        1, 0, 0, 
        0, 1, 0,
        0, 0, 1
    ]);

    <TransformTool
        value={value}
        onChange={setValue}
    />



## License
The project is under MIT license