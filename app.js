// Sanitize the URL by removing existing parameters and setting a trailing "?"
const sanitizeBaseUrl = (url) => {
    // Remove any existing query parameters and ensure the URL ends with '?'
    let sanitizedUrl = url.split('?')[0];
    return sanitizedUrl.endsWith('/') ? sanitizedUrl + '?' : sanitizedUrl + '?';
};

// Add new key-value input fields for custom arguments
const addArgument = () => {
    const container = document.getElementById('customArgsContainer');
    const currentRows = container.querySelectorAll('.row');
    const lastRow = currentRows[currentRows.length - 1];

    // Remove the "Add Argument" button from the current last row
    const addButton = lastRow.querySelector('#addArgument');
    if (addButton) {
        lastRow.removeChild(addButton.parentElement);
    }

    // Create a new row for the custom argument
    const newRow = document.createElement('div');
    newRow.classList.add('row', 'mb-2', 'align-items-center');

    // Key input column
    const keyCol = document.createElement('div');
    keyCol.classList.add('col-md-5');
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.classList.add('form-control');
    keyInput.placeholder = 'Key (e.g., filter)';
    keyInput.name = 'key[]';
    keyCol.appendChild(keyInput);

    // Value input column
    const valueCol = document.createElement('div');
    valueCol.classList.add('col-md-5');
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.classList.add('form-control');
    valueInput.placeholder = 'Value (e.g., Region=West)';
    valueInput.name = 'value[]';
    valueCol.appendChild(valueInput);

    // Delete button column for the previous row
    const deleteCol = document.createElement('div');
    deleteCol.classList.add('col-md-2', 'text-end');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'deleteArgument');
    deleteButton.textContent = 'Delete';
    deleteCol.appendChild(deleteButton);
    lastRow.appendChild(deleteCol); // Add Delete button to the previous row

    // "Add Argument" button column for the new row
    const addCol = document.createElement('div');
    addCol.classList.add('col-md-2', 'text-end');
    const newAddButton = document.createElement('button');
    newAddButton.type = 'button';
    newAddButton.classList.add('btn', 'btn-outline-primary');
    newAddButton.id = 'addArgument';
    newAddButton.textContent = 'Add Argument';
    addCol.appendChild(newAddButton);

    // Append columns to the new row
    newRow.appendChild(keyCol);
    newRow.appendChild(valueCol);
    newRow.appendChild(addCol);

    // Append the new row to the container
    container.appendChild(newRow);

    // Attach event listener to the new "Add Argument" button
    newAddButton.addEventListener('click', addArgument);
};

// Generate final URL based on inputs
const generateUrl = () => {
    let baseUrl = document.getElementById('dashboardUrl').value.trim();
    if (!baseUrl) {
        alert('Please enter the Tableau Dashboard/View URL.');
        return;
    }
    baseUrl = sanitizeBaseUrl(baseUrl);
    let finalUrl = baseUrl;

    // Collect optional arguments from checkboxes
    const optionalArgs = [];
    document.querySelectorAll('.form-check-input:checked').forEach((checkbox) => {
        // If first argument, leave the value as-is; else prepend "&" to the value string
        optionalArgs.push(optionalArgs.length === 0 ? `${checkbox.value}` : `&${checkbox.value}`);
    });
    
    if (optionalArgs.length > 0) {
        finalUrl += optionalArgs.join('');
    }

    // Collect custom key-value arguments
    const keys = document.querySelectorAll('[name="key[]"]');
    const values = document.querySelectorAll('[name="value[]"]');
    keys.forEach((keyInput, index) => {
        const key = keyInput.value.trim();
        const value = values[index].value.trim();
        if (key && value) {
            finalUrl += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
    });

    // Display the resulting URL
    document.getElementById('resultUrl').value = finalUrl;
};

// Event listeners for buttons

// Initial "Add Argument" button
document.getElementById('addArgument').addEventListener('click', addArgument);

// "Generate URL" button
document.getElementById('generateUrl').addEventListener('click', generateUrl);

// Event delegation for handling "Delete" button clicks within custom arguments
document.getElementById('customArgsContainer').addEventListener('click', function(event) {
    // Check if the clicked element has the 'deleteArgument' class
    if (event.target && event.target.classList.contains('deleteArgument')) {
        // Find the closest row to the clicked delete button
        const rowToDelete = event.target.closest('.row');
        if (rowToDelete) {
            // Check if the row to delete contains the "Add Argument" button
            const hasAddButton = rowToDelete.querySelector('#addArgument');

            // Remove the row
            rowToDelete.remove();

            if (hasAddButton) {
                // If the deleted row had the "Add Argument" button, move it to the new last row
                const container = document.getElementById('customArgsContainer');
                const currentRows = container.querySelectorAll('.row');
                if (currentRows.length > 0) {
                    const newLastRow = currentRows[currentRows.length - 1];

                    // Create "Add Argument" button column
                    const addCol = document.createElement('div');
                    addCol.classList.add('col-md-2', 'text-end');
                    const newAddButton = document.createElement('button');
                    newAddButton.type = 'button';
                    newAddButton.classList.add('btn', 'btn-outline-primary');
                    newAddButton.id = 'addArgument';
                    newAddButton.textContent = 'Add Argument';
                    addCol.appendChild(newAddButton);

                    // Append "Add Argument" button to the new last row
                    newLastRow.appendChild(addCol);

                    // Attach event listener to the new "Add Argument" button
                    newAddButton.addEventListener('click', addArgument);
                }
            }
        }
    }
});
