/**
 * Document Builder - Builds DOCX document structure from styled content
 * Based on document building and export classes from PDFLibTool.dll.c
 */

/**
 * DOCX Document structure
 */
class DocxDocument {
    constructor() {
        this.properties = {};        // Document properties
        this.styles = new Map();     // Style definitions
        this.sections = [];          // Document sections
        this.numbering = [];         // Numbering definitions
        this.relationships = [];     // Document relationships
        this.media = [];            // Embedded media
        this.settings = {};         // Document settings
    }
}

/**
 * DOCX Section structure
 */
class DocxSection {
    constructor() {
        this.properties = {};        // Section properties (margins, orientation, etc.)
        this.headers = [];          // Section headers
        this.footers = [];          // Section footers
        this.elements = [];         // Section content elements
    }
}

/**
 * DOCX Element types
 */
class DocxElement {
    constructor(type) {
        this.type = type;           // 'paragraph', 'table', 'image', etc.
        this.properties = {};       // Element properties
        this.content = [];          // Element content
    }
}

/**
 * DOCX Paragraph element
 */
class DocxParagraph extends DocxElement {
    constructor() {
        super('paragraph');
        this.style = null;          // Applied style
        this.runs = [];             // Text runs
        this.properties = {
            alignment: 'left',
            spacing: {},
            indent: {},
            borders: {},
            shading: {}
        };
    }
}

/**
 * DOCX Text Run
 */
class DocxRun {
    constructor(text) {
        this.text = text;
        this.properties = {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            fontSize: null,
            fontFamily: null,
            color: null,
            highlight: null
        };
    }
}

/**
 * DOCX Table element
 */
class DocxTable extends DocxElement {
    constructor() {
        super('table');
        this.rows = [];             // Table rows
        this.properties = {
            style: null,
            width: null,
            borders: {},
            margins: {},
            alignment: 'left'
        };
    }
}

/**
 * DOCX Table Row
 */
class DocxTableRow {
    constructor() {
        this.cells = [];            // Table cells
        this.properties = {
            height: null,
            header: false,
            cantSplit: false
        };
    }
}

/**
 * DOCX Table Cell
 */
class DocxTableCell {
    constructor() {
        this.elements = [];         // Cell content (paragraphs, etc.)
        this.properties = {
            width: null,
            borders: {},
            shading: {},
            margins: {},
            verticalAlignment: 'top'
        };
    }
}

/**
 * DOCX List element
 */
class DocxList extends DocxElement {
    constructor() {
        super('list');
        this.items = [];            // List items (paragraphs with numbering)
        this.properties = {
            numberingId: null,
            level: 0
        };
    }
}

/**
 * Document Builder class (inspired by CPdfExport, CPdfWriter, DocumentBuilder patterns)
 */
class DocumentBuilder {
    constructor() {
        this.buildOptions = {
            includeStyles: true,
            includeNumbering: true,
            preservePageBreaks: true,
            generateToc: false,
            embedFonts: false,
            compressImages: true
        };

        this.numberingId = 1;       // Counter for numbering definitions
        this.styleId = 1;           // Counter for style IDs
        this.relationshipId = 1;    // Counter for relationships
    }

    /**
     * Build DOCX document from styled content
     * Main building method inspired by document construction in PDFLibTool.dll.c
     */
    async buildDocument(styledContent, options = {}) {
        try {
            // Merge options
            this.buildOptions = { ...this.buildOptions, ...options };

            const docxDocument = new DocxDocument();

            // Set document properties
            docxDocument.properties = this._buildDocumentProperties(styledContent);

            // Add style definitions
            if (this.buildOptions.includeStyles) {
                docxDocument.styles = this._buildStyleDefinitions(styledContent.styles);
            }

            // Add numbering definitions for lists
            if (this.buildOptions.includeNumbering) {
                docxDocument.numbering = this._buildNumberingDefinitions(styledContent);
            }

            // Build document sections
            docxDocument.sections = await this._buildSections(styledContent);

            // Set document settings
            docxDocument.settings = this._buildDocumentSettings();

            return docxDocument;

        } catch (error) {
            throw new Error(`Document building failed: ${error.message}`);
        }
    }

    /**
     * Build document properties
     */
    _buildDocumentProperties(styledContent) {
        const metadata = styledContent.metadata;
        
        return {
            title: metadata.originalDocumentInfo?.title || 'Converted PDF Document',
            author: metadata.originalDocumentInfo?.author || 'PDF Converter',
            subject: metadata.originalDocumentInfo?.subject || '',
            keywords: metadata.originalDocumentInfo?.keywords || '',
            creator: 'PDF to DOCX Converter',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            application: 'PDF to DOCX Converter v1.0'
        };
    }

