/**
 * DOCX Generator - Generates the actual DOCX file from document structure
 * Based on export and file generation classes from PDFLibTool.dll.c
 */

import JSZip from 'jszip';

/**
 * DOCX File structure constants
 */
const DOCX_CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
    <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
    <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
    <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
    <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const MAIN_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
    <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const DOCUMENT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
    <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>`;

/**
 * XML Namespaces for DOCX
 */
const XML_NAMESPACES = {
    w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    wp: 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
    pic: 'http://schemas.openxmlformats.org/drawingml/2006/picture',
    v: 'urn:schemas-microsoft-com:vml',
    o: 'urn:schemas-microsoft-com:office:office'
};

/**
 * DOCX Generator class (inspired by CPdfExport, CPdfWriter, file generation)
 */
class DOCXGenerator {
    constructor() {
        this.generationOptions = {
            prettyPrint: false,
            validateXml: false,
            includeComments: false,
            compressImages: true,
            optimizeSize: true
        };

        this.zip = null;
        this.relationshipCounter = 1;
        this.mediaCounter = 1;
    }

    /**
     * Generate DOCX file buffer from document structure
     * Main generation method inspired by export functionality in PDFLibTool.dll.c
     */
    async generateDocx(docxDocument) {
        try {
            this.zip = new JSZip();

            // Create DOCX file structure
            await this._createDocxStructure();

            // Generate core document files
            await this._generateDocumentXml(docxDocument);
            await this._generateStylesXml(docxDocument);
            await this._generateNumberingXml(docxDocument);
            await this._generateSettingsXml(docxDocument);

            // Generate document properties
            await this._generateCorePropertiesXml(docxDocument);
            await this._generateAppPropertiesXml(docxDocument);

            // Generate the ZIP file
            const buffer = await this.zip.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: this.generationOptions.optimizeSize ? 9 : 6
                }
            });

            return buffer;

        } catch (error) {
            throw new Error(`DOCX generation failed: ${error.message}`);
        }
    }

    /**
     * Create basic DOCX file structure
     */
    async _createDocxStructure() {
        // Create directory structure
        this.zip.folder('_rels');
        this.zip.folder('docProps');
        this.zip.folder('word');
        this.zip.folder('word/_rels');

        // Add static files
        this.zip.file('[Content_Types].xml', DOCX_CONTENT_TYPES);
        this.zip.file('_rels/.rels', MAIN_RELS);
        this.zip.file('word/_rels/document.xml.rels', DOCUMENT_RELS);
    }

    /**
     * Generate main document.xml file
     */
    async _generateDocumentXml(docxDocument) {
        let xml = this._createXmlHeader();
        
        xml += `<w:document xmlns:w="${XML_NAMESPACES.w}" xmlns:r="${XML_NAMESPACES.r}">`;
        xml += '<w:body>';

        // Process each section
        for (const section of docxDocument.sections) {
            xml += await this._generateSectionXml(section);
        }

        // Add section properties
        xml += this._generateSectionPropertiesXml(docxDocument.sections[0]);

        xml += '</w:body>';
        xml += '</w:document>';

        this.zip.file('word/document.xml', xml);
    }

    /**
     * Generate section XML
     */
    async _generateSectionXml(section) {
        let xml = '';

        for (const element of section.elements) {
            if (Array.isArray(element)) {
                // Handle list items (returned as arrays)
                for (const listItem of element) {
                    xml += this._generateParagraphXml(listItem);
                }
            } else {
                xml += await this._generateElementXml(element);
            }
        }

        return xml;
    }

    /**
     * Generate element XML based on type
     */
    async _generateElementXml(element) {
        switch (element.type) {
            case 'paragraph':
                return this._generateParagraphXml(element);
            
            case 'table':
                return this._generateTableXml(element);
            
            default:
                console.warn(`Unknown element type for XML generation: ${element.type}`);
                return '';
        }
    }

    /**
     * Generate paragraph XML
     */
    _generateParagraphXml(paragraph) {
        let xml = '<w:p>';
        
        // Add paragraph properties
        xml += this._generateParagraphPropertiesXml(paragraph);

        // Add runs
        for (const run of paragraph.runs) {
            xml += this._generateRunXml(run);
        }

        xml += '</w:p>';
        return xml;
    }

    /**
     * Generate paragraph properties XML
     */
    _generateParagraphPropertiesXml(paragraph) {
        let xml = '<w:pPr>';

        // Style reference
        if (paragraph.style) {
            xml += `<w:pStyle w:val="${this._escapeXml(paragraph.style)}"/>`;
        }

        // Alignment
        if (paragraph.properties.alignment && paragraph.properties.alignment !== 'left') {
            xml += `<w:jc w:val="${paragraph.properties.alignment}"/>`;
        }

        // Spacing
        if (paragraph.properties.spacing) {
            const spacing = paragraph.properties.spacing;
            if (spacing.before || spacing.after || spacing.line) {
                xml += '<w:spacing';
                if (spacing.before) xml += ` w:before="${spacing.before}"`;
                if (spacing.after) xml += ` w:after="${spacing.after}"`;
                if (spacing.line) xml += ` w:line="${spacing.line}"`;
                xml += '/>';
            }
        }

        // Indentation
        if (paragraph.properties.indent) {
            const indent = paragraph.properties.indent;
            if (indent.left || indent.right || indent.firstLine || indent.hanging) {
                xml += '<w:ind';
                if (indent.left) xml += ` w:left="${indent.left}"`;
                if (indent.right) xml += ` w:right="${indent.right}"`;
                if (indent.firstLine) xml += ` w:firstLine="${indent.firstLine}"`;
                if (indent.hanging) xml += ` w:hanging="${indent.hanging}"`;
                xml += '/>';
            }
        }

        // Numbering (for lists)
        if (paragraph.properties.numbering) {
            const numbering = paragraph.properties.numbering;
            xml += `<w:numPr>`;
            xml += `<w:ilvl w:val="${numbering.level || 0}"/>`;
            xml += `<w:numId w:val="${numbering.numberingId}"/>`;
            xml += `</w:numPr>`;
        }

        // Page break before
        if (paragraph.properties.pageBreakBefore) {
            xml += '<w:pageBreakBefore/>';
        }

        xml += '</w:pPr>';
        return xml;
    }

    /**
     * Generate run XML
     */
    _generateRunXml(run) {
        let xml = '<w:r>';

        // Add run properties
        xml += this._generateRunPropertiesXml(run);

        // Add text
        xml += '<w:t';
        if (this._needsSpacePreservation(run.text)) {
            xml += ' xml:space="preserve"';
        }
        xml += `>${this._escapeXml(run.text)}</w:t>`;

        xml += '</w:r>';
        return xml;
    }

    /**
     * Generate run properties XML
     */
    _generateRunPropertiesXml(run) {
        const props = run.properties;
        let xml = '<w:rPr>';

        // Font family
        if (props.fontFamily) {
            xml += `<w:rFonts w:ascii="${this._escapeXml(props.fontFamily)}" w:hAnsi="${this._escapeXml(props.fontFamily)}"/>`;
        }

        // Font size
        if (props.fontSize) {
            const size = Math.round(props.fontSize * 2); // Convert to half-points
            xml += `<w:sz w:val="${size}"/>`;
            xml += `<w:szCs w:val="${size}"/>`;
        }

        // Bold
        if (props.bold) {
            xml += '<w:b/>';
            xml += '<w:bCs/>';
        }

        // Italic
        if (props.italic) {
            xml += '<w:i/>';
            xml += '<w:iCs/>';
        }

        // Underline
        if (props.underline) {
            xml += '<w:u w:val="single"/>';
        }

        // Strikethrough
        if (props.strikethrough) {
            xml += '<w:strike/>';
        }

        // Color
        if (props.color) {
            xml += `<w:color w:val="${props.color}"/>`;
        }

        // Highlight
        if (props.highlight) {
            xml += `<w:highlight w:val="${props.highlight}"/>`;
        }

        xml += '</w:rPr>';
        return xml;
    }

    /**
     * Generate table XML
     */
    _generateTableXml(table) {
        let xml = '<w:tbl>';

        // Add table properties
        xml += this._generateTablePropertiesXml(table);

        // Add table rows
        for (const row of table.rows) {
            xml += this._generateTableRowXml(row);
        }

        xml += '</w:tbl>';
        return xml;
    }

    /**
     * Generate table properties XML
     */
    _generateTablePropertiesXml(table) {
        let xml = '<w:tblPr>';

        // Table style
        if (table.properties.style) {
            xml += `<w:tblStyle w:val="${this._escapeXml(table.properties.style)}"/>`;
        }

        // Table width
        if (table.properties.width) {
            xml += `<w:tblW w:w="${table.properties.width.size}" w:type="${table.properties.width.type}"/>`;
        }

        // Table alignment
        if (table.properties.alignment) {
            xml += `<w:jc w:val="${table.properties.alignment}"/>`;
        }

        // Table borders
        if (table.properties.borders) {
            xml += '<w:tblBorders>';
            xml += '<w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/>';
            xml += '<w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/>';
            xml += '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/>';
            xml += '<w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/>';
            xml += '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/>';
            xml += '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/>';
            xml += '</w:tblBorders>';
        }

        xml += '</w:tblPr>';
        return xml;
    }

    /**
     * Generate table row XML
     */
    _generateTableRowXml(row) {
        let xml = '<w:tr>';

        // Add row properties
        if (row.properties.header || row.properties.height || row.properties.cantSplit) {
            xml += '<w:trPr>';
            
            if (row.properties.header) {
                xml += '<w:tblHeader/>';
            }
            
            if (row.properties.height) {
                xml += `<w:trHeight w:val="${row.properties.height}"/>`;
            }
            
            if (row.properties.cantSplit) {
                xml += '<w:cantSplit/>';
            }
            
            xml += '</w:trPr>';
        }

        // Add table cells
        for (const cell of row.cells) {
            xml += this._generateTableCellXml(cell);
        }

        xml += '</w:tr>';
        return xml;
    }

    /**
     * Generate table cell XML
     */
    _generateTableCellXml(cell) {
        let xml = '<w:tc>';

        // Add cell properties
        xml += '<w:tcPr>';
        
        if (cell.properties.width) {
            xml += `<w:tcW w:w="${cell.properties.width}" w:type="dxa"/>`;
        }
        
        if (cell.properties.verticalAlignment) {
            xml += `<w:vAlign w:val="${cell.properties.verticalAlignment}"/>`;
        }
        
        xml += '</w:tcPr>';

        // Add cell content
        for (const element of cell.elements) {
            xml += this._generateParagraphXml(element);
        }

        xml += '</w:tc>';
        return xml;
    }

    /**
     * Generate styles.xml file
     */
    async _generateStylesXml(docxDocument) {
        let xml = this._createXmlHeader();
        
        xml += `<w:styles xmlns:w="${XML_NAMESPACES.w}" xmlns:r="${XML_NAMESPACES.r}">`;

        // Generate default styles
        xml += this._generateDefaultStylesXml();

        // Generate custom styles
        for (const style of docxDocument.styles.values()) {
            xml += this._generateStyleXml(style);
        }

        xml += '</w:styles>';

        this.zip.file('word/styles.xml', xml);
    }

    /**
     * Generate default styles XML
     */
    _generateDefaultStylesXml() {
        let xml = '';

        // Document defaults
        xml += '<w:docDefaults>';
        xml += '<w:rPrDefault>';
        xml += '<w:rPr>';
        xml += '<w:rFonts w:ascii="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>';
        xml += '<w:sz w:val="24"/>';
        xml += '<w:szCs w:val="24"/>';
        xml += '<w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/>';
        xml += '</w:rPr>';
        xml += '</w:rPrDefault>';
        xml += '<w:pPrDefault/>';
        xml += '</w:docDefaults>';

        return xml;
    }

    /**
     * Generate individual style XML
     */
    _generateStyleXml(style) {
        let xml = `<w:style w:type="${style.type}" w:styleId="${style.styleId}">`;
        xml += `<w:name w:val="${this._escapeXml(style.name)}"/>`;

        if (style.basedOn) {
            xml += `<w:basedOn w:val="${this._escapeXml(style.basedOn)}"/>`;
        }

        // Paragraph properties
        if (style.properties.paragraph) {
            xml += '<w:pPr>';
            const pPr = style.properties.paragraph;
            
            if (pPr.alignment) {
                xml += `<w:jc w:val="${pPr.alignment}"/>`;
            }
            
            if (pPr.spaceBefore || pPr.spaceAfter) {
                xml += '<w:spacing';
                if (pPr.spaceBefore) xml += ` w:before="${pPr.spaceBefore}"`;
                if (pPr.spaceAfter) xml += ` w:after="${pPr.spaceAfter}"`;
                xml += '/>';
            }
            
            xml += '</w:pPr>';
        }

        // Run properties
        if (style.properties.font) {
            xml += '<w:rPr>';
            const rPr = style.properties.font;
            
            if (rPr.name) {
                xml += `<w:rFonts w:ascii="${this._escapeXml(rPr.name)}" w:hAnsi="${this._escapeXml(rPr.name)}"/>`;
            }
            
            if (rPr.size) {
                xml += `<w:sz w:val="${rPr.size}"/>`;
                xml += `<w:szCs w:val="${rPr.size}"/>`;
            }
            
            if (rPr.bold) {
                xml += '<w:b/>';
                xml += '<w:bCs/>';
            }
            
            if (rPr.italic) {
                xml += '<w:i/>';
                xml += '<w:iCs/>';
            }
            
            if (rPr.color) {
                xml += `<w:color w:val="${rPr.color}"/>`;
            }
            
            xml += '</w:rPr>';
        }

        xml += '</w:style>';
        return xml;
    }

    /**
     * Generate numbering.xml file
     */
    async _generateNumberingXml(docxDocument) {
        let xml = this._createXmlHeader();
        
        xml += `<w:numbering xmlns:w="${XML_NAMESPACES.w}">`;

        // Generate abstract numbering definitions
        for (const numbering of docxDocument.numbering) {
            xml += this._generateAbstractNumberingXml(numbering);
        }

        // Generate numbering instances
        for (const numbering of docxDocument.numbering) {
            xml += this._generateNumberingInstanceXml(numbering);
        }

        xml += '</w:numbering>';

        this.zip.file('word/numbering.xml', xml);
    }

    /**
     * Generate abstract numbering XML
     */
    _generateAbstractNumberingXml(numbering) {
        let xml = `<w:abstractNum w:abstractNumId="${numbering.abstractNumId}">`;

        for (const level of numbering.levels) {
            xml += `<w:lvl w:ilvl="${level.level}">`;
            xml += `<w:start w:val="1"/>`;
            xml += `<w:numFmt w:val="${level.format}"/>`;
            xml += `<w:lvlText w:val="${this._escapeXml(level.text)}"/>`;
            xml += `<w:lvlJc w:val="${level.alignment}"/>`;
            
            // Paragraph properties for level
            xml += '<w:pPr>';
            xml += `<w:ind w:left="${level.indent.left}" w:hanging="${level.indent.hanging}"/>`;
            xml += '</w:pPr>';
            
            // Run properties for level
            xml += '<w:rPr>';
            xml += `<w:rFonts w:ascii="${level.font.name}" w:hAnsi="${level.font.name}"/>`;
            xml += `<w:sz w:val="${level.font.size}"/>`;
            xml += '</w:rPr>';
            
            xml += '</w:lvl>';
        }

        xml += '</w:abstractNum>';
        return xml;
    }

    /**
     * Generate numbering instance XML
     */
    _generateNumberingInstanceXml(numbering) {
        let xml = `<w:num w:numId="${numbering.numberingId}">`;
        xml += `<w:abstractNumId w:val="${numbering.abstractNumId}"/>`;
        xml += '</w:num>';
        return xml;
    }

    /**
     * Generate settings.xml file
     */
    async _generateSettingsXml(docxDocument) {
        let xml = this._createXmlHeader();
        
        xml += `<w:settings xmlns:w="${XML_NAMESPACES.w}">`;
        
        const settings = docxDocument.settings;
        
        if (settings.defaultTabStop) {
            xml += `<w:defaultTabStop w:val="${settings.defaultTabStop}"/>`;
        }
        
        if (settings.characterSpacingControl) {
            xml += `<w:characterSpacingControl w:val="${settings.characterSpacingControl}"/>`;
        }
        
        if (settings.compatibilityMode) {
            xml += '<w:compat>';
            xml += `<w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="${settings.compatibilityMode}"/>`;
            xml += '</w:compat>';
        }
        
        xml += '</w:settings>';

        this.zip.file('word/settings.xml', xml);
    }

    /**
     * Generate core properties XML
     */
    async _generateCorePropertiesXml(docxDocument) {
        const props = docxDocument.properties;
        
        let xml = this._createXmlHeader();
        xml += '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ';
        xml += 'xmlns:dc="http://purl.org/dc/elements/1.1/" ';
        xml += 'xmlns:dcterms="http://purl.org/dc/terms/" ';
        xml += 'xmlns:dcmitype="http://purl.org/dc/dcmitype/" ';
        xml += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';

        if (props.title) {
            xml += `<dc:title>${this._escapeXml(props.title)}</dc:title>`;
        }

        if (props.author) {
            xml += `<dc:creator>${this._escapeXml(props.author)}</dc:creator>`;
        }

        if (props.subject) {
            xml += `<dc:subject>${this._escapeXml(props.subject)}</dc:subject>`;
        }

        if (props.keywords) {
            xml += `<cp:keywords>${this._escapeXml(props.keywords)}</cp:keywords>`;
        }

        xml += `<dcterms:created xsi:type="dcterms:W3CDTF">${props.created}</dcterms:created>`;
        xml += `<dcterms:modified xsi:type="dcterms:W3CDTF">${props.modified}</dcterms:modified>`;

        xml += '</cp:coreProperties>';

        this.zip.file('docProps/core.xml', xml);
    }

    /**
     * Generate app properties XML
     */
    async _generateAppPropertiesXml(docxDocument) {
        const props = docxDocument.properties;
        
        let xml = this._createXmlHeader();
        xml += '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" ';
        xml += 'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">';

        xml += `<Application>${this._escapeXml(props.application || 'PDF to DOCX Converter')}</Application>`;
        xml += '<DocSecurity>0</DocSecurity>';
        xml += '<ScaleCrop>false</ScaleCrop>';
        xml += '<SharedDoc>false</SharedDoc>';
        xml += '<HyperlinksChanged>false</HyperlinksChanged>';
        xml += '<AppVersion>1.0000</AppVersion>';

        xml += '</Properties>';

        this.zip.file('docProps/app.xml', xml);
    }

    /**
     * Generate section properties XML
     */
    _generateSectionPropertiesXml(section) {
        let xml = '<w:sectPr>';

        // Page size
        if (section.properties.pageSize) {
            xml += `<w:pgSz w:w="${section.properties.pageSize.width}" w:h="${section.properties.pageSize.height}"/>`;
        }

        // Page margins
        if (section.properties.margins) {
            const margins = section.properties.margins;
            xml += `<w:pgMar w:top="${margins.top}" w:right="${margins.right}" w:bottom="${margins.bottom}" w:left="${margins.left}" w:header="720" w:footer="720" w:gutter="0"/>`;
        }

        // Page orientation
        if (section.properties.orientation === 'landscape') {
            xml += '<w:pgSz w:orient="landscape"/>';
        }

        xml += '</w:sectPr>';
        return xml;
    }

    /**
     * Create XML header
     */
    _createXmlHeader() {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    }

    /**
     * Escape XML special characters
     */
    _escapeXml(text) {
        if (typeof text !== 'string') return text;
        
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /**
     * Check if text needs space preservation
     */
    _needsSpacePreservation(text) {
        return /^\s|\s$|\s\s/.test(text);
    }

    /**
     * Get generation summary
     */
    getGenerationSummary() {
        return {
            filesGenerated: this.zip ? Object.keys(this.zip.files).length : 0,
            compressionUsed: this.generationOptions.optimizeSize,
            relationshipsCreated: this.relationshipCounter - 1,
            mediaEmbedded: this.mediaCounter - 1
        };
    }
}

export default DOCXGenerator;
