/**
 * Style Processor - Handles style conversion from PDF to DOCX format
 * Based on CPdfGraphicState, CPdfTextState, and styling classes from PDFLibTool.dll.c
 */

/**
 * DOCX Style definition
 */
class DocxStyle {
    constructor(name, type = 'paragraph') {
        this.name = name;
        this.type = type; // 'paragraph', 'character', 'table', 'numbering'
        this.basedOn = null;
        this.properties = {
            font: new DocxFont(),
            paragraph: new DocxParagraph(),
            character: {},
            table: {}
        };
    }
}

/**
 * Font properties for DOCX
 */
class DocxFont {
    constructor() {
        this.name = 'Times New Roman';
        this.size = 12; // in points
        this.bold = false;
        this.italic = false;
        this.underline = false;
        this.strikethrough = false;
        this.color = '000000'; // hex color without #
        this.highlight = null;
    }
}

/**
 * Paragraph properties for DOCX
 */
class DocxParagraph {
    constructor() {
        this.alignment = 'left'; // 'left', 'center', 'right', 'justify'
        this.spaceBefore = 0; // in points
        this.spaceAfter = 0; // in points
        this.lineSpacing = 1.0; // line spacing multiplier
        this.indent = {
            left: 0,
            right: 0,
            firstLine: 0,
            hanging: 0
        };
        this.keepNext = false;
        this.keepLines = false;
        this.pageBreakBefore = false;
    }
}

/**
 * Styled Content structure for processed content
 */
class StyledContent {
    constructor() {
        this.document = null;      // Document-level styling
        this.styles = new Map();   // Style definitions
        this.sections = [];        // Styled sections
        this.metadata = {};        // Styling metadata
    }
}

/**
 * Styled Section for organized content
 */
class StyledSection {
    constructor() {
        this.title = '';
        this.level = 0;
        this.style = null;         // Applied style
        this.elements = [];        // Array of styled elements
        this.pageBreak = false;    // Whether to insert page break before
    }
}

/**
 * Styled Element for individual content pieces
 */
class StyledElement {
    constructor(type, content) {
        this.type = type;          // 'paragraph', 'header', 'list', 'table', 'image'
        this.content = content;
        this.style = null;         // Applied style
        this.properties = {};      // Additional properties
        this.formatting = {};      // Local formatting overrides
    }
}

/**
 * Style Processor class (inspired by CPdfGraphicState, CPdfTextState)
 */
class StyleProcessor {
    constructor() {
        this.styleOptions = {
            preserveOriginalFonts: false,
            mapSimilarFonts: true,
            generateHeadingStyles: true,
            generateListStyles: true,
            normalizeSpacing: true,
            defaultFontSize: 12,
            defaultFontFamily: 'Times New Roman'
        };

        // Font mapping from PDF fonts to Word-compatible fonts
        this.fontMapping = {
            'Times-Roman': 'Times New Roman',
            'Times-Bold': 'Times New Roman',
            'Times-Italic': 'Times New Roman',
            'Times-BoldItalic': 'Times New Roman',
            'Helvetica': 'Arial',
            'Helvetica-Bold': 'Arial',
            'Helvetica-Oblique': 'Arial',
            'Helvetica-BoldOblique': 'Arial',
            'Courier': 'Courier New',
            'Courier-Bold': 'Courier New',
            'Courier-Oblique': 'Courier New',
            'Courier-BoldOblique': 'Courier New',
            'Symbol': 'Symbol',
            'ZapfDingbats': 'Wingdings'
        };

        // Predefined styles
        this.defaultStyles = this._createDefaultStyles();
    }

    /**
     * Process analyzed content and apply DOCX styling
     * Main processing method inspired by style conversion in PDFLibTool.dll.c
     */
    async processStyles(analyzedContent) {
        try {
            const styledContent = new StyledContent();
            
            // Set processing metadata
            styledContent.metadata = {
                processingDate: new Date().toISOString(),
                styleOptions: { ...this.styleOptions },
                originalDocumentType: analyzedContent.documentStructure?.documentType
            };

            // Create style definitions
            styledContent.styles = this._createStyleDefinitions(analyzedContent);

            // Process document-level styling
            styledContent.document = this._processDocumentStyle(analyzedContent);

            // Process sections with styling
            styledContent.sections = await this._processSections(analyzedContent, styledContent.styles);

            return styledContent;

        } catch (error) {
            throw new Error(`Style processing failed: ${error.message}`);
        }
    }

