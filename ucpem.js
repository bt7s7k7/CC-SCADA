/// <reference path="./.vscode/config.d.ts" />

const { mkdir } = require("fs/promises")
const { project, join, constants, run } = require("ucpem")

project.prefix("src").res("app")

project.script("craftos", async () => {
    const dataPath = join(constants.projectPath, "data.local")
    const buildPath = join(constants.projectPath, "build")
    await mkdir(dataPath).catch((err) => { if (err.code != "EEXIST") { throw err } })
    //await copyFile(join(constants.projectPath, "polyfill.lua"), join(buildPath, "polyfill.lua"))

    //await run(`craftos -d ${JSON.stringify(dataPath)} --mount-rw build=build --gui --script "build/polyfill.lua" --script "build/app.lua"`)
    await run(`craftos -d ${JSON.stringify(dataPath)} --mount-rw build=${buildPath} --gui`)
}, { argc: NaN })
