// @ts-nocheck
const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.showFunctionReferences",
    async () => {
      vscode.window.showInformationMessage("init");
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const position = editor.selection.active;
        const wordRange = document.getWordRangeAtPosition(position, /\w+/);
        if (wordRange) {
          const word = document.getText(wordRange);
          const references = await findReferences(word, document, position);
          showReferenceCount(editor, wordRange, references.length);
        }
      }
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.window.createTextEditorDecorationType({
      after: {
        contentText: "",
        margin: "0 0 0 1rem",
        color: "rgba(150, 150, 150, 0.7)",
      },
    })
  );
}

async function findReferences(word, document, position) {
  const references = await vscode.commands.executeCommand(
    "vscode.executeReferenceProvider",
    document.uri,
    position
  );
  return references || [];
}

function showReferenceCount(editor, range, count) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    before: {
      contentText: ` (${count} references)`,
      color: "rgba(150, 150, 150, 0.7)",
    },
  });

  const decorationOptions = {
    range: range,
    renderOptions: {
      before: {
        contentText: ` (${count} references)`,
        color: "rgba(150, 150, 150, 0.7)",
      },
    },
  };

  editor.setDecorations(decorationType, [decorationOptions]);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
