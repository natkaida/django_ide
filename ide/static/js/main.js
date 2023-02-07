const output = document.getElementById("output");
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
              mode: {
                  name: "python",
                  version: 3,
                  singleLineStringErrors: false,
              },
              theme: "dracula",
              lineNumbers: true,
              indentUnit: 4,
              matchBrackets: true,
            });

editor.setValue("print(*['*' * i + '\\n' for i in range(50)])");
output.value = "Запуск Python...\n";


function addToOutput(stdout) {
  output.value += ">>> " + "\n" + stdout + "\n";
}


function clearOutput() {
  output.value = "";
}


async function main() {
  let pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/",
  });
  output.value = pyodide.runPython(`
      import sys
      sys.version
  `);
  output.value += "\n" + "Python готов к работе" + "\n";
  return pyodide;
}

let pyodideReadyPromise = main();


async function runCode() {
  let pyodide = await pyodideReadyPromise;
  try {
    pyodide.runPython(`
      import io
      sys.stdout = io.StringIO()
      `);
    let result = pyodide.runPython(editor.getValue());
    let stdout = pyodide.runPython("sys.stdout.getvalue()");
    addToOutput(stdout);
  } catch (err) {
    addToOutput(err);
  }
}