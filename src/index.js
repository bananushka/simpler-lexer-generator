export default class Generator {
  constructor(grammar) {
    this.grammar = grammar;
    this.rules = [];
  }

  generateRules() {
    return this.grammar
            .split('\n')
            .reverse()
            .filter(line => line.trim().length > 0)
            .filter(line => !line.match(/^#/))
            .map(line => line.split('::=').map(x => x.trim()))
            .map(([name, rule]) => {
              return {name, rule};
            })
            .map(({name, rule}) => {
              this.rules.push({
                name,
                rule: this.translateRule(rule)
              });
              return this.rules[this.rules.length - 1];
            })
            .map(({name, rule}) => {
              return {name, rule: new RegExp(rule)};
            })
            .filter(rule => !rule.name.match(/^aux:/));
  }
  translateRule(rule) {
    switch (true) {
    case compoundRule(rule):    return this.translateCompoundRule(rule);
    case repetitionRule(rule):  return this.translateRepetitionRule(rule);
    case optionalRule(rule):    return this.translateOptionalRule(rule);
    case referenceRule(rule):   return this.translateReferenceRule(rule);
    case terminalRule(rule):    return this.translateTerminalRule(rule);
    default: return '';
    }
  }
  translateTerminalRule(rule) {
    return '[' + rule
                  .split(' | ')
                  .map(terminal)
                  .join('')
            + ']';
  }
  translateReferenceRule(rule) {
      return '(' + rule
                    .split(' | ')
                    .map(reference.bind(null, this.rules))
                    .join('|')
            + ')';
  }
  translateOptionalRule(rule) {
    return this.translateReferenceRule(rule.substr(1, rule.length - 2).trim()) + '?';
  }
  translateRepetitionRule(rule) {
    return this.translateReferenceRule(rule.substr(1, rule.length - 2).trim()) + '*';
  }
  translateCompoundRule(rule) {
    return '(' +
              rule
                .split(' | ')
                .map(rulePart => rulePart
                                  .split(', ')
                                  .map(rulePartSeq => this.translateRule(rulePartSeq))
                                  .join('')
                    )
                .join('|')
            + ')';
  }
}

function terminalRule(rule) {
  return rule.split(' | ').every(isTerminal);
}
function isTerminal(rulePart) {
  return isSimpleTerminal(rulePart) || isRange(rulePart);
}
function isSimpleTerminal(rulePart) {
  return !!rulePart.match(/^'.+'$/);
}
function isRange(rulePart) {
  return rulePart == '...';
}

function terminal(rulePart) {
  return rulePart == '...' ? '-' :
          rulePart
          .substr(1, rulePart.length - 2)
          .replace('-', '\\-')
          .replace('/', '\\/');
}

function referenceRule(rule) {
  return rule.split(' | ').some(isReference);
}
function isReference(rulePart) {
  return isSimpleRefernce(rulePart);
}
function isSimpleRefernce(rulePart) {
  return !!rulePart.match(/^[a-zA-Z0-9_-\s]+$/);
}
function reference(references, rulePart) {
  if (isSimpleTerminal(rulePart)) {
    return terminal(rulePart);
  } else {
    return references.find(reference => reference.name == rulePart || reference.name == 'aux:' + rulePart).rule;
  }
}

function optionalRule(rule) {
  return rule.split(' | ').some(isOptional);
}
function isOptional(rulePart) {
  return !!rulePart.match(/^\[.+\]$/);
}

function repetitionRule(rule) {
  return rule.split(' | ').some(isRepetition);
}
function isRepetition(rulePart) {
  return !!rulePart.match(/^\{.+\}$/);
}

function compoundRule(rule) {
  return rule.split(' | ').some(isCompound);
}
function isCompound(rulePart) {
  return !isTerminal(rulePart) && rulePart.includes(',');
}
