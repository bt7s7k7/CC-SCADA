import * as ts from "typescript"
import * as tstl from "typescript-to-lua"

const date = new Date()
const versionString = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate() + 1}.${date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()}`

class CustomPrinter extends tstl.LuaPrinter {
    /* Override printFile */
    protected printFile(file: tstl.File): ReturnType<tstl.LuaPrinter["printFile"]> {
        const originalResult = super.printFile(file)
        // Add header comment at the top of the file
        return this.createSourceNode(file, [`local version = "${versionString}"\n`, originalResult])
    }
}

const plugin: tstl.Plugin = {
    printer: (program: ts.Program, emitHost: tstl.EmitHost, fileName: string, file: tstl.File) =>
        new CustomPrinter(emitHost, program, fileName).print(file),
}

export default plugin
