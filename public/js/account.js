'use strict';

// Function to fetch both classifications and inventory data
async function fetchAllData() {
    await fetchData('classifications');
    await fetchData('inventory');
}

// Function to fetch data from the third-party service
async function fetchData(fetchType) {
    try {
        const response = await fetch(`/inv/get-unproved-${fetchType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        buildTable(data, fetchType);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function buildTable(data, tableType) {
    // Get the table container
    const table = tableType === 'classifications' ? document.querySelector('#classification') : document.querySelector('#inventory');

    if (!table) {
        console.error('Table container not found for type:', tableType);
        return;
    }

    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    let headers = [];

    if (tableType === 'classifications') {
        headers = ['Classification Name', 'Creator First Name', 'Creator Last Name', 'Creator Email', '', ''];
    } else {
        headers = ['Classification Name', 'Creator First Name', 'Creator Last Name', 'Creator Email', 'Inventory Make', 'Inventory Model', 'Inventory Year', ''];
    }

    headers.forEach((headerText, index) => {
        const cell = headerRow.insertCell(index);
        cell.outerHTML = `<th>${headerText}</th>`;
    });

    const tbody = table.createTBody();

    if (tableType === 'classifications') {
        data.forEach((item) => {
            const row = tbody.insertRow();
            row.insertCell(0).innerText = item.classification_name;
            row.insertCell(1).innerText = item.account_firstname;
            row.insertCell(2).innerText = item.account_lastname;
            row.insertCell(3).innerText = item.account_email;
            row.insertCell(4).innerHTML = `<a href="/inv/classification-approve/${item.classification_id}" title="Click to approve">Approve</a>`;
            row.insertCell(5).innerHTML = `<a href="/inv/classification-reject/${item.classification_id}" title="Click to reject">Reject</a>`;
        });
    } else {
        data.forEach((item) => {
            const row = tbody.insertRow();
            row.insertCell(0).innerText = item.classification_name;
            row.insertCell(1).innerText = item.account_firstname;
            row.insertCell(2).innerText = item.account_lastname;
            row.insertCell(3).innerText = item.account_email;
            row.insertCell(4).innerText = item.inv_make;
            row.insertCell(5).innerText = item.inv_model;
            row.insertCell(6).innerText = item.inv_year;
            row.insertCell(7).innerHTML = `<a href="/inv/inventory-review/${item.inv_id}" title="Click to review">Review</a>`;
        });
    }
}

// Fetch data and build the table when the document is loaded
document.addEventListener('DOMContentLoaded', fetchAllData);
