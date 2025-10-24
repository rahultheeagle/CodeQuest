function run() {
    var htmlCode = document.getElementById('html').value;
    var cssCode = document.getElementById('css').value;
    var output = document.getElementById('output');
    
    output.innerHTML = '<style>' + cssCode + '</style>' + htmlCode;
}

function clearCode() {
    document.getElementById('html').value = '';
    document.getElementById('css').value = '';
    document.getElementById('output').innerHTML = '';
    updateLineNumbers('html');
    updateLineNumbers('css');
    updateCursorPosition('html');
    updateCursorPosition('css');
}

function updateLineNumbers(type) {
    const code = document.getElementById(type).value;
    const lines = code.split('\n').length;
    const lineNumbers = document.getElementById(type + 'LineNumbers');
    lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('\n');
}

function updateCursorPosition(type) {
    const editor = document.getElementById(type);
    const cursorPos = editor.selectionStart;
    const textBeforeCursor = editor.value.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    document.getElementById(type + '-cursor-pos').textContent = `Ln ${line}, Col ${col}`;
}

// Add event listeners
['html', 'css'].forEach(type => {
    const editor = document.getElementById(type);
    editor.addEventListener('input', () => {
        updateLineNumbers(type);
        updateCursorPosition(type);
    });
    editor.addEventListener('keyup', () => updateCursorPosition(type));
    editor.addEventListener('click', () => updateCursorPosition(type));
    updateLineNumbers(type);
});

window.onload = function() {
    // Start with empty editors
};