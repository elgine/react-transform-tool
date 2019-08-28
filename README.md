# react-transform-tool

![travis-ci](https://www.travis-ci.org/elgine/react-transform-tool.svg?branch=master)
![npm](https://img.shields.io/npm/v/react-transform-tool.svg?style=flat)

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
        size={{
            width: 120,
            height: 120
        }}
        offset={{
            left: 0,
            top: 0
        }}
        classeNames={{
            root: '',
            anchor: {
                base: '',
                center: '',
                rotator: ''
            }
        }}
        styles={{
            root: {},
            anchor: {
                base: {
                    
                },
                center: {

                },
                rotator: {

                }
            }
        }}
    />



## License
The project is under MIT license