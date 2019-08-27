const path = require('path');

module.exports = {
    title: 'composer',
    devServer: {
        port: 3000,
        contentBase: path.resolve(__dirname, '../static')
    },
    webOutputDir: path.resolve(__dirname, '../dist/web'),
    electronOutputDir: path.resolve(__dirname, '../dist/electron'),
    electronRendererOutputDir: path.resolve(__dirname, '../dist/electron/renderer'),
    electronMainOutputDir: path.resolve(__dirname, '../dist/electron')
};