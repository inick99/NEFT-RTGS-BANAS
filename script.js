document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rtgsForm');
    const clearFormButton = document.getElementById('clearForm');

    // Load form data from local storage on page load
    loadFormData(form);

    // Save form data to local storage on input change
    form.addEventListener('input', function(event) {
        saveFormData(form);
    });

    // Attach generatePrintForm to the form's submit event
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent actual form submission
        generatePrintForm();    // Your custom function to handle form logic/printing
    });

    // Clear form and local storage when "Clear Form" button is clicked
    if (clearFormButton) {
        clearFormButton.addEventListener('click', clearFormData);
    }
    // ✅ Auto-uppercase all text input fields
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    });
});

function saveFormData(form) {
    const formData = new FormData(form);
    const dataToSave = {};
    for (const [key, value] of formData.entries()) {
        if (form.elements[key].type === 'radio' && !form.elements[key].checked) {
            continue; // Skip unchecked radio buttons
        }
        dataToSave[key] = value;
    }
    localStorage.setItem('rtgsFormData', JSON.stringify(dataToSave));
}

function loadFormData(form) {
    const savedData = localStorage.getItem('rtgsFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        for (const key in data) {
            const element = form.elements[key];
            if (element) {
                if (element.type === 'radio') {
                    // Handle radio buttons
                    const radioButtons = form.querySelectorAll(`input[name="${key}"]`);
                    radioButtons.forEach(radio => {
                        if (radio.value === data[key]) {
                            radio.checked = true;
                        }
                    });
                } else {
                    // Handle text inputs, numbers, selects, etc.
                    element.value = data[key];
                }
            }
        }
    }
}

function clearFormData() {
    const form = document.getElementById('rtgsForm');
    form.reset(); // Resets all form fields to their initial state
    localStorage.removeItem('rtgsFormData'); // Clears data from local storage
    // Manually reset select options to the first (disabled selected) option if desired
    form.querySelectorAll('select').forEach(select => {
        select.value = ''; // Or set to a specific default value if needed
    });
}

function generatePrintForm() {
    const form = document.getElementById('rtgsForm');

    // Get the beneficiary account numbers
    const beneficiaryAccount = document.getElementById('beneficiaryAccount').value;
    const beneficiaryAccountConfirm = document.getElementById('beneficiaryAccountConfirm').value;

    // Validate if beneficiary accounts match
    if (beneficiaryAccount !== beneficiaryAccountConfirm) {
        alert('Beneficiary Account Number and Confirm Beneficiary Account Number do not match. Please re-enter.');
        document.getElementById('beneficiaryAccount').focus(); // Focus on the first field for correction
        return; // Stop the function execution
    }
    // ✅ Check RTGS amount condition
    const amount = parseFloat(document.getElementById('amount').value);
    const transactionType = form.querySelector('input[name="transactionType"]:checked').value;

    if (transactionType === 'RTGS' && amount < 200000) {
        alert("Can't do RTGS Less than 2 Lac Amount!");
        document.getElementById('amount').focus();
        return;
    }
    
    const formData = new FormData(form);
    const queryString = new URLSearchParams();

    // Iterate over form data and append to query string
    for (const [key, value] of formData.entries()) {
        queryString.append(key, value);
    }

    // Redirect to Print.HTML with the form data as query parameters
    window.open('Print.html?' + queryString.toString(), '_blank');
}
