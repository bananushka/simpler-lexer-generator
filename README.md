# simpler-lexer-generator
A simple lexer generator, that generates lexer rules from a subset of EBNF

## Installation
Via NPM:
```sh
npm install simpler-lexer-generator
```

## Usage
All examples are written in ES-2015.

```js
import Generator from 'simpler-lexer-generator';

let generator = new Generator(/* EBNF grammar */);
let rules = generator.generateRules();

// use some tool to tokenize based on the rules
```

### EBNF grammar supported
The generator assumes the rules are arranged one per line. Identifiers may have spaces, and commas are used to separate different parts in a rule. Rules are defined with `::=`, and currently only single-quote literals are supported. For more information about the supported format, see the [relevant Wikipedia article](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_Form) and the test suite.

### Rules output format
The output rules are in following format:
```js
[
  {
    name: 'name of rule, to be used in the output',
    rule: 'regular expression to match the token'
  }
]
```

## See also
- [simpler-lexer](https://github.com/bananushka/simpler-lexer) - A tool to tokenize based on (compatible) rules