    /**
     * Build style definitions for DOCX
     */
    _buildStyleDefinitions(styles) {
        const docxStyles = new Map();

        for (const [styleName, style] of styles) {
            const docxStyle = {
                styleId: this._generateStyleId(styleName),
                name: styleName,
                type: style.type,
                basedOn: style.basedOn,
                properties: this._convertStyleProperties(style.properties)
            };

            docxStyles.set(styleName, docxStyle);
        }

        return docxStyles;
    }

    /**
     * Generate unique style ID
     */
    _generateStyleId(styleName) {
        return styleName.replace(/\s+/g, '') + (this.styleId++);
    }

    /**
     * Convert style properties to DOCX format
     */
    _convertStyleProperties(properties) {
        const docxProperties = {};

        // Convert font properties
        if (properties.font) {
            docxProperties.font = {
                name: properties.font.name,
                size: properties.font.size * 2, // Convert to half-points
                bold: properties.font.bold,
                italic: properties.font.italic,
                underline: properties.font.underline,
                strikethrough: properties.font.strikethrough,
                color: properties.font.color
            };
        }

        // Convert paragraph properties
        if (properties.paragraph) {
            docxProperties.paragraph = {
                alignment: properties.paragraph.alignment,
                spaceBefore: properties.paragraph.spaceBefore,
                spaceAfter: properties.paragraph.spaceAfter,
                lineSpacing: Math.round(properties.paragraph.lineSpacing * 240), // Convert to twips
                indent: {
                    left: properties.paragraph.indent.left,
                    right: properties.paragraph.indent.right,
                    firstLine: properties.paragraph.indent.firstLine,
                    hanging: properties.paragraph.indent.hanging
                },
                keepNext: properties.paragraph.keepNext,
                keepLines: properties.paragraph.keepLines,
                pageBreakBefore: properties.paragraph.pageBreakBefore
            };
        }

        // Convert table properties
        if (properties.table) {
            docxProperties.table = {
                borders: properties.table.borders,
                borderWidth: properties.table.borderWidth,
                borderColor: properties.table.borderColor,
                cellMargin: properties.table.cellMargin
            };
        }

        return docxProperties;
    }

    /**
     * Build numbering definitions for lists
     */
    _buildNumberingDefinitions(styledContent) {
        const numberingDefinitions = [];
        const processedStyles = new Set();

        // Find all list styles
        styledContent.sections.forEach(section => {
            section.elements.forEach(element => {
                if (element.type === 'list' && !processedStyles.has(element.style)) {
                    const numberingDef = this._createNumberingDefinition(element);
                    if (numberingDef) {
                        numberingDefinitions.push(numberingDef);
                        processedStyles.add(element.style);
                    }
                }
            });
        });

        return numberingDefinitions;
    }

    /**
     * Create numbering definition for a list
     */
    _createNumberingDefinition(listElement) {
        const list = listElement.content;
        const numberingId = this.numberingId++;

        return {
            numberingId: numberingId,
            abstractNumId: numberingId,
            type: list.type,
            style: list.style,
            levels: this._createNumberingLevels(list)
        };
    }

    /**
     * Create numbering levels
     */
    _createNumberingLevels(list) {
        const levels = [];
        const maxLevels = 9;

        for (let i = 0; i < maxLevels; i++) {
            const level = {
                level: i,
                format: this._getNumberFormat(list.type, list.style),
                text: this._getNumberText(list.type, list.style, i),
                alignment: 'left',
                indent: {
                    left: 360 + (i * 360), // 0.5" base + 0.5" per level
                    hanging: 360
                },
                font: {
                    name: 'Times New Roman',
                    size: 24 // 12pt in half-points
                }
            };

            levels.push(level);
        }

        return levels;
    }

    /**
     * Get number format for list type
     */
    _getNumberFormat(listType, listStyle) {
        if (listType === 'ordered') {
            switch (listStyle) {
                case 'number': return 'decimal';
                case 'letter': return 'lowerLetter';
                case 'roman': return 'lowerRoman';
                default: return 'decimal';
            }
        } else {
            return 'bullet';
        }
    }

    /**
     * Get number text for list type
     */
    _getNumberText(listType, listStyle, level) {
        if (listType === 'ordered') {
            switch (listStyle) {
                case 'number': return `%${level + 1}.`;
                case 'letter': return `%${level + 1}.`;
                case 'roman': return `%${level + 1}.`;
                default: return `%${level + 1}.`;
            }
        } else {
            // Bullet characters for different levels
            const bullets = ['•', '◦', '▪', '•', '◦', '▪', '•', '◦', '▪'];
            return bullets[level] || '•';
        }
    }

