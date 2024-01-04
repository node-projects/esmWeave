# esmWeave
A Bundler for ES6 Code wich uses importmaps

# planed features
- bundle multiple HTML files, find common used same files, bundle to different files
- addons for example for LIT, BaseCustomWebcomponent, ...
- support import attributes (treat import asstertions the same way)


# todo
- visitor for esprima (look at esprima.net)
- write back of AST to JS code (look at esprima.net)
- patch esprima-next with patches from esprima.net
- parse javascript, and refactor imports to code like in cc.ts
- make strategy for the resulting importname

- make css imports
- make json imports

- extension interface for each import (and how to rewrite)
- ignor specific files
- ignore https://github.com/WICG/import-maps?tab=readme-ov-file#multiple-versions-of-the-same-module for the moment