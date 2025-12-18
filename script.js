// Global variables to store JSON data and current item index
let jsonData = [];
let currentItemIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
    dummyFill();

    const inputBox = document.getElementById('jsonInput');
    // Run on input in the textarea
    inputBox.addEventListener('input', processJson);


});

function createStyledBlock(category, text, correct, result) {
    // Create the main container
    const container = document.createElement('div');
    container.className = 'styled-block';
    
    // Helper function to create a row with label and quote block
    function createRow(label, content) {
        const row = document.createElement('div');
        row.className = 'item-row';
        
        const labelElement = document.createElement('div');
        labelElement.className = 'item-label';
        labelElement.textContent = label + ":";
        
        const quoteBlock = document.createElement('div');
        quoteBlock.className = 'quote-block';
        quoteBlock.innerHTML = `<div class="copy-indicator">Copied!</div>${content}`;
        
        // Add click to copy functionality
        quoteBlock.addEventListener('click', function() {
            copyToClipboard(content);
            
            // Visual feedback
            this.classList.add('copied');
            setTimeout(() => {
                this.classList.remove('copied');
            }, 1500);
        });
        
        row.appendChild(labelElement);
        row.appendChild(quoteBlock);
        
        return row;
    }
    
    // Add the four rows
    container.appendChild(createRow("Category", category));
    container.appendChild(createRow("Text", text));
    container.appendChild(createRow("Correct", correct));
    container.appendChild(createRow("Result", result));
    
    // Clear previous output and add new block
    const output = document.getElementById('itemContentContainer');
    output.innerHTML = '';
    output.appendChild(container);
}
function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the temporary element
    document.body.removeChild(textarea);
    
    // Show notification
    showClipboardNotification();
}
function showClipboardNotification() {
    const status = document.getElementById('clipboardStatus');
    status.classList.add('show');
    
    setTimeout(() => {
        status.classList.remove('show');
    }, 2000);
}


function processJson() {
    let input = document.getElementById('jsonInput').value.trim();
    try {
        // Remove trailing comma if present
        if (input.endsWith(',')) input = input.slice(0, -1);
        // Allow users to paste raw object lists without surrounding []
        const normalized = input.startsWith('[') ? input : `[${input}]`;
        jsonData = JSON.parse(normalized);
    } catch (err) {
        alert('Invalid JSON');
        return;
    }

    const textLines = [];
    const correctLines = [];
    const resultLines = [];

    for (const item of jsonData) {
        if (item.Text) textLines.push(item.Text);
        if (item.Correct) correctLines.push(item.Correct);
        if (item.Result) resultLines.push(item.Result);
    }

    document.getElementById('textBlock').textContent = textLines.join('\n');
    document.getElementById('correctBlock').textContent = correctLines.join('\n');
    document.getElementById('resultBlock').textContent = resultLines.join('\n');

    // Show the item viewer if we have data
    if (jsonData.length > 0) {
        document.getElementById('itemViewer').classList.add('active');
        currentItemIndex = 0;
        updateItemViewer();
        generateNumberButtons();
    } else {
        document.getElementById('itemViewer').classList.remove('active');
    }
}

function updateItemViewer() {
    const item = jsonData[currentItemIndex];
    createStyledBlock(item.Category, item.Text, item.Correct, item.Result);
    /* 
    <div class="styled-block">
            <div class="item-row">
                <div class="item-label">Category:</div>
                <div class="quote-block">
                    <div class="copy-indicator">Copied!</div>Science
                </div>
            </div>
            <div class="item-row">
                <div class="item-label">Text:</div>
                <div class="quote-block">
                    <div class="copy-indicator">Copied!</div>The speed of light is approximately 299,792,458 meters per
                    second.
                </div>
            </div>
            <div class="item-row">
                <div class="item-label">Correct:</div>
                <div class="quote-block">
                    <div class="copy-indicator">Copied!</div>True
                </div>
            </div>
            <div class="item-row">
                <div class="item-label">Result:</div>
                <div class="quote-block">
                    <div class="copy-indicator">Copied!</div>Answer is correct
                </div>
            </div>
    </div>*/
    /* document.getElementById('itemContentContainer').innerHTML = `
    <div class="styled-block">
        <div class="item-row">
            <div class="item-label">Category:</div>
            <div class="quote-block">
                <div class="copy-indicator">Copied!</div>${item.Category}
            </div>
        </div>
        <div class="item-row">
            <div class="item-label">Text:</div>
            <div class="quote-block">
                <div class="copy-indicator">Copied!</div>${item.Text}
            </div>
        </div>
        <div class="item-row">
            <div class="item-label">Correct:</div>
            <div class="quote-block">
                <div class="copy-indicator">Copied!</div>${item.Correct}
            </div>
        </div>
        <div class="item-row">
            <div class="item-label">Result:</div>
            <div class="quote-block">
                <div class="copy-indicator">Copied!</div>${item.Result}
            </div>
        </div>
    </div>`; */


    // OLD
    //document.getElementById('itemContent').textContent = JSON.stringify(item, null, 2);
    document.querySelectorAll('#itemNumbers button').forEach((btn, i) => {
        btn.classList.toggle('active', i === currentItemIndex);
    });
}

