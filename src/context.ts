import { HtmlBundler } from "./html/HtmlBundler";
import { JavascriptBundler } from "./javascript/JavascriptBundler"

import { promises as fs } from 'fs';
import * as path from 'path'

export class Context {

    constructor(htmlBundler: new (context: Context) => HtmlBundler, javascriptBundler: new (context: Context) => JavascriptBundler) {
        this.htmlBundler = new htmlBundler(this);
        this.javascriptBundler = new javascriptBundler(this);
    }

    importmap: {
        imports: Record<string, string>,
        scopes: Record<string, Record<string, string>>
    } = { imports: {}, scopes: {} }

    javascriptBundler: JavascriptBundler;

    htmlBundler: HtmlBundler;

    async readFile(file: string, rootDir: string) {
        try {
            const fnm = path.join(rootDir, file);
            const data = await fs.readFile(fnm, 'utf8');
            return data;
        }
        catch (err) {
            debugger;
            console.error('could not read file', file, err)
            throw err;
        }
    }

    async writeFile(file: string, rootDir: string, data: string) {
        try {
            const fnm = path.join(rootDir, file);
            await fs.writeFile(fnm, data, 'utf8');
        }
        catch (err) {
            debugger;
            console.error('could not write file', file, err)
            throw err;
        }
    }
}