    /**
     * Build document sections
     */
    async _buildSections(styledContent) {
        const docxSections = [];

        // Create main document section
        const mainSection = new DocxSection();
        mainSection.properties = this._buildSectionProperties(styledContent.document);

        // Process all styled sections into document elements
        for (const styledSection of styledContent.sections) {
            const sectionElements = await this._buildSectionElements(styledSection);
            mainSection.elements.push(...sectionElements);
        }

        docxSections.push(mainSection);
        return docxSections;
    }

    /**
     * Build section properties
     */
    _buildSectionProperties(documentStyle) {
        return {
            pageSize: {
                width: documentStyle?.pageSize?.width || 12240,  // 8.5" in twips
                height: documentStyle?.pageSize?.height || 15840  // 11" in twips
            },
            margins: {
                top: documentStyle?.pageMargins?.top || 1440,     // 1" in twips
                right: documentStyle?.pageMargins?.right || 1440,
                bottom: documentStyle?.pageMargins?.bottom || 1440,
                left: documentStyle?.pageMargins?.left || 1440
            },
            orientation: 'portrait'
        };
    }

    /**
     * Build elements for a styled section
     */
    async _buildSectionElements(styledSection) {
        const elements = [];

        // Add section title as header if present
        if (styledSection.title && styledSection.style) {
            const titleParagraph = this._createHeaderParagraph(
                styledSection.title, 
                styledSection.style
            );
            elements.push(titleParagraph);
        }

        // Add page break if needed
        if (styledSection.pageBreak && elements.length > 0) {
            elements[elements.length - 1].properties.pageBreakBefore = true;
        }

        // Process section elements
        for (const element of styledSection.elements) {
            const docxElement = await this._buildElement(element);
            if (docxElement) {
                elements.push(docxElement);
            }
        }

        return elements;
    }

    /**
     * Create header paragraph
     */
    _createHeaderParagraph(title, styleName) {
        const paragraph = new DocxParagraph();
        paragraph.style = styleName;

        const run = new DocxRun(title);
        paragraph.runs.push(run);

        return paragraph;
    }

    /**
     * Build individual element
     */
    async _buildElement(styledElement) {
        switch (styledElement.type) {
            case 'paragraph':
                return this._buildParagraph(styledElement);
            
            case 'header':
                return this._buildHeader(styledElement);
            
            case 'list':
                return this._buildList(styledElement);
            
            case 'table':
                return this._buildTable(styledElement);
            
            case 'image':
                return this._buildImage(styledElement);
            
            default:
                console.warn(`Unknown element type: ${styledElement.type}`);
                return null;
        }
    }

    /**
     * Build paragraph element
     */
    _buildParagraph(styledElement) {
        const paragraph = new DocxParagraph();
        paragraph.style = styledElement.style;

        // Apply local formatting overrides
        if (styledElement.formatting) {
            paragraph.properties = {
                ...paragraph.properties,
                ...this._convertLocalFormatting(styledElement.formatting)
            };
        }

        // Create text run
        const run = new DocxRun(styledElement.content);
        
        // Apply run-level formatting
        if (styledElement.formatting) {
            run.properties = {
                ...run.properties,
                ...this._convertRunFormatting(styledElement.formatting)
            };
        }

        paragraph.runs.push(run);
        return paragraph;
    }

    /**
     * Build header element
     */
    _buildHeader(styledElement) {
        const paragraph = new DocxParagraph();
        paragraph.style = styledElement.style;

        // Set header-specific properties
        if (styledElement.properties.level === 1) {
            paragraph.properties.pageBreakBefore = true;
        }

        const run = new DocxRun(styledElement.content);
        paragraph.runs.push(run);

        return paragraph;
    }

    /**
     * Build list element
     */
    _buildList(styledElement) {
        const list = styledElement.content;
        const listElements = [];

        // Find or create numbering definition
        const numberingId = this._findNumberingId(styledElement.style);

        // Convert list items to paragraphs with numbering
        list.items.forEach(item => {
            const paragraph = this._createListItemParagraph(item, numberingId);
            listElements.push(paragraph);

            // Handle nested items
            if (item.subItems && item.subItems.length > 0) {
                item.subItems.forEach(subItem => {
                    const subParagraph = this._createListItemParagraph(subItem, numberingId, item.level + 1);
                    listElements.push(subParagraph);
                });
            }
        });

        return listElements;
    }

    /**
     * Create list item paragraph
     */
    _createListItemParagraph(item, numberingId, level = 0) {
        const paragraph = new DocxParagraph();
        paragraph.style = 'List Paragraph';

        // Set numbering properties
        paragraph.properties.numbering = {
            numberingId: numberingId,
            level: level
        };

        const run = new DocxRun(item.text);
        
        // Apply item formatting
        if (item.formatting) {
            run.properties = {
                ...run.properties,
                ...this._convertRunFormatting(item.formatting)
            };
        }

        paragraph.runs.push(run);
        return paragraph;
    }