function prevItem() {
    if (currentItemIndex > 0) {
        currentItemIndex--;
        updateItemViewer();
    }
}

function nextItem() {
    if (currentItemIndex < jsonData.length - 1) {
        currentItemIndex++;
        updateItemViewer();
    }
}

function generateNumberButtons() {
    const container = document.getElementById('itemNumbers');
    container.innerHTML = '';

    jsonData.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.onclick = () => {
            currentItemIndex = i;
            updateItemViewer();
        };
        container.appendChild(btn);
    });
}


function dummyFill() {
    //JSON.stringify
    let tmp = [
        {
            "Category": "Your vs. You're",
            "Text": "Your the best at playing chess. Is that your book on the table, I remember you owned that same book.",
            "Correct": "You are the best at playing chess. Is that your book on the table? I remember you owned that same book.",
            "MoreCorrect": null,
            "Result": "You're the best at playing chess. Is that your book on the table? I remember you owned that same book."
        },
        {
            "Category": "Less vs. Fewer",
            "Text": "If less people used disposable water bottles, there would be less plastic in landfills.",
            "Correct": "If fewer people used disposable water bottles, there would be less plastic in landfills.",
            "MoreCorrect": null,
            "Result": "If less people used disposable water bottles, there would be less plastic in landfills."
        },
        {
            "Category": "Its vs. It's",
            "Text": "The business began in June, and since then, its been booming. Its very late to go to work. Its always sunny in Florida. Its been five months. Its a red umbrella. Its got a hole in it. Its been great getting to know you. Weve got a meeting at two and its almost one-thirty now.",
            "Correct": "The business began in June, and since then, it's been booming. It's very late to go to work. It's always sunny in Florida. It's been five months. It's a red umbrella. It's got a hole in it. It's been great getting to know you. We've got a meeting at two and it's almost one-thirty now.",
            "MoreCorrect": null,
            "Result": "The business began in June, and since then, it's been booming. It's very late to go to work. It's always sunny in Florida. It's been five months. It's a red umbrella. It's got a hole in it. It's been great getting to know you. We've got a meeting at two, and it's almost one-thirty now."
        },
        {
            "Category": "Letter Format",
            "Text": "October 2nd, 1995",
            "Correct": "October 2nd, 1995",
            "MoreCorrect": null,
            "Result": "October 2, 1995"
        },
        {
            "Category": "Ain't",
            "Text": "I ain't got time for this.",
            "Correct": "I don't have time for this.",
            "MoreCorrect": null,
            "Result": "I haven't got time for this."
        },
        {
            "Category": "Ain't",
            "Text": "It ain't working like it should.",
            "Correct": "It isn't working like it should.",
            "MoreCorrect": null,
            "Result": "It isn't working as it should."
        },
        {
            "Category": "Ain't",
            "Text": "Ain't nobody got time for that.",
            "Correct": "Nobody has time for that.",
            "MoreCorrect": null,
            "Result": "Ain't nobody got time for that."
        },
        {
            "Category": "Quotes",
            "Text": "The teacher told us, Please submit your assignments by Friday.",
            "Correct": "The teacher told us, \"Please submit your assignments by Friday.\"",
            "MoreCorrect": null,
            "Result": "The teacher told us, Please submit your assignments by Friday."
        },
        {
            "Category": "Quotes",
            "Text": "Did you hear that? Mark whispered, I think someone is outside.",
            "Correct": "\"Did you hear that?\" Mark whispered. \"I think someone is outside.\"",
            "MoreCorrect": null,
            "Result": "Did you hear that? Mark whispered. \"I think someone is outside.\""
        }
    ];
    document.getElementById('jsonInput').value = JSON.stringify(tmp);
}