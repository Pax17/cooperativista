'use strict';

const PDFDocument = require('pdfkit');

class PDFDocumentWithTables extends PDFDocument {
    constructor(options) {
        super(options);
    }

    table(table, arg0, arg1, arg2) {
        let startX = this.page.margins.left, startY = this.y;
        let options = {};

        if ((typeof arg0 === 'number') && (typeof arg1 === 'number')) {
            startX = arg0;
            startY = arg1;

            if (typeof arg2 === 'object')
                options = arg2;
        } else if (typeof arg0 === 'object') {
            options = arg0;
        }
        console.log('OPTIONS >>>>>>>>>>>>>>>>>>----------------- ', options);
        const columnCount = table.headers.length;
        const columnSpacing = options.columnSpacing || 15;
        const rowSpacing = options.rowSpacing || 5;
        const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);
        const headerStyles = options.headerStyles || [];
        const columnStyles = options.columnStyles || [];
        const summaryStyles = options.summaryStyles || [];
        const prepareHeader = options.prepareHeader || (() => {
        });
        const prepareRow = options.prepareRow || (() => {
        });
        const prepareSummary = options.prepareSummary || (() => {
        });
        const computeRowHeight = (row) => {
            let result = 0;

            row.forEach((cell) => {
                const cellHeight = this.heightOfString(cell, {
                    width: columnWidth,
                    align: 'left'
                });
                result = Math.max(result, cellHeight);
            });

            return result + rowSpacing;
        };

        const columnContainerWidth = usableWidth / columnCount;
        const columnWidth = columnContainerWidth - columnSpacing;
        const maxY = this.page.height - this.page.margins.bottom;

        let rowBottomY = 0;

        this.on('pageAdded', () => {
            startY = this.page.margins.top;
            rowBottomY = 0;
        });
        // Allow the user to override style for headers
        prepareHeader();
        // Check to have enough room for header and first rows
        if (startY + 3 * computeRowHeight(table.headers) > maxY)
            this.addPage();
        // Print all headers
        let headerLastX = startX;

        table.headers.forEach((header, i) => {
            let style = headerStyles[i] || {};
            let colWidth = 'width' in style ? style.width - columnSpacing : columnWidth;
            let colContainerWidth = 'width' in style ? headerLastX : startX + i * columnContainerWidth;
            console.log('headerStyles ----------------- > > >', header, i, style, 'x', colContainerWidth)
            this.text(header, colContainerWidth, startY, {
                width: colWidth,
                align: style.align || 'left'
            });

            headerLastX += colWidth + columnSpacing;
        });

        // Refresh the y coordinate of the bottom of the headers row
        rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

        // Separation line between headers and rows
        if (options.lineHeader)
            this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
                .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
                .lineWidth(2)
                .stroke();

        table.rows.forEach((row, i) => {
            const rowHeight = computeRowHeight(row);

            // Switch to next page if we cannot go any further because the space is over.
            // For safety, consider 3 rows margin instead of just one
            if (startY + 3 * rowHeight < maxY)
                startY = rowBottomY + rowSpacing;
            else
                this.addPage();
            console.log('startY', startY)
            // Allow the user to override style for rows
            prepareRow(row, i);

            // Print all cells of the current row
            let cellLastX = startX;
            row.forEach((cell, i) => {
                let style = columnStyles[i] || {};
                let colWidth = 'width' in style ? style.width - columnSpacing : columnWidth;
                let colContainerWidth = 'width' in style ? cellLastX : startX + i * columnContainerWidth;
                console.log('columnStyles ----------------- > > >', i, style, 'x', colContainerWidth, colWidth, startY)
                this.text(cell, colContainerWidth, startY, {
                    width: colWidth,
                    align: style.align || 'left'
                });
                cellLastX += colWidth + columnSpacing;
            });

            // Refresh the y coordinate of the bottom of this row
            rowBottomY = Math.max(startY + rowHeight, rowBottomY);

            // Separation line between rows
            if (options.lineRows)
                this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
                    .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
                    .lineWidth(1)
                    .opacity(0.7)
                    .stroke()
                    .opacity(1); // Reset opacity after drawing the line
        });
        if (table.summaryRow && table.summaryRow.length > 0) {
            prepareSummary();
            let summaryLastX = startX;
            table.summaryRow.forEach((summary, i) => {
                let style = summaryStyles[i] || {};
                let colWidth = 'width' in style ? style.width - columnSpacing : columnWidth;
                let colContainerWidth = 'width' in style ? summaryLastX : startX + i * columnContainerWidth;
                console.log('summaryStyles ----------------- > > >', i, style, summary)
                this.text(summary, colContainerWidth, rowBottomY + rowSpacing, {
                    width: colWidth,
                    align: style.align || 'left'
                });
                summaryLastX += colWidth + columnSpacing;
            });
        }
        this.x = startX;
        this.moveDown();

        return this;
    }
}

module.exports = PDFDocumentWithTables;