    /**
     * Create default style definitions
     */
    _createDefaultStyles() {
        const styles = new Map();

        // Normal paragraph style
        const normal = new DocxStyle('Normal', 'paragraph');
        normal.properties.font = this._createDefaultFont();
        normal.properties.paragraph = this._createDefaultParagraph();
        styles.set('Normal', normal);

        // Create heading styles
        for (let i = 1; i <= 6; i++) {
            const heading = new DocxStyle(`Heading ${i}`, 'paragraph');
            heading.basedOn = 'Normal';
            heading.properties.font = this._createHeadingFont(i);
            heading.properties.paragraph = this._createHeadingParagraph(i);
            styles.set(`Heading ${i}`, heading);
        }

        // List styles
        const listParagraph = new DocxStyle('List Paragraph', 'paragraph');
        listParagraph.basedOn = 'Normal';
        listParagraph.properties.paragraph.indent.left = 360; // 0.5 inch
        styles.set('List Paragraph', listParagraph);

        // Table styles
        const tableNormal = new DocxStyle('Table Normal', 'table');
        tableNormal.properties.table = {
            borders: 'single',
            borderWidth: 1,
            cellMargin: { top: 0, left: 108, bottom: 0, right: 108 }
        };
        styles.set('Table Normal', tableNormal);

        return styles;
    }

    /**
     * Create default font properties
     */
    _createDefaultFont() {
        const font = new DocxFont();
        font.name = this.styleOptions.defaultFontFamily;
        font.size = this.styleOptions.defaultFontSize;
        return font;
    }

    /**
     * Create default paragraph properties
     */
    _createDefaultParagraph() {
        const paragraph = new DocxParagraph();
        paragraph.spaceAfter = 120; // 6pt after paragraph
        return paragraph;
    }

    /**
     * Create heading font properties
     */
    _createHeadingFont(level) {
        const font = this._createDefaultFont();
        font.bold = true;
        
        // Adjust font size based on heading level
        const sizes = [20, 18, 16, 14, 12, 11];
        font.size = sizes[level - 1] || 11;
        
        return font;
    }

    /**
     * Create heading paragraph properties
     */
    _createHeadingParagraph(level) {
        const paragraph = this._createDefaultParagraph();
        
        // Adjust spacing based on heading level
        paragraph.spaceBefore = level <= 2 ? 240 : 120; // 12pt or 6pt before
        paragraph.spaceAfter = level <= 2 ? 120 : 60;   // 6pt or 3pt after
        paragraph.keepNext = true;
        
        return paragraph;
    }

    /**
     * Create style definitions based on analyzed content
     */
    _createStyleDefinitions(analyzedContent) {
        const styles = new Map(this.defaultStyles);

        // Analyze unique formatting combinations in the content
        const uniqueFormats = this._analyzeUniqueFormats(analyzedContent);

        // Create custom styles for unique formatting
        uniqueFormats.forEach((format, index) => {
            const styleName = `Custom Style ${index + 1}`;
            const style = this._createCustomStyle(styleName, format);
            styles.set(styleName, style);
        });

        // Create list styles if lists are present
        if (analyzedContent.lists.length > 0) {
            this._createListStyles(analyzedContent.lists, styles);
        }

        // Create table styles if tables are present
        if (analyzedContent.tables.length > 0) {
            this._createTableStyles(analyzedContent.tables, styles);
        }

        return styles;
    }

    /**
     * Analyze unique formatting combinations in content
     */
    _analyzeUniqueFormats(analyzedContent) {
        const formatMap = new Map();
        
        // Collect formats from all paragraphs
        analyzedContent.paragraphs.forEach(paragraph => {
            const formatKey = this._createFormatKey(paragraph.style, paragraph.formatting);
            if (!formatMap.has(formatKey)) {
                formatMap.set(formatKey, {
                    style: paragraph.style,
                    formatting: paragraph.formatting,
                    count: 1
                });
            } else {
                formatMap.get(formatKey).count++;
            }
        });

        // Return formats used more than once (worth creating a style for)
        return Array.from(formatMap.values()).filter(format => format.count > 1);
    }

    /**
     * Create format key for identifying unique formats
     */
    _createFormatKey(style, formatting) {
        return JSON.stringify({
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            alignment: style.alignment,
            bold: formatting.bold,
            italic: formatting.italic,
            underline: formatting.underline
        });
    }

