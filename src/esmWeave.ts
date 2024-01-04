import { Options } from "./options";
import * as path from 'path'
import { Context } from "./context.js";
import { JavascriptBundler } from "./javascript/JavascriptBundler.js";
import { HtmlBundler } from "./html/HtmlBundler.js";

export type bundleType = 'html' | 'jsmodule' | 'cssmodule' | 'jsonmodule' | 'css';

export class EsmWeave {

    javascriptBundler: JavascriptBundler;
    context: Context

    constructor() {
        this.context = new Context(HtmlBundler, JavascriptBundler);
    }

    public async bundle(files: string[], options?: Options) {
        for (const file of files) {
            if (file.endsWith('.html')) {
                const result = await this.#bundleFile(file, 'html', path.dirname(file));
            }
        }
    }

    async #bundleFile(fileName: string, type: bundleType, rootDir: string) {
        switch (type) {
            case 'html': {
                const content = await this.context.readFile(fileName, rootDir);
                const newData = await this.context.htmlBundler.bundle(content, rootDir);
                this.context.writeFile(fileName, rootDir, newData);
                break;
            }
        }
    }
}

export let esmWeave = new EsmWeave();