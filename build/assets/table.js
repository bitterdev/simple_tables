/*!
 * This JavaScript file includes Tabulator.js by Oli Folkerd,
 * which is licensed under the MIT License (MIT).
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2025 Oli Folkerd
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS*
 */

// noinspection JSUnresolvedFunction
import {TabulatorFull as Tabulator} from 'tabulator-tables';

$.fn.createTableEditor = function (options) {
    let settings = $.extend({
        empty: "Empty",
        renameColumnText: "Rename Column",
        addColumnLeftText: "Add Column Left",
        addColumnRightText: "Add Column Right",
        moveColumnLeftText: "Move Column Left",
        moveColumnRightText: "Move Column Right",
        deleteColumnText: "Delete Column",
        insertRowAboveText: "Insert Row Above",
        insertRowBelowText: "Insert Row Below",
        insertMultipleRowsAboveText: "Insert Multiple Rows Above",
        insertMultipleRowsBelowText: "Insert Multiple Rows Below",
        moveRowUpText: "Move Row Up",
        moveRowDownText: "Move Row Down",
        deleteRowText: "Delete Row",
        promptColumnNameText: "Enter column name:",
        promptRenameText: "New column name:",
        promptRowsText: "How many rows to insert?",
        confirmDeleteColumnText: "Delete this column?",
        confirmDeleteRowText: "Delete this row?",
        invalidNumberText: "Please enter a valid positive number.",
        data: []
    }, options);

    let $container = this;

    function iconLabel(iconClass, label) {
        return `<i class="${iconClass}"></i> ${label}`;
    }

    function createEmptyStructure() {
        return {
            columns: [{
                title: settings.empty,
                field: settings.empty,
                editor: "input",
                headerSort: true,
                headerContextMenu: headerMenu
            }],
            data: [{"column1": ""}]
        };
    }

    let tableColumns = [], data = [];

    if (typeof settings.data !== "undefined" && settings.data !== null && Array.isArray(settings.data) && settings.data.length > 0) {
        if (Array.isArray(settings.data[0])) {
            // Daten aus der neuen Struktur konvertieren
            data = settings.data.map(row => {
                if (!Array.isArray(row)) {
                    return {};
                }
                let rowData = {};
                row.forEach(item => {
                    if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
                        rowData[item.key] = item.value;
                    }
                });
                return rowData;
            });

            // Spalten aus der ersten Zeile der Daten erstellen
            if (Array.isArray(settings.data[0])) {
                tableColumns = settings.data[0].map(item => {
                    if (item && typeof item === 'object' && 'key' in item) {
                        return {
                            title: item.key,
                            field: item.key,
                            editor: "input",
                            headerSort: true,
                            headerContextMenu: headerMenu
                        };
                    }
                    return null;
                }).filter(col => col !== null);
            }
        }
    }

    // Falls keine Daten vorhanden sind, leere Struktur erstellen
    if (tableColumns.length === 0 || data.length === 0) {
        const emptyStructure = createEmptyStructure();
        tableColumns = emptyStructure.columns;
        data = emptyStructure.data;
    }

    let table = new Tabulator($container.get(0), {
        height: "500px",
        layout: "fitColumns",
        reactiveData: true,
        columns: tableColumns,
        data: data,
        rowContextMenu: rowMenu,
    });

    table.on("tableBuilt", saveCode);
    table.on("cellEdited", saveCode);

    function saveCode() {
        let visibleColumns = table.getColumns().map(col => col.getField()).filter(field => field);
        let jsonData = table.getData().map(row => {
            let filteredRow = [];
            visibleColumns.forEach(col => {
                filteredRow.push({key: col, value: row[col] || ""});
            });
            return filteredRow;
        });
        $('#entries').val(JSON.stringify(jsonData, null, 2));
    }

    function headerMenu(e, column) {
        const allColumns = table.getColumns();
        const index = allColumns.indexOf(column);
        const isFirst = index === 0;
        const isLast = index === allColumns.length - 1;

        return [
            {
                label: iconLabel("fas fa-edit", settings.renameColumnText),
                action: () => {
                    const newTitle = prompt(settings.promptRenameText, column.getDefinition().title);
                    if (newTitle) {
                        const oldField = column.getField();
                        column.updateDefinition({title: newTitle, field: newTitle});
                        // Daten aktualisieren, um den alten field-Wert zu ersetzen
                        table.getData().forEach(row => {
                            if (row[oldField] !== undefined) {
                                row[newTitle] = row[oldField];
                                delete row[oldField];
                            }
                        });
                        table.setData(table.getData());
                        saveCode();
                    }
                },
            },
            {
                label: iconLabel("fas fa-plus", settings.addColumnLeftText),
                action: () => {
                    const colName = prompt(settings.promptColumnNameText);
                    if (!colName) return;
                    table.addColumn({
                        title: colName,
                        field: colName,
                        editor: "input",
                        headerSort: true,
                        headerContextMenu: headerMenu,
                    }, true, column);
                    saveCode();
                },
            },
            {
                label: iconLabel("fas fa-plus", settings.addColumnRightText),
                action: () => {
                    const colName = prompt(settings.promptColumnNameText);
                    if (!colName) return;
                    table.addColumn({
                        title: colName,
                        field: colName,
                        editor: "input",
                        headerSort: true,
                        headerContextMenu: headerMenu,
                    }, false, column);
                    saveCode();
                },
            },
            {
                label: iconLabel("fas fa-arrow-left", settings.moveColumnLeftText),
                disabled: isFirst,
                action: () => {
                    if (!isFirst) {
                        const newColumns = allColumns.map(col => col.getDefinition());
                        const [movedColumn] = newColumns.splice(index, 1);
                        newColumns.splice(index - 1, 0, movedColumn);
                        table.setColumns(newColumns);
                        saveCode();
                    }
                },
            },
            {
                label: iconLabel("fas fa-arrow-right", settings.moveColumnRightText),
                disabled: isLast,
                action: () => {
                    if (!isLast) {
                        const newColumns = allColumns.map(col => col.getDefinition());
                        const [movedColumn] = newColumns.splice(index, 1);
                        newColumns.splice(index + 1, 0, movedColumn);
                        table.setColumns(newColumns);
                        saveCode();
                    }
                },
            },
            {
                label: iconLabel("fas fa-trash", settings.deleteColumnText),
                action: () => {
                    if (confirm(settings.confirmDeleteColumnText)) {
                        column.delete();
                        // Wenn keine Spalten mehr vorhanden sind, leere Struktur wiederherstellen
                        if (table.getColumns().length === 0) {
                            const emptyStructure = createEmptyStructure();
                            table.setColumns(emptyStructure.columns);
                            table.setData(emptyStructure.data);
                        }
                        saveCode();
                    }
                },
            },
        ];
    }

    function rowMenu(e, row) {
        const allRows = table.getRows();
        const index = allRows.indexOf(row);
        const isFirst = index === 0;
        const isLast = index === allRows.length - 1;

        function insertMultipleRows(count, before) {
            const columns = table.getColumns();
            for (let i = 0; i < count; i++) {
                const rowData = {};
                columns.forEach(col => rowData[col.getField()] = "");
                table.addRow(rowData, before, row);
            }
            saveCode();
        }

        function promptAndInsertRows(before) {
            let input = prompt(settings.promptRowsText, "10");
            if (input === null) return;
            const count = parseInt(input);
            if (!Number.isInteger(count) || count <= 0) {
                alert(settings.invalidNumberText);
                return;
            }
            insertMultipleRows(count, before);
        }

        return [
            {
                label: iconLabel("fas fa-arrow-up", settings.insertRowAboveText),
                action: () => {
                    const rowData = {};
                    table.getColumns().forEach(col => rowData[col.getField()] = "");
                    table.addRow(rowData, true, row);
                    saveCode();
                },
            },
            {
                label: iconLabel("fas fa-arrow-down", settings.insertRowBelowText),
                action: () => {
                    const rowData = {};
                    table.getColumns().forEach(col => rowData[col.getField()] = "");
                    table.addRow(rowData, false, row);
                    saveCode();
                },
            },
            {
                label: iconLabel("fas fa-layer-group", settings.insertMultipleRowsAboveText),
                action: () => promptAndInsertRows(true),
            },
            {
                label: iconLabel("fas fa-layer-group", settings.insertMultipleRowsBelowText),
                action: () => promptAndInsertRows(false),
            },
            {
                label: iconLabel("fas fa-angle-double-up", settings.moveRowUpText),
                disabled: isFirst,
                action: () => {
                    if (!isFirst) {
                        table.moveRow(row, allRows[index - 1], true);
                        saveCode();
                    }
                },
            },
            {
                label: iconLabel("fas fa-angle-double-down", settings.moveRowDownText),
                disabled: isLast,
                action: () => {
                    if (!isLast) {
                        table.moveRow(row, allRows[index + 1], false);
                        saveCode();
                    }
                },
            },
            {
                label: iconLabel("fas fa-trash", settings.deleteRowText),
                action: () => {
                    if (confirm(settings.confirmDeleteRowText)) {
                        row.delete();
                        // Wenn keine Zeilen mehr vorhanden sind, leere Zeile hinzufügen
                        if (table.getData().length === 0) {
                            const rowData = {};
                            table.getColumns().forEach(col => rowData[col.getField()] = "");
                            table.addRow(rowData);
                        }
                        saveCode();
                    }
                },
            },
        ];
    }

    return this;
};