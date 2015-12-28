import assert from 'assert';
import Generator from '../';

describe('Generator', () => {
  describe('#constructor()', () => {
    it('should create a new Generator object', () => {
      assert(new Generator instanceof Generator);
    });
    it('should create an object with a generateRules method', () => {
      assert((new Generator).generateRules instanceof Function);
    })
  });

  const testCases = [
    {
      title: 'should work for simple terminals',
      grammar: `equals ::= '='`,
      expected: [{
        name: 'equals',
        rule: /[=]/
      }]
    },
    {
      title: 'should work for multiple terminals',
      grammar: `vowel ::= 'a' | 'e' | 'i' | 'o' | 'u'`,
      expected: [{
        name: 'vowel',
        rule: /[aeiou]/
      }]
    },
    {
      title: 'should work with ranges',
      grammar: `lower case letter ::= 'a' | ... | 'z'`,
      expected: [{
        name: 'lower case letter',
        rule: /[a-z]/
      }]
    },
    {
      title: 'should work with combination of the above',
      grammar: `alpha numeric underscore ::= 'a' | ... | 'z' | 'A' | ... | 'Z' | '0' | ... | '9' | '_'`,
      expected: [{
        name: 'alpha numeric underscore',
        rule: /[a-zA-Z0-9_]/
      }]
    },
    {
      title: 'should work with (non-recursive) forward-references',
      grammar: `
        digit ::= digit without zero | '0'
        digit without zero ::= '1' | ... | '9'
      `,
      expected: [
        {
          name: 'digit without zero',
          rule: /[1-9]/
        },
        {
          name: 'digit',
          rule: /([1-9]|0)/
        }
      ]
    },
    {
      title: 'should work with optionals',
      grammar: `zero or nothing ::= [ '0' ]`,
      expected: [{
        name: 'zero or nothing',
        rule: /(0)?/
      }]
    },
    {
      title: 'should work with repetitions',
      grammar: `
        binary or nothing ::= { binary digit }
        binary digit ::= '0' | '1'
      `,
      expected: [
        {
          name: 'binary digit',
          rule: /[01]/
        },
        {
          name: 'binary or nothing',
          rule: /([01])*/
        }
      ]
    },
    {
      title: 'should work with compound rules',
      grammar: `
        natural number ::= non-zero digit, { digit }
        digit ::= '0' | non-zero digit
        non-zero digit ::= '1' | ... | '9'
      `,
      expected: [
        {
          name: 'non-zero digit',
          rule: /[1-9]/
        },
        {
          name: 'digit',
          rule: /(0|[1-9])/
        },
        {
          name: 'natural number',
          rule: /(([1-9])((0|[1-9]))*)/
        }
      ]
    }
  ];
  describe('#generateRules()', () => {
    for (let {title, grammar, expected} of testCases) {
      it(title, () => {
        assert.deepEqual((new Generator(grammar)).generateRules(), expected);
      });
    }
  });
});
