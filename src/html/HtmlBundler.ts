import { Context } from "../context.js";
import * as htmlParser from "@node-projects/node-html-parser-esm";
import { StringWriter } from "../helper/StringWriter.js";

export class HtmlBundler {

    context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    async bundle(code: string, rootDir: string) {
        const parsed = htmlParser.parse(code, { comment: true });
        await this.#walkHtmlNode(parsed, rootDir);
        let writer = new StringWriter();
        await this.#writeHtmlNode(writer, parsed);
        return writer.getString();
    }

    async #walkHtmlNode(node: htmlParser.Node, rootDir: string) {
        try {
            for (const n of node.childNodes) {
                if (n.localName == 'script') {
                    if (n.attrs.type == 'module') {
                        if (n.attrs.src) {
                            const content = await this.context.readFile(n.attrs.src, rootDir);
                            const bundeled = await this.context.javascriptBundler.bundle(content, n.attrs.src);
                        } else {
                            const bundeled = await this.context.javascriptBundler.bundle(n.textContent, null);
                        }
                    } else if (n.attrs.type == 'importmap') {
                        if (n.attrs.src) {
                            this.#parseImportmap(await this.context.readFile(n.attrs.src, rootDir));
                        } else {
                            this.#parseImportmap(n.textContent);
                        }
                    } else if (!n.attrs.type || n.attrs.type == "text/javascript") {
                        if (n.attrs.src) {
                            //todo minify
                            //todo move to plugin
                            let ct = await this.context.readFile(n.attrs.src, rootDir);
                            n.removeAttribute('src');
                            n.setAttribute('type', 'text/javascript');
                            n.textContent = ct;
                        } else {
                            //todo minify
                        }
                    }
                } else if (n.localName == 'style') {
                    //todo minify
                } else if (n.localName == 'link') {
                    if (n.attrs.rel == 'stylesheet') {
                        if (n.attrs.href) {
                            //todo minify
                            //todo move to plugin
                            let ct = await this.context.readFile(n.attrs.href, rootDir);
                            let styleNode = new htmlParser.HTMLElement('style', {});
                            styleNode.textContent = ct;
                            n.replaceWith(styleNode);
                        }
                    }
                } else {
                    if (n.childNodes) {
                        await this.#walkHtmlNode(n, rootDir)
                    }
                }
            }
        }
        catch (err) {
            console.error('walking html nodes error', err);
        }
    }

    async #writeHtmlNode(writer: StringWriter, node: htmlParser.Node) {
        //debugger;
        if (node.nodeType == 1) {
            if (node.rawTagName) {
                writer.append('<' + node.rawTagName);

                if (node.attributes) {
                    for (const n in node.attributes) {
                        if (node.attributes[n])
                            writer.append(' ' + n + '="' + node.attributes[n] + '"');
                        else
                            writer.append(' ' + n);
                    }
                }
                writer.append('>');
            }
            if (node.childNodes.length) {
                for (const n of node.childNodes) {
                    this.#writeHtmlNode(writer, n);
                }
            }
            if (node.rawTagName && !HtmlBundler.IsSelfClosingElement(node.rawTagName)) {
                writer.append('</' + node.rawTagName + ">");
            }
        } else if (node.nodeType == 3) {
            writer.append(node.textContent);
        }
    }

    #parseImportmap(importmap: string) {
        this.context.importmap = JSON.parse(importmap);
    }

    public static IsSelfClosingElement(tag: string) {
        return tag === 'area' ||
            tag === 'base' ||
            tag === 'br' ||
            tag === 'col' ||
            tag === 'embed' ||
            tag === 'hr' ||
            tag === 'img' ||
            tag === 'input' ||
            tag === 'link' ||
            tag === 'meta' ||
            tag === 'param' ||
            tag === 'source' ||
            tag === 'track' ||
            tag === 'wbr';
    }
}