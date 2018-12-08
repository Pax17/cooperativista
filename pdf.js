const pdf = require('./pdfkitExtended');
const settings = require('electron-settings');
const { BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const dbHelper = require('./db/helper');
const { getDocumentsFolder, get } = require('platform-folders')
const PDFWindow = require('electron-pdf-window')
const i18n = new (require('./translations/i18n'));
const os = require('os');
module.exports = {
    //pdf: require('pdfkit'),
    winPdf: undefined,
    pointToMm: 0.352778,
    isEmpty: function (value, allowEmptyString) {
        return (value == null) || (!allowEmptyString ? value === '' : false) || (Array.isArray(value) && value.length === 0);
    },
    dateToFormat: function (date, reverse) {
        let formatted_date_arr = [];
        formatted_date_arr.push((date.getDate()).toString().padStart(2, '0'));
        formatted_date_arr.push((date.getMonth() + 1).toString().padStart(2, '0'));
        formatted_date_arr.push(date.getFullYear());
        if (reverse) return formatted_date_arr.slice(0).reverse().join('-');
        return formatted_date_arr.join('-');
    },
    previewLayout: function (options, printSettings) {
        const currentEntityData = settings.get('currentEntityData');
        options.info = {
            Title: 'Recibos Cooperativista',
            Author: settings.get('currentEntityData.name'),
            Subject: 'Impresión de recibos',
            ModDate: new Date(Date.now()).toLocaleString()
        }
        options.autoFirstPage = false;
        let doc = new pdf(options);
        let receipt_number = Math.floor(Math.random() * 10000) + 1;

        let { value: default_fee_amount } = dbHelper.doRead('helper_attr', ' * ', {
            taxonomy: 'default_fee_amount',
            status: 1
        }, null);
        let data = {
            family_x:
                [{
                    amount: parseFloat(default_fee_amount),
                    course_attribute_1: '',
                    course_attribute_2: '',
                    course_attribute_3: '',
                    course_attribute_4: '',
                    course_attribute_5: '',
                    course_name: '6',
                    course_name_2: 'A',
                    course_name_3: null,
                    course_type_code: 'C1',
                    course_type_description: 'Cursos',
                    currency: 'ARS',
                    family_attribute_1: '',
                    family_attribute_2: '',
                    family_attribute_3: '',
                    family_attribute_4: '',
                    family_attribute_5: '',
                    family_name: 'Nombre Familia',
                    family_name_2: 'Familiar 1',
                    family_name_3: 'Familiar 2',
                    family_type_code: 'F1',
                    family_type_description: 'Familias',
                    name: 'Nombre',
                    name_2: '',
                    name_3: 'Apellido',
                    notes: '',
                    payment_code: 'E1',
                    payment_description: 'Efectivo',
                    printed: '2018-12-05T03:00:00.000Z',
                    receipt_code: 'M1',
                    receipt_date: '2018-12-04T03:00:00.000Z',
                    receipt_description: 'Concepto del Pago',
                    receipt_number: '15.0',
                    receipt_period_end: '2018-12-31T03:00:00.000Z',
                    receipt_period_start: '2018-12-01T03:00:00.000Z',
                    type_code: 'A1',
                    type_description: 'Alumnos'
                }]
        };
        for (const receipt in data) {
            let lines = data[receipt];

            console.log(lines)
            let receipt_date = new Date();
            //let receipt_date_reverse = formatted_receipt_date_arr.slice(0).reverse().join('-');
            doc.addPage();
            if (printSettings.receipt_number.enabled) {
                let formatted_receipt_number_arr = [];
                if (!this.isEmpty(printSettings.receipt_number.legend))
                    formatted_receipt_number_arr.push(printSettings.receipt_number.legend);
                formatted_receipt_number_arr.push((receipt_number++).toString().padStart(7, '0'));

                doc.fontSize(printSettings.receipt_number.size).text(`${formatted_receipt_number_arr.join(' ')}`, printSettings.receipt_number.x, printSettings.receipt_number.y, { align: printSettings.receipt_number.align });

                console.log('ADD receipt_number', formatted_receipt_number_arr.join(' '), printSettings.receipt_number.x, printSettings.receipt_number.y, printSettings.receipt_number.size)
            }
            if (printSettings.receipt_date.enabled) {
                doc.fontSize(printSettings.receipt_date.size).text(`${this.dateToFormat(receipt_date)}`, printSettings.receipt_date.x, printSettings.receipt_date.y, { align: printSettings.receipt_date.align });
                console.log('ADD receipt_date', this.dateToFormat(receipt_date), printSettings.receipt_date.x, printSettings.receipt_date.y, printSettings.receipt_date.align)
            }
            if (printSettings.title.enabled) {
                doc.fontSize(printSettings.title.size).text(`${currentEntityData.name}`, printSettings.title.x, printSettings.title.y, { align: printSettings.title.align });
                if (currentEntityData.name_2 || currentEntityData.name_3) {
                    let subTitle = [];
                    if (!this.isEmpty(currentEntityData.name_2)) subTitle.push(currentEntityData.name_2);
                    if (!this.isEmpty(currentEntityData.name_3)) subTitle.push(currentEntityData.name_3);
                    doc.fontSize(printSettings.title.size_2).text(`${subTitle.join(' - ')}`, { align: printSettings.title.align });
                }
            }
            if (printSettings.address.enabled) {//attribute_1
                let address = [];
                if (!this.isEmpty(currentEntityData.attribute_1)) address.push(currentEntityData.attribute_1);
                if (!this.isEmpty(currentEntityData.attribute_2)) address.push(currentEntityData.attribute_2);
                doc.fontSize(printSettings.address.size).text(`${address.join(' - ')}`, printSettings.address.x, printSettings.address.y, { align: printSettings.address.align });
            }
            if (printSettings.lines.enabled) {//attribute_1

                console.log('ADD lines', printSettings.lines.size)
                doc.fontSize(printSettings.lines.size);
                let table = {
                    rows: []
                };
                let tableOptions = {
                    columnStyles: []
                };
                if (printSettings.lines.lineHeader) {
                    tableOptions.lineHeader = printSettings.lines.lineHeader;
                }
                if (printSettings.lines.lineRows) {
                    tableOptions.lineRows = printSettings.lines.lineRows;
                }
                let column_order = {};

                if (printSettings.lines.payment_date.enabled) {
                    column_order[printSettings.lines.payment_date.x] = 'payment_date';
                }
                if (printSettings.lines.partner.enabled) {
                    column_order[printSettings.lines.partner.x] = 'partner';
                }
                if (printSettings.lines.concept.enabled) {
                    column_order[printSettings.lines.concept.x] = 'concept';
                }
                if (printSettings.lines.amount.enabled) {
                    column_order[printSettings.lines.amount.x] = 'amount';
                }
                let colXpos = Object.keys(column_order),
                    colWidths = {};
                tableOptions.width = options.width || (doc.page.width - (printSettings.lines.x || doc.page.margins.left) - (printSettings.lines.x || doc.page.margins.right));
                if (printSettings.lines.showHeaders) {
                    table.headers = [];
                    tableOptions.headerStyles = [];
                }
                for (let colIndex of Object.values(column_order)) {
                    if (printSettings.lines.showHeaders) {
                        table.headers.push(printSettings.lines[colIndex].legend);
                        tableOptions.headerStyles.push({ align: printSettings.lines[colIndex].align });
                    }
                }
                for (let i = colXpos.length - 1; i >= 0; --i) {
                    let rightX = i === colXpos.length - 1 ? parseFloat(tableOptions.width + (printSettings.lines.x || doc.page.margins.left)) : parseFloat(colXpos[i + 1]);
                    let width = rightX - parseFloat(colXpos[i]);
                    if (printSettings.lines.showHeaders)
                        tableOptions.headerStyles[i].width = width;
                    colWidths[column_order[colXpos[i]]] = width;
                }
                let total = 0;
                for (const line of lines) {
                    console.log('ADD line', line)
                    let columns = [];
                    for (let colIndex of Object.values(column_order)) {
                        if (colIndex === 'payment_date') {
                            let payment_date = new Date();
                            payment_date.setDate(payment_date.getDate() - 2);
                            columns.push(`${this.dateToFormat(payment_date)}`);
                            tableOptions.columnStyles.push({
                                align: printSettings.lines.payment_date.align,
                                width: colWidths[colIndex]
                            });
                        }
                        if (colIndex === 'partner') {
                            let partner = [];
                            if (!this.isEmpty(line.name)) partner.push(line.name);
                            if (!this.isEmpty(line.name_2)) partner.push(line.name_2);
                            if (!this.isEmpty(line.name_3)) partner.push(line.name_3);
                            if (printSettings.lines.course.enabled) {
                                if (!this.isEmpty(line.name)) partner.push(`${line.course_name}º ${line.course_name_2}`);
                            }
                            columns.push(`${partner.join(' ')}`);
                            tableOptions.columnStyles.push({
                                align: printSettings.lines.partner.align,
                                width: colWidths[colIndex]
                            });
                        }
                        if (colIndex === 'concept') {
                            let concept = [];
                            if (!this.isEmpty(line.receipt_description)) concept.push(line.receipt_description);
                            if (line.receipt_code === 'M1') {
                                if (!this.isEmpty(line.receipt_period_start)) {
                                    let receipt_period_start = new Date();
                                    receipt_period_start.setDate(receipt_period_start.getDate() - 2);
                                    concept.push(this.monthNames[receipt_period_start.getMonth()]);
                                    concept.push(receipt_period_start.getFullYear());
                                }
                            }
                            //  doc.text(`${concept.join(' ')}`, printSettings.lines.concept.x, y, {align: printSettings.lines.concept.align});
                            columns.push(`${concept.join(' ')}`);
                            tableOptions.columnStyles.push({
                                align: printSettings.lines.concept.align,
                                width: colWidths[colIndex]
                            });
                        }
                        if (colIndex === 'amount') {
                            columns.push(`$${line.amount}`);
                            tableOptions.columnStyles.push({
                                align: printSettings.lines.amount.align,
                                width: colWidths[colIndex]
                            });
                            total += line.amount;
                        }
                    }
                    table.rows.push(columns);
                }
                if (printSettings.lines.amount.enabled && printSettings.lines.total.enabled) {
                    table.summaryRow = [];
                    tableOptions.summaryStyles = [];

                    for (let colIndex of Object.values(column_order)) {
                        let legend = this.isEmpty(printSettings.lines.total.legend) ? '' : printSettings.lines.total.legend;
                        let text = colIndex === 'amount' ? `${legend} $${total}` : ' ';
                        table.summaryRow.push(text);
                        tableOptions.summaryStyles.push({
                            align: printSettings.lines.amount.align,
                            width: colWidths[colIndex]
                        });
                    }
                }
                if (printSettings.lines.showHeaders) tableOptions.prepareHeader = () => doc.font('Helvetica-Bold').fontSize(printSettings.lines.size);
                if (printSettings.lines.enabled) tableOptions.prepareRow = (row, i) => doc.font('Helvetica').fontSize(printSettings.lines.size);
                if (printSettings.lines.total.enabled) tableOptions.prepareSummary = () => doc.font('Helvetica-Bold').fontSize(printSettings.lines.size);
                //tableOptions.width = tableOptions.width;

                doc.table(table, printSettings.lines.x, printSettings.lines.y, tableOptions);

                doc.font('Helvetica').fontSize(11);
            }
        }

        let fileName;
        let title = `Cooperativista-${(receipt_number - 1).toString().padStart(7, '0')}.pdf`

        fileName = path.join(os.tmpdir(), title)

        doc.pipe(fs.createWriteStream(fileName));
        doc.end();
        //console.log(`file:///${fileName}`, linesToUpdate)
        if (!this.winPdf || (this.winPdf && this.winPdf.isDestroyed()))
            this.winPdf = new PDFWindow({
                icon: './assets/icons/png/64x64.png',
                title: title,
                width: 800,
                height: 600
            });
        this.winPdf.loadURL(`${fileName}`);
    },
    generateReceipt: function (data) {
        //console.log(this);
        console.log(data);
        let options = settings.get('receipt.options') || {};
        let printSettings = settings.get('receipt.settings') || {};
        const currentEntityData = settings.get('currentEntityData');

        if (!('size' in options)) {
            options.size = 'A5';
        }
        if (!('layout' in options)) {
            options.layout = 'landscape';
        }
        if (!('margin' in options)) {
            options.margin = 30;
        }
        options.info = {
            Title: 'Recibos Cooperativista',
            Author: settings.get('currentEntityData.name'),
            Subject: 'Impresión de recibos',
            ModDate: new Date(Date.now()).toLocaleString()
        }
        options.autoFirstPage = false;
        //  console.log(options);
        // console.log(printSettings);
        let doc = new pdf(options);
        let last = dbHelper.doRead('helper_attr', ['value +1 receipt_number'], { 'taxonomy': 'receipt_number' }, null)
        console.log(last)
        if (!last) {
            dbHelper.doInsert(event, { 'taxonomy': 'receipt_number', 'value': 1 }, 'helper_attr');
            last = {
                receipt_number: 1
            }
        }
        let { receipt_number } = last;
        let controlPages = 0;
        const receipt_number_start = receipt_number;

        console.log(last, receipt_number_start, receipt_number)

        const linesToUpdate = [];
        for (const receipt in data) {
            let lines = data[receipt];
            let receipt_date = new Date();
            let formatted_receipt_date_arr = [];
            formatted_receipt_date_arr.push((receipt_date.getDate()).toString().padStart(2, '0'))
            formatted_receipt_date_arr.push((receipt_date.getMonth() + 1).toString().padStart(2, '0'))
            formatted_receipt_date_arr.push(receipt_date.getFullYear())
            let receipt_date_reverse = formatted_receipt_date_arr.slice(0).reverse().join('-')
            let hasPrinted = false
            for (const line of lines) {
                console.log('PRINTD XXXXXXXXXXXXXXXX', line.printed)
                if (line.printed !== null) hasPrinted = true;
            }
            let skip = false;
            if (hasPrinted) {
                dialog.showMessageBox({
                    type: 'warning',
                    message: 'Se encontraron elementos ya impresos. ¿Desea incluirlos en la impresión?',
                    buttons: [i18n.__('NO'), i18n.__('YES')]
                }, (choice) => {
                    if (choice === 0) skip = true;
                });
            }
            if (skip) continue;
            doc.addPage();
            controlPages++;
            if (printSettings.receipt_number.enabled) {
                let formatted_receipt_number_arr = [];
                if (!this.isEmpty(printSettings.receipt_number.legend))
                    formatted_receipt_number_arr.push(printSettings.receipt_number.legend);
                formatted_receipt_number_arr.push((receipt_number++).toString().padStart(7, '0'));
                doc.fontSize(printSettings.receipt_number.size).text(`${formatted_receipt_number_arr.join(' ')}`, printSettings.receipt_number.x, printSettings.receipt_number.y, { align: printSettings.receipt_number.align });
            }
            if (printSettings.receipt_date.enabled) {
                doc.fontSize(printSettings.receipt_date.size).text(`${formatted_receipt_date_arr.join('-')}`, printSettings.receipt_date.x, printSettings.receipt_date.y, { align: printSettings.receipt_date.align });
            }
            if (printSettings.title.enabled) {
                doc.fontSize(printSettings.title.size).text(`${currentEntityData.name}`, printSettings.title.x, printSettings.title.y, { align: printSettings.title.align });
                if (currentEntityData.name_2 || currentEntityData.name_3) {
                    let subTitle = [];
                    if (!this.isEmpty(currentEntityData.name_2)) subTitle.push(currentEntityData.name_2);
                    if (!this.isEmpty(currentEntityData.name_3)) subTitle.push(currentEntityData.name_3);
                    doc.fontSize(printSettings.title.size_2).text(`${subTitle.join(' - ')}`, { align: printSettings.title.align });
                }
            }
            if (printSettings.address.enabled) {//attribute_1
                let address = [];
                if (!this.isEmpty(currentEntityData.attribute_1)) address.push(currentEntityData.attribute_1);
                if (!this.isEmpty(currentEntityData.attribute_2)) address.push(currentEntityData.attribute_2);
                doc.fontSize(printSettings.address.size).text(`${address.join(' - ')}`, printSettings.address.x, printSettings.address.y, { align: printSettings.address.align });
            }
            if (printSettings.lines.enabled) {//attribute_1
                doc.fontSize(printSettings.lines.size);
                let table = {
                    // headers: [],
                    // headerStyles: [],
                    rows: []
                };
                let tableOptions = {
                    columnStyles: []
                };
                if (printSettings.lines.lineHeader) {
                    tableOptions.lineHeader = printSettings.lines.lineHeader;
                }
                if (printSettings.lines.lineRows) {
                    tableOptions.lineRows = printSettings.lines.lineRows;
                }
                let column_order = {};
                if (printSettings.lines.payment_date.enabled) {
                    column_order[printSettings.lines.payment_date.x] = 'payment_date';
                }
                if (printSettings.lines.partner.enabled) {
                    column_order[printSettings.lines.partner.x] = 'partner';
                }
                if (printSettings.lines.concept.enabled) {
                    column_order[printSettings.lines.concept.x] = 'concept';
                }
                if (printSettings.lines.amount.enabled) {
                    column_order[printSettings.lines.amount.x] = 'amount';
                }
                let colXpos = Object.keys(column_order),
                    colWidths = {};
                tableOptions.width = options.width || (doc.page.width - (printSettings.lines.x || doc.page.margins.left) - (printSettings.lines.x || doc.page.margins.right));
                console.log('tableOptions.width ---------------------xxx><>>', doc.page.width, (printSettings.lines.x || doc.page.margins.left), (printSettings.lines.x || doc.page.margins.right), doc.page.margins.left)
                if (printSettings.lines.showHeaders) {
                    table.headers = [];
                    tableOptions.headerStyles = [];
                }
                for (let colIndex of Object.values(column_order)) {
                    console.log(colIndex)
                    if (printSettings.lines.showHeaders) {
                        table.headers.push(printSettings.lines[colIndex].legend);
                        tableOptions.headerStyles.push({ align: printSettings.lines[colIndex].align });
                    }
                }
                console.log(tableOptions.headerStyles, colXpos.length - 1, colXpos, doc.page.margins.left)
                for (let i = colXpos.length - 1; i >= 0; --i) {
                    let rightX = i === colXpos.length - 1 ? parseFloat(tableOptions.width + (printSettings.lines.x || doc.page.margins.left)) : parseFloat(colXpos[i + 1]);


                    console.log('rightX: ', rightX, i, 'colXpos: ', colXpos[i], 'width', rightX - colXpos[i], tableOptions.width);

                    let width = rightX - parseFloat(colXpos[i]);
                    if (printSettings.lines.showHeaders)
                        tableOptions.headerStyles[i].width = width;
                    colWidths[column_order[colXpos[i]]] = width;
                    console.log('desde', colXpos[i], 'hasta', rightX - 2)

                }
                console.log('colWidths ---------------------xxx><>>', colWidths, Object.values(colWidths).reduce((x, y) => x + y, 0));
                //return;
                let total = 0;
                for (const line of lines) {
                    linesToUpdate.push({
                        id: line.id,
                        printed: `${receipt_date_reverse}`,
                        receipt_number: receipt_number - 1
                    })

                    let columns = [];
                    for (let colIndex of Object.values(column_order)) {
                        if (colIndex === 'payment_date') {
                            let payment_date = new Date(line.receipt_date);
                            let formatted_payment_date_arr = [];
                            formatted_payment_date_arr.push((payment_date.getDate()).toString().padStart(2, '0'))
                            formatted_payment_date_arr.push((payment_date.getMonth() + 1).toString().padStart(2, '0'))
                            formatted_payment_date_arr.push(payment_date.getFullYear());
                            columns.push(`${formatted_payment_date_arr.join('-')}`);
                            tableOptions.columnStyles.push({
                                align: printSettings.lines.payment_date.align,
                                width: colWidths[colIndex]
                            });

                        }

                        if (colIndex === 'partner') {
                            let partner = [];
                            if (!this.isEmpty(line.name)) partner.push(line.name);
                            if (!this.isEmpty(line.name_2)) partner.push(line.name_2);
                            if (!this.isEmpty(line.name_3)) partner.push(line.name_3);
                            if (printSettings.lines.course.enabled) {
                                if (!this.isEmpty(line.name)) partner.push(`${line.course_name}º ${line.course_name_2}`);
                            }
                            columns.push(`${partner.join(' ')}`);
                            tableOptions.columnStyles.push({
                                align: printSettings.lines.partner.align,
                                width: colWidths[colIndex]
                            });
                        }
                        if (colIndex === 'concept') {
                            let concept = [];
                            if (!this.isEmpty(line.receipt_description)) concept.push(line.receipt_description);
                            if (line.receipt_code === 'M1') {
                                if (!this.isEmpty(line.receipt_period_start)) {
                                    let receipt_period_start = new Date(line.receipt_period_start);
                                    concept.push(this.monthNames[receipt_period_start.getMonth()]);
                                    concept.push(receipt_period_start.getFullYear());
                                }
                            }
                            //  doc.text(`${concept.join(' ')}`, printSettings.lines.concept.x, y, {align: printSettings.lines.concept.align});
                            columns.push(`${concept.join(' ')}`);
                            tableOptions.columnStyles.push({
                                align: printSettings.lines.concept.align,
                                width: colWidths[colIndex]
                            });
                        }
                        if (colIndex === 'amount') {
                            columns.push(`$${line.amount}`);
                            tableOptions.columnStyles.push({
                                align: printSettings.lines.amount.align,
                                width: colWidths[colIndex]
                            });
                            total += line.amount;
                        }

                        //<debug>
                        console.debug(colIndex, ' ------------------------ ', colWidths[colIndex]);
                        //</debug>
                    }
                    table.rows.push(columns);
                }
                if (printSettings.lines.amount.enabled && printSettings.lines.total.enabled) {
                    table.summaryRow = [];
                    tableOptions.summaryStyles = [];

                    for (let colIndex of Object.values(column_order)) {
                        let legend = this.isEmpty(printSettings.lines.total.legend) ? '' : this.isEmpty(printSettings.lines.total.legend);
                        let text = colIndex === 'amount' ? `${legend} $${total}` : ' ';
                        table.summaryRow.push(text);
                        tableOptions.summaryStyles.push({
                            align: printSettings.lines.amount.align,
                            width: colWidths[colIndex]
                        });
                    }
                    console.log(tableOptions.summaryStyles)
                    // table.summaryRow.push(columns);
                }
                if (printSettings.lines.showHeaders) tableOptions.prepareHeader = () => doc.font('Helvetica-Bold').fontSize(printSettings.lines.size);
                if (printSettings.lines.enabled) tableOptions.prepareRow = (row, i) => doc.font('Helvetica').fontSize(printSettings.lines.size);
                if (printSettings.lines.total.enabled) tableOptions.prepareSummary = () => doc.font('Helvetica-Bold').fontSize(printSettings.lines.size);
                //tableOptions.width = tableOptions.width;

                doc.table(table, printSettings.lines.x, printSettings.lines.y, tableOptions);

                doc.font('Helvetica').fontSize(11);
            }
        }
        if (controlPages === 0) return;
        const dataStore = path.join(getDocumentsFolder(), 'Cooperativista', settings.get('currentEntityData.name'));
        console.log(dataStore)
        if (!fs.existsSync(dataStore)) {
            if (!fs.existsSync(path.join(getDocumentsFolder(), 'Cooperativista')))
                fs.mkdirSync(path.join(getDocumentsFolder(), 'Cooperativista'), { recursive: true });
            fs.mkdirSync(dataStore, { recursive: true });
        }
        let fileName, title;
        if (receipt_number_start !== receipt_number - 1) {
            title = `Recibos-${(receipt_number_start).toString().padStart(7, '0')}-${receipt_number - 1}.pdf`
        } else {
            title = `Recibo-${(receipt_number - 1).toString().padStart(7, '0')}.pdf`
        }
        fileName = path.join(dataStore, title)

        doc.pipe(fs.createWriteStream(fileName));
        doc.end();
        dbHelper.doUpdate(null, {
            taxonomy: 'receipt_number',
            value: receipt_number - 1
        }, 'helper_attr', ['taxonomy'], { value: 'asInt' });
        let focusedWindow = BrowserWindow.getFocusedWindow();
        console.log(`file:///${fileName}`, linesToUpdate)
        if (!this.winPdf || (this.winPdf && this.winPdf.isDestroyed()))
            this.winPdf = new PDFWindow({
                icon: './assets/icons/png/64x64.png',
                title: title,
                width: 800,
                height: 600
            });
        console.log(this.winPdf)
        this.winPdf.loadURL(`${fileName}`)

        for (const line of linesToUpdate) {
            dbHelper.doUpdate(null, line, 'receipts', ['id']);
        }
        if (focusedWindow)
            focusedWindow.webContents.send('pdf-done', { receipts: linesToUpdate.length })

        // this.winPdf.show()
        /* dialog.showSaveDialog({
             defaultPath: fileName,
             filters: [{name: 'PDF', extensions: ['pdf']}]
         }, (fileName) => {
             if (fileName === undefined) {
                 console.log("You didn't save the file");
                 return;
             }
             console.log(fileName);
             dbHelper.doUpdate(null, {
                 taxonomy: 'receipt_number',
                 value: receipt_number - 1
             }, 'helper_attr', ['taxonomy'], {value: 'asInt'});

             doc.pipe(fs.createWriteStream(fileName));
             doc.end();
         });*/

    },
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

}