    /**
     * Create custom style from format
     */
    _createCustomStyle(name, format) {
        const style = new DocxStyle(name, 'paragraph');
        style.basedOn = 'Normal';
        
        // Apply font properties
        style.properties.font = this._convertToDocxFont(format.style, format.formatting);
        
        // Apply paragraph properties
        style.properties.paragraph = this._convertToDocxParagraph(format.style);
        
        return style;
    }

    /**
     * Convert PDF font properties to DOCX font
     */
    _convertToDocxFont(style, formatting) {
        const font = new DocxFont();
        
        // Map font family
        const pdfFont = style.fontFamily || 'Times-Roman';
        font.name = this.fontMapping[pdfFont] || 
                   (this.styleOptions.preserveOriginalFonts ? pdfFont : this.styleOptions.defaultFontFamily);
        
        // Convert font size
        font.size = Math.round(style.fontSize || this.styleOptions.defaultFontSize);
        
        // Apply formatting
        font.bold = formatting.bold || style.fontWeight === 'bold';
        font.italic = formatting.italic || style.fontStyle === 'italic';
        font.underline = formatting.underline;
        font.strikethrough = formatting.strikethrough;
        
        // Convert color
        if (style.color && style.color !== '#000000') {
            font.color = style.color.replace('#', '');
        }
        
        return font;
    }

    /**
     * Convert PDF paragraph properties to DOCX paragraph
     */
    _convertToDocxParagraph(style) {
        const paragraph = new DocxParagraph();
        
        // Convert alignment
        paragraph.alignment = style.alignment || 'left';
        
        // Set default spacing
        if (this.styleOptions.normalizeSpacing) {
            paragraph.spaceAfter = 120; // 6pt
        }
        
        return paragraph;
    }

    /**
     * Create list styles
     */
    _createListStyles(lists, styles) {
        const listTypes = new Set(lists.map(list => list.type));
        
        listTypes.forEach(type => {
            const styleName = `List ${type === 'ordered' ? 'Number' : 'Bullet'}`;
            
            if (!styles.has(styleName)) {
                const style = new DocxStyle(styleName, 'numbering');
                style.properties.numbering = {
                    abstractNumId: type === 'ordered' ? 'numbering' : 'bullet',
                    levels: this._createListLevels(type)
                };
                styles.set(styleName, style);
            }
        });
    }

    /**
     * Create list levels for numbering
     */
    _createListLevels(type) {
        const levels = [];
        
        for (let i = 0; i < 9; i++) {
            levels.push({
                level: i,
                format: type === 'ordered' ? 'decimal' : 'bullet',
                text: type === 'ordered' ? `%${i + 1}.` : '•',
                indent: {
                    left: 360 + (i * 360), // 0.5" + 0.5" per level
                    hanging: 360
                }
            });
        }
        
        return levels;
    }

    /**
     * Create table styles
     */
    _createTableStyles(tables, styles) {
        // Create a basic table style if tables are present
        if (!styles.has('Table Grid')) {
            const style = new DocxStyle('Table Grid', 'table');
            style.properties.table = {
                borders: 'single',
                borderWidth: 1,
                borderColor: '000000',
                cellMargin: { top: 0, left: 108, bottom: 0, right: 108 }
            };
            styles.set('Table Grid', style);
        }
    }

    /**
     * Process document-level styling
     */
    _processDocumentStyle() {
        return {
            defaultFont: this.styleOptions.defaultFontFamily,
            defaultFontSize: this.styleOptions.defaultFontSize,
            pageMargins: {
                top: 1440,    // 1 inch in twips
                right: 1440,
                bottom: 1440,
                left: 1440
            },
            pageSize: {
                width: 12240,  // 8.5 inches in twips
                height: 15840  // 11 inches in twips
            }
        };
    }

    /**
     * Process sections with styling
     */
    async _processSections(analyzedContent, styles) {
        const styledSections = [];

        // If no sections detected, create one from all content
        if (analyzedContent.sections.length === 0) {
            const section = new StyledSection();
            section.title = 'Document';
            section.elements = await this._processAllContent(analyzedContent, styles);
            styledSections.push(section);
        } else {
            // Process each detected section
            for (const section of analyzedContent.sections) {
                const styledSection = new StyledSection();
                styledSection.title = section.title;
                styledSection.level = section.level;
                styledSection.style = this._getHeaderStyle(section.level);
                styledSection.elements = await this._processSectionContent(section, styles);
                styledSections.push(styledSection);
            }
        }

        return styledSections;
    }

