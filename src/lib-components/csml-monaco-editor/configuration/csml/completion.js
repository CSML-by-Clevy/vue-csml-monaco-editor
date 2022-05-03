const monaco = require('monaco-editor');

const macros = [
  'Audio',
  'Base64',
  'Carousel',
  'Find',
  'Floor',
  'Hex',
  'HTTP',
  'Image',
  'Length',
  'OneOf',
  'Or',
  'Question',
  'Random',
  'Shuffle',
  'Text',
  'Typing',
  'Url',
  'UUID',
  'Video',
  'Wait',
].map((macro) => {
  return {
    label: macro,
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: macro + '(${1:parameters})',
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: `${macro} Statement`,
  };
});

const keywords = [
  {
    label: 'say',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'say "$0"',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: 'goto',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'goto $0',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: 'remember',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'remember $1 = $0',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: 'forget',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'forget $0',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
];

const structures = [
  {
    label: 'if',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      'if (${1:condition}) {',
      '\t$0',
      '}',
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'If Statement',
  },
  {
    label: 'ifelse',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      'if (${1:condition}) {',
      '\t$0',
      '} else {',
      '\t',
      '}',
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'If-Else Statement',
  },
  {
    label: 'foreach',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      'foreach (${1:item}) in ${2:items} {',
      '\t$0',
      '}',
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'For-Each Statement',
  },
];

const csmlCompletion = [...macros, ...keywords, ...structures];

/**
 * Provide completion items for the given position and document.
 * @see {@link https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitemprovider.html}
 *
 * @param {*} model A model.
 * @param {*} position A position in the editor.
 * @returns ProviderResult<CompletionList>
 */
function csmlProvideCompletionItems(model, position) {
  const wordBeforePosition = model.getWordUntilPosition({
    lineNumber: position.lineNumber,
    column: position.column - 1,
  });

  const wordUntilPosition = model.getWordUntilPosition(position);

  // Little "hack" to trigger the custom completions but still keeping the default completion.
  // See: https://github.com/microsoft/monaco-editor/issues/1850#issuecomment-753648781
  if (
    wordBeforePosition.word.trim() === '' ||
    wordUntilPosition.word.trim() === ''
  ) {
    const keywords = csmlCompletion;

    const suggestions = keywords.map((id) => ({
      label: id.label,
      kind: id.kind,
      description: id.description,
      documentation: id.description,
      insertText: id.insertText,
      detail: id.description,
      insertTextRules: id.insertTextRules,
      range: {
        startLineNumber: position.lineNumber,
        startColumn: wordUntilPosition.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: wordUntilPosition.endColumn - 1,
      },
    }));
    return { suggestions };
  }
}

export default {
  provideCompletionItems: csmlProvideCompletionItems,
};