    /**
     * Find numbering ID for list style
     */
    _findNumberingId(styleName) {
        // This would look up the numbering ID created earlier
        // For now, return a default based on style name
        if (styleName && styleName.includes('Number')) {
            return 1; // Ordered list numbering
        } else {
            return 2; // Bullet list numbering
        }
    }

    /**
     * Build table element
     */
    _buildTable(styledElement) {
        const tableData = styledElement.content;
        const table = new DocxTable();
        table.properties.style = styledElement.style || 'Table Grid';

        // Set table width
        table.properties.width = {
            size: 5000, // 100% width
            type: 'pct'
        };

        // Build table rows
        tableData.rows.forEach((rowData, rowIndex) => {
            const row = new DocxTableRow();
            
            // Mark first row as header if detected
            if (rowIndex === 0 && tableData.hasHeader) {
                row.properties.header = true;
            }

            // Build table cells
            rowData.forEach(cellText => {
                const cell = new DocxTableCell();
                
                // Create paragraph for cell content
                const paragraph = new DocxParagraph();
                const run = new DocxRun(cellText || '');
                paragraph.runs.push(run);
                cell.elements.push(paragraph);
                
                row.cells.push(cell);
            });

            table.rows.push(row);
        });

        return table;
    }

    /**
     * Build image element (placeholder)
     */
    _buildImage(styledElement) {
        // For now, create a paragraph with image description
        const paragraph = new DocxParagraph();
        const run = new DocxRun(`[Image: ${styledElement.content.caption || 'Embedded Image'}]`);
        paragraph.runs.push(run);
        
        return paragraph;
    }

    /**
     * Convert local formatting to paragraph properties
     */
    _convertLocalFormatting(formatting) {
        const properties = {};

        // Most formatting is applied at run level, but some might affect paragraph
        return properties;
    }

    /**
     * Convert formatting to run properties
     */
    _convertRunFormatting(formatting) {
        return {
            bold: formatting.bold || false,
            italic: formatting.italic || false,
            underline: formatting.underline || false,
            strikethrough: formatting.strikethrough || false
        };
    }

    /**
     * Build document settings
     */
    _buildDocumentSettings() {
        return {
            defaultTabStop: 708, // 0.5" in twips
            characterSpacingControl: 'doNotCompress',
            compatibilityMode: 15, // Word 2013+
            updateFields: false,
            printPostScriptOverText: false,
            printFractionalCharacterWidth: false,
            useFELayout: false
        };
    }

    /**
     * Get building summary
     */
    getBuildingSummary(docxDocument) {
        const elementCounts = this._countElements(docxDocument);
        
        return {
            sectionsBuilt: docxDocument.sections.length,
            stylesIncluded: docxDocument.styles.size,
            numberingDefinitions: docxDocument.numbering.length,
            totalElements: elementCounts.total,
            paragraphs: elementCounts.paragraphs,
            tables: elementCounts.tables,
            lists: elementCounts.lists,
            images: elementCounts.images,
            hasHeaders: elementCounts.headers > 0,
            complexity: this._calculateDocumentComplexity(docxDocument)
        };
    }

    /**
     * Count elements in document
     */
    _countElements(docxDocument) {
        const counts = {
            total: 0,
            paragraphs: 0,
            tables: 0,
            lists: 0,
            images: 0,
            headers: 0
        };

        docxDocument.sections.forEach(section => {
            section.elements.forEach(element => {
                counts.total++;
                
                if (element instanceof DocxParagraph) {
                    counts.paragraphs++;
                    if (element.style && element.style.startsWith('Heading')) {
                        counts.headers++;
                    }
                } else if (element instanceof DocxTable) {
                    counts.tables++;
                } else if (Array.isArray(element)) {
                    // List items are returned as arrays
                    counts.lists++;
                }
            });
        });

        return counts;
    }

    /**
     * Calculate document complexity score
     */
    _calculateDocumentComplexity(docxDocument) {
        let complexity = 0;
        
        complexity += docxDocument.styles.size * 2;
        complexity += docxDocument.numbering.length * 3;
        complexity += docxDocument.sections.length * 1;
        
        const elementCounts = this._countElements(docxDocument);
        complexity += elementCounts.tables * 5;
        complexity += elementCounts.lists * 3;
        complexity += elementCounts.headers * 2;
        complexity += elementCounts.paragraphs * 1;
        
        return Math.min(100, complexity);
    }
}

export default DocumentBuilder;