    /**
     * Process all content when no sections are detected
     */
    async _processAllContent(analyzedContent, styles) {
        const elements = [];

        // Process headers
        analyzedContent.headers.forEach(header => {
            const element = new StyledElement('header', header.text);
            element.style = this._getHeaderStyle(header.level);
            element.properties = { level: header.level };
            elements.push(element);
        });

        // Process paragraphs
        analyzedContent.paragraphs.forEach(paragraph => {
            const element = new StyledElement('paragraph', paragraph.text);
            element.style = this._matchStyle(paragraph, styles);
            element.formatting = this._convertFormatting(paragraph.formatting);
            elements.push(element);
        });

        // Process lists
        analyzedContent.lists.forEach(list => {
            const element = new StyledElement('list', list);
            element.style = `List ${list.type === 'ordered' ? 'Number' : 'Bullet'}`;
            elements.push(element);
        });

        // Process tables
        analyzedContent.tables.forEach(table => {
            const element = new StyledElement('table', table);
            element.style = 'Table Grid';
            elements.push(element);
        });

        return elements;
    }

    /**
     * Process content for a specific section
     */
    async _processSectionContent(section, styles) {
        const elements = [];

        section.content.forEach(contentItem => {
            let element;

            switch (contentItem.type) {
                case 'paragraph':
                    element = new StyledElement('paragraph', contentItem.text);
                    element.style = this._matchStyle(contentItem, styles);
                    break;
                
                case 'list':
                    element = new StyledElement('list', contentItem);
                    element.style = 'List Paragraph';
                    break;
                
                case 'header':
                    element = new StyledElement('header', contentItem.text);
                    element.style = this._getHeaderStyle(contentItem.level || 1);
                    break;
                
                default:
                    element = new StyledElement('paragraph', contentItem.text);
                    element.style = 'Normal';
            }

            if (contentItem.formatting) {
                element.formatting = this._convertFormatting(contentItem.formatting);
            }

            elements.push(element);
        });

        return elements;
    }

    /**
     * Get appropriate header style based on level
     */
    _getHeaderStyle(level) {
        const clampedLevel = Math.max(1, Math.min(6, level));
        return `Heading ${clampedLevel}`;
    }

    /**
     * Match content to appropriate style
     */
    _matchStyle(contentItem, styles) {
        // Try to find a custom style that matches the formatting
        for (const [styleName, style] of styles) {
            if (this._doesStyleMatch(contentItem, style)) {
                return styleName;
            }
        }

        // Default to Normal style
        return 'Normal';
    }

    /**
     * Check if content matches a style
     */
    _doesStyleMatch(contentItem, style) {
        if (!contentItem.style || !contentItem.formatting) return false;

        const font = style.properties.font;
        if (!font) return false;

        // Check font properties
        const fontMatches = 
            Math.abs((font.size || 12) - (contentItem.style.fontSize || 12)) <= 1 &&
            (font.bold || false) === (contentItem.formatting.bold || false) &&
            (font.italic || false) === (contentItem.formatting.italic || false);

        return fontMatches;
    }

    /**
     * Convert PDF formatting to DOCX formatting
     */
    _convertFormatting(formatting) {
        return {
            bold: formatting.bold || false,
            italic: formatting.italic || false,
            underline: formatting.underline || false,
            strikethrough: formatting.strikethrough || false
        };
    }

    /**
     * Get processing summary
     */
    getProcessingSummary(styledContent) {
        const styleCount = styledContent.styles.size;
        const sectionCount = styledContent.sections.length;
        const elementCount = styledContent.sections.reduce(
            (sum, section) => sum + section.elements.length, 0
        );

        return {
            stylesCreated: styleCount,
            sectionsProcessed: sectionCount,
            elementsProcessed: elementCount,
            hasCustomStyles: styleCount > this.defaultStyles.size,
            hasHeaders: styledContent.sections.some(section => 
                section.elements.some(element => element.type === 'header')
            ),
            hasLists: styledContent.sections.some(section => 
                section.elements.some(element => element.type === 'list')
            ),
            hasTables: styledContent.sections.some(section => 
                section.elements.some(element => element.type === 'table')
            )
        };
    }
}

export default StyleProcessor;
