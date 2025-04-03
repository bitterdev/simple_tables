import {TabulatorFull as Tabulator} from 'tabulator-tables';

$.fn.createTableEditor = function (options) {
    let settings = $.extend({
        addColumnText: "Add Column",
        removeColumnText: "Remove Column",
        addRowText: "Add Row",
        noDataAvailable: "No data available",
        selectColumnText: "-- Select Column --",
        alertInvalidJson: "Invalid JSON format!",
        alertSelectColumn: "Please select a column!",
        data: []
    }, options);

    let $container = this;
    let controls = $(`
        <div class="input-group mb-3">
            <select class="form-select columnSelect">
                <option value="">${settings.selectColumnText}</option>
            </select>
            <button class="btn btn-danger remove-column-btn">${settings.removeColumnText}</button>
            <button class="btn btn-primary add-column-btn">${settings.addColumnText}</button>
            <button class="btn btn-success add-row-btn">${settings.addRowText}</button>
        </div>
        <div class="mt-3 table-container"></div>
    `);

    $container.append(controls);

    let tableColumns = [], data = [];

    if (typeof settings.data !== "undefined" && settings.data !== null && settings.data.length > 0) {
        data = settings.data;

        tableColumns = Object.keys(settings.data[0]).map(field => ({
            title: field,
            field: field,
            editor: "input"
        }));
    }

    let table = new Tabulator($container.find(".table-container").get(0), {
        placeholder: settings.noDataAvailable,
        columns: tableColumns,
        data: data,
        layout: "fitColumns",
        addRowPos: "bottom"
    });

    table.on("tableBuilt", function () {
        updateColumnDropdown();
        saveCode();
    });

    function saveCode() {
        let visibleColumns = table.getColumns().map(col => col.getField()).filter(field => field);

        let jsonData = table.getData().map(row => {
            let filteredRow = {};

            visibleColumns.forEach(col => {
                filteredRow[col] = row[col] || "";
            });

            return filteredRow;
        });

        $('#entries').val(JSON.stringify(jsonData, null, 2));
    }

    table.on("cellEdited", function () {
        saveCode();
    });

    function updateColumnDropdown() {
        let columnSelect = $container.find('.columnSelect');

        columnSelect.empty();
        columnSelect.append(`<option value="">${settings.selectColumnText}</option>`);

        table.getColumns().forEach(col => {
            let field = col.getField();

            if (field) {
                columnSelect.append(`<option value="${field}">${col.getDefinition().title}</option>`);
            }
        });
    }

    $container.find('.add-column-btn').on("click", function (event) {
        event.preventDefault();
        let fieldName = prompt(settings.addColumnText);
        if (!fieldName) return;
        table.addColumn({title: fieldName, field: fieldName, editor: "input"});
        updateColumnDropdown();
        saveCode();
    });

    $container.find('.remove-column-btn').on("click", function (event) {
        event.preventDefault();
        let selectedColumn = $container.find('.columnSelect').val();
        if (!selectedColumn) {
            alert(settings.alertSelectColumn);
            return;
        }
        table.deleteColumn(selectedColumn);
        updateColumnDropdown();
        saveCode();
    });

    $container.find('.add-row-btn').on("click", function (event) {
        event.preventDefault();
        table.addRow({});
        saveCode();
    });
};
