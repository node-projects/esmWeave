import esprima, { ImportDeclaration, ImportExpression, Visitor } from "esprima-next";
import { Context } from "../context.js";

export class JavascriptBundler {
    
    context: Context;
    visitor: Visitor;

    constructor(context: Context) {
        this.context = context;
        this.visitor = new BundleVisitor();
    }

    async bundle(code: string, relativeFileName: string): Promise<string> {
        const ast = esprima.parseModule(code, { range: true });
        const newAst = this.visitor.visit(ast);

        console.log(ast);
        return null;
    }
}

class BundleVisitor extends Visitor {
    override visitImportDeclaration(node: ImportDeclaration) {
        console.log('ImportDeclaration', node)
        return super.visitImportDeclaration(node);
    }

    override visitImportExpression(node: ImportExpression) {
        console.log('ImportExpression', node)
        return super.visitImportExpression(node);
    }
}