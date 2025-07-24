/**
 * Content Analyzer - Analyzes and structures extracted content
 * Based on CPageContentAnalizer2 and content analysis classes from PDFLibTool.dll.c
 */

/**
 * Analyzed Content structure
 */
class AnalyzedContent {
    constructor() {
        this.documentStructure = null;    // DocumentStructure object
        this.contentHierarchy = [];       // Hierarchical content structure
        this.sections = [];              // Document sections
        this.tables = [];                // Detected tables
        this.images = [];                // Image references
        this.headers = [];               // All headers with hierarchy
        this.lists = [];                 // All lists with structure
        this.paragraphs = [];            // All paragraphs
        this.footnotes = [];             // Footnotes and references
        this.metadata = {};              // Analysis metadata
    }
}

/**
 * Document Structure (inspired by document hierarchy analysis)
 */
class DocumentStructure {
    constructor() {
        this.title = '';
        this.authors = [];
        this.abstract = '';
        this.tableOfContents = [];
        this.sections = [];
        this.bibliography = [];
        this.appendices = [];
        this.documentType = 'general'; // 'academic', 'business', 'legal', 'general'
    }
}

/**
 * Content Section structure
 */
class ContentSection {
    constructor() {
        this.id = '';
        this.title = '';
        this.level = 0;                  // Hierarchy level (0 = top level)
        this.startPage = 0;
        this.endPage = 0;
        this.content = [];               // Array of content blocks
        this.subsections = [];           // Child sections
        this.parent = null;              // Parent section
    }
}

/**
 * Table structure for detected tables
 */
class TableStructure {
    constructor() {
        this.rows = [];                  // Array of table rows
        this.columnCount = 0;
        this.hasHeader = false;
        this.bbox = { x: 0, y: 0, width: 0, height: 0 };
        this.page = 0;
        this.caption = '';
    }
}

/**
 * List structure for organized lists
 */
class ListStructure {
    constructor() {
        this.type = 'unordered';         // 'ordered', 'unordered'
        this.items = [];                 // Array of ListItem objects
        this.level = 0;                  // Nesting level
        this.style = 'bullet';           // 'bullet', 'number', 'letter', 'roman'
        this.startNumber = 1;            // For ordered lists
    }
}

/**
 * List Item structure
 */
class ListItem {
    constructor(text, level = 0) {
        this.text = text;
        this.level = level;
        this.subItems = [];              // Nested list items
        this.formatting = {};            // Text formatting
    }
}

/**
 * Content Analyzer class (inspired by CPageContentAnalizer2)
 */
class ContentAnalyzer {
    constructor() {
        this.analysisOptions = {
            detectSections: true,
            detectTables: true,
            detectLists: true,
            detectFootnotes: true,
            buildHierarchy: true,
            analyzeDocumentType: true,
            minSectionLength: 100,
            tableDetectionThreshold: 0.7
        };
        
        this.patterns = {
            sectionHeaders: [
                /^(chapter|section|part)\s+\d+/i,
                /^\d+\.?\s+[A-Z]/,
                /^[A-Z][A-Z\s]+$/
            ],
            footnotes: [
                /^\d+\s+/,
                /^\*+\s+/,
                /^[a-z]\)\s+/
            ],
            references: [
                /^references$/i,
                /^bibliography$/i,
                /^works cited$/i
            ]
        };
    }

    /**
     * Analyze extracted text content and create structured representation
     * Main analysis method inspired by content analysis in PDFLibTool.dll.c
     */
    async analyzeContent(textContent, pdfDocument) {
        try {
            const analyzedContent = new AnalyzedContent();
            
            // Set analysis metadata
            analyzedContent.metadata = {
                analysisDate: new Date().toISOString(),
                documentInfo: pdfDocument.info,
                textStatistics: textContent.statistics,
                analysisOptions: { ...this.analysisOptions }
            };

            // Analyze document structure
            if (this.analysisOptions.analyzeDocumentType) {
                analyzedContent.documentStructure = this._analyzeDocumentStructure(textContent);
            }

            // Extract and organize headers
            analyzedContent.headers = this._extractHeaders(textContent);

            // Build content hierarchy
            if (this.analysisOptions.buildHierarchy) {
                analyzedContent.contentHierarchy = this._buildContentHierarchy(analyzedContent.headers, textContent);
            }

            // Detect and structure sections
            if (this.analysisOptions.detectSections) {
                analyzedContent.sections = this._detectSections(textContent, analyzedContent.headers);
            }

            // Extract and structure lists
            if (this.analysisOptions.detectLists) {
                analyzedContent.lists = this._extractLists(textContent);
            }

            // Detect tables
            if (this.analysisOptions.detectTables) {
                analyzedContent.tables = this._detectTables(textContent);
            }

            // Extract paragraphs
            analyzedContent.paragraphs = this._extractParagraphs(textContent);

            // Detect footnotes
            if (this.analysisOptions.detectFootnotes) {
                analyzedContent.footnotes = this._detectFootnotes(textContent);
            }

            // Extract image references
            analyzedContent.images = this._extractImageReferences(pdfDocument);

            return analyzedContent;

        } catch (error) {
            throw new Error(`Content analysis failed: ${error.message}`);
        }
    }

    /**
     * Analyze overall document structure and type
     */
    _analyzeDocumentStructure(textContent) {
        const structure = new DocumentStructure();
        const firstPage = textContent.pages[0];
        
        if (!firstPage) return structure;

        // Detect document title (usually first large text or header)
        const potentialTitles = firstPage.textBlocks.filter(block => 
            block.type === 'header' || 
            block.style.fontSize > 16 ||
            block.formatting.bold
        );
        
        if (potentialTitles.length > 0) {
            structure.title = potentialTitles[0].text;
        }

        // Detect document type based on content patterns
        structure.documentType = this._detectDocumentType(textContent);

        // Look for abstract/summary
        const abstractBlock = this._findAbstract(textContent);
        if (abstractBlock) {
            structure.abstract = abstractBlock.text;
        }

        // Generate table of contents from headers
        structure.tableOfContents = this._generateTableOfContents(textContent);

        return structure;
    }

    /**
     * Detect document type based on content patterns
     */
    _detectDocumentType(textContent) {
        const fullText = textContent.documentText.toLowerCase();
        
        // Academic paper indicators
        const academicKeywords = ['abstract', 'introduction', 'methodology', 'results', 'conclusion', 'references', 'bibliography'];
        const academicScore = academicKeywords.reduce((score, keyword) => 
            score + (fullText.includes(keyword) ? 1 : 0), 0);
        
        // Business document indicators
        const businessKeywords = ['executive summary', 'proposal', 'budget', 'quarterly', 'revenue', 'strategy'];
        const businessScore = businessKeywords.reduce((score, keyword) => 
            score + (fullText.includes(keyword) ? 1 : 0), 0);
        
        // Legal document indicators
        const legalKeywords = ['whereas', 'hereby', 'plaintiff', 'defendant', 'contract', 'agreement'];
        const legalScore = legalKeywords.reduce((score, keyword) => 
            score + (fullText.includes(keyword) ? 1 : 0), 0);

        // Determine type based on highest score
        if (academicScore >= 3) return 'academic';
        if (businessScore >= 2) return 'business';
        if (legalScore >= 2) return 'legal';
        
        return 'general';
    }

    /**
     * Find abstract or summary section
     */
    _findAbstract(textContent) {
        const abstractKeywords = ['abstract', 'summary', 'executive summary'];
        
        for (const page of textContent.pages) {
            for (const block of page.textBlocks) {
                if (abstractKeywords.some(keyword => 
                    block.text.toLowerCase().startsWith(keyword))) {
                    return block;
                }
            }
        }
        
        return null;
    }

    /**
     * Extract headers from all pages
     */
    _extractHeaders(textContent) {
        const headers = [];
        
        textContent.pages.forEach(page => {
            page.textBlocks.forEach(block => {
                if (block.type === 'header') {
                    headers.push({
                        text: block.text,
                        level: block.level || this._determineHeaderLevel(block),
                        page: page.pageNumber,
                        style: block.style,
                        formatting: block.formatting,
                        bbox: block.bbox
                    });
                }
            });
        });
        
        return headers.sort((a, b) => a.page - b.page);
    }

    /**
     * Determine header level based on styling
     */
    _determineHeaderLevel(block) {
        const fontSize = block.style.fontSize;
        const isBold = block.formatting.bold;
        const isCenter = block.style.alignment === 'center';
        
        if (fontSize >= 20 || (fontSize >= 16 && isCenter)) return 1;
        if (fontSize >= 18 || (fontSize >= 14 && isBold)) return 2;
        if (fontSize >= 16 || isBold) return 3;
        if (fontSize >= 14) return 4;
        return 5;
    }

    /**
     * Build hierarchical content structure
     */
    _buildContentHierarchy(headers) {
        const hierarchy = [];
        const sectionStack = [];
        
        headers.forEach(header => {
            const section = new ContentSection();
            section.title = header.text;
            section.level = header.level;
            section.startPage = header.page;
            
            // Find appropriate parent based on level
            while (sectionStack.length > 0 && 
                   sectionStack[sectionStack.length - 1].level >= header.level) {
                sectionStack.pop();
            }
            
            if (sectionStack.length > 0) {
                section.parent = sectionStack[sectionStack.length - 1];
                section.parent.subsections.push(section);
            } else {
                hierarchy.push(section);
            }
            
            sectionStack.push(section);
        });
        
        return hierarchy;
    }

    /**
     * Detect and create sections based on headers and content
     */
    _detectSections(textContent, headers) {
        const sections = [];
        
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const nextHeader = headers[i + 1];
            
            const section = new ContentSection();
            section.title = header.text;
            section.level = header.level;
            section.startPage = header.page;
            section.endPage = nextHeader ? nextHeader.page : textContent.pages.length;
            
            // Extract content between this header and the next
            section.content = this._extractSectionContent(
                textContent, 
                header.page, 
                section.endPage,
                header.bbox.y
            );
            
            sections.push(section);
        }
        
        return sections;
    }

    /**
     * Extract content for a specific section
     */
    _extractSectionContent(textContent, startPage, endPage, startY) {
        const content = [];
        
        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
            const page = textContent.pages[pageNum - 1];
            if (!page) continue;
            
            page.textBlocks.forEach(block => {
                // Skip if this is before the section start (for first page)
                if (pageNum === startPage && block.bbox.y > startY) return;
                
                // Skip headers (they're handled separately)
                if (block.type !== 'header') {
                    content.push({
                        type: block.type,
                        text: block.text,
                        style: block.style,
                        formatting: block.formatting,
                        page: pageNum
                    });
                }
            });
        }
        
        return content;
    }

    /**
     * Extract and structure lists
     */
    _extractLists(textContent) {
        const lists = [];
        let currentList = null;
        
        textContent.pages.forEach(page => {
            page.textBlocks.forEach(block => {
                if (block.type === 'list') {
                    const listItem = new ListItem(block.text.replace(/^[\u2022\u25E6\u2043\u2219•·‣⁃\-\*\d+\.a-z\.\s]+/, '').trim());
                    listItem.level = block.level || 0;
                    listItem.formatting = block.formatting;
                    
                    // Determine if this starts a new list or continues current one
                    if (!currentList || this._shouldStartNewList(block, currentList)) {
                        currentList = new ListStructure();
                        currentList.type = this._determineListType(block.text);
                        currentList.style = this._determineListStyle(block.text);
                        lists.push(currentList);
                    }
                    
                    // Add item to current list
                    if (listItem.level === 0) {
                        currentList.items.push(listItem);
                    } else {
                        // Handle nested items
                        this._addNestedListItem(currentList, listItem);
                    }
                } else if (currentList && block.type === 'paragraph') {
                    // Check if this paragraph continues the last list item
                    const lastItem = this._getLastListItem(currentList);
                    if (lastItem && block.bbox.x > 60) { // Indented paragraph
                        lastItem.text += ' ' + block.text;
                    } else {
                        currentList = null; // End current list
                    }
                } else {
                    currentList = null; // End current list
                }
            });
        });
        
        return lists;
    }

    /**
     * Determine if a new list should be started
     */
    _shouldStartNewList(block, currentList) {
        // Start new list if style changes or there's a significant gap
        const currentStyle = this._determineListStyle(block.text);
        return currentList.style !== currentStyle;
    }

    /**
     * Determine list type (ordered/unordered)
     */
    _determineListType(text) {
        return /^\d+\./.test(text) || /^[a-z]\./.test(text) || /^[ivxlcdm]+\./i.test(text) 
            ? 'ordered' : 'unordered';
    }

    /**
     * Determine list style
     */
    _determineListStyle(text) {
        if (/^\d+\./.test(text)) return 'number';
        if (/^[a-z]\./.test(text)) return 'letter';
        if (/^[ivxlcdm]+\./i.test(text)) return 'roman';
        if (/^[\u2022\u25E6\u2043\u2219•·‣⁃]/.test(text)) return 'bullet';
        if (/^-/.test(text)) return 'dash';
        if (/^\*/.test(text)) return 'asterisk';
        return 'bullet';
    }

    /**
     * Add nested list item
     */
    _addNestedListItem(list, item) {
        const parentItems = list.items;
        if (parentItems.length > 0) {
            const lastParent = parentItems[parentItems.length - 1];
            if (!lastParent.subItems) lastParent.subItems = [];
            lastParent.subItems.push(item);
        }
    }

    /**
     * Get the last list item (including nested)
     */
    _getLastListItem(list) {
        if (list.items.length === 0) return null;
        
        const lastItem = list.items[list.items.length - 1];
        if (lastItem.subItems && lastItem.subItems.length > 0) {
            return lastItem.subItems[lastItem.subItems.length - 1];
        }
        
        return lastItem;
    }

    /**
     * Detect tables in the content
     */
    _detectTables(textContent) {
        const tables = [];
        
        // Simple table detection based on text alignment and spacing
        textContent.pages.forEach(page => {
            const potentialTableRows = this._findPotentialTableRows(page);
            if (potentialTableRows.length >= 2) {
                const table = this._buildTableStructure(potentialTableRows);
                if (table) {
                    table.page = page.pageNumber;
                    tables.push(table);
                }
            }
        });
        
        return tables;
    }

    /**
     * Find potential table rows based on text alignment
     */
    _findPotentialTableRows(page) {
        const rows = [];
        const alignmentThreshold = 10;
        
        // Group text blocks that might be in the same row
        const sortedBlocks = page.textBlocks
            .filter(block => block.type === 'paragraph')
            .sort((a, b) => b.bbox.y - a.bbox.y);
        
        let currentRow = null;
        
        sortedBlocks.forEach(block => {
            if (!currentRow || Math.abs(currentRow.y - block.bbox.y) > alignmentThreshold) {
                currentRow = {
                    y: block.bbox.y,
                    blocks: [block]
                };
                rows.push(currentRow);
            } else {
                currentRow.blocks.push(block);
            }
        });
        
        // Filter rows that have multiple aligned blocks (potential table cells)
        return rows.filter(row => row.blocks.length >= 2);
    }

    /**
     * Build table structure from potential rows
     */
    _buildTableStructure(potentialRows) {
        if (potentialRows.length < 2) return null;
        
        const table = new TableStructure();
        table.columnCount = Math.max(...potentialRows.map(row => row.blocks.length));
        
        // Check if columns are consistently aligned
        const columnAlignments = this._analyzeColumnAlignments(potentialRows);
        if (columnAlignments.score < this.analysisOptions.tableDetectionThreshold) {
            return null;
        }
        
        // Build table rows
        potentialRows.forEach(row => {
            const tableRow = row.blocks
                .sort((a, b) => a.bbox.x - b.bbox.x)
                .map(block => block.text);
            table.rows.push(tableRow);
        });
        
        // Check if first row might be a header
        table.hasHeader = this._detectTableHeader(table.rows[0], potentialRows[0]);
        
        return table;
    }

    /**
     * Analyze column alignments to determine if it's a table
     */
    _analyzeColumnAlignments(rows) {
        const alignmentTolerance = 15;
        let totalScore = 0;
        let comparisons = 0;
        
        for (let col = 0; col < 5; col++) { // Check up to 5 columns
            const columnXPositions = rows
                .map(row => row.blocks[col]?.bbox.x)
                .filter(x => x !== undefined);
            
            if (columnXPositions.length >= 2) {
                const avgX = columnXPositions.reduce((sum, x) => sum + x, 0) / columnXPositions.length;
                const alignedCount = columnXPositions.filter(x => Math.abs(x - avgX) <= alignmentTolerance).length;
                const alignmentScore = alignedCount / columnXPositions.length;
                
                totalScore += alignmentScore;
                comparisons++;
            }
        }
        
        return {
            score: comparisons > 0 ? totalScore / comparisons : 0,
            comparisons
        };
    }

    /**
     * Detect if first row is a table header
     */
    _detectTableHeader(firstRow, firstRowData) {
        // Check if first row has different formatting (bold, larger font, etc.)
        const hasDistinctFormatting = firstRowData.blocks.some(block => 
            block.formatting.bold || 
            block.style.fontSize > 12
        );
        
        // Check if text appears to be headers (title case, short text, etc.)
        const looksLikeHeaders = firstRow.every(cell => 
            cell.length < 50 && 
            /^[A-Z]/.test(cell)
        );
        
        return hasDistinctFormatting || looksLikeHeaders;
    }

    /**
     * Extract paragraphs from all pages
     */
    _extractParagraphs(textContent) {
        const paragraphs = [];
        
        textContent.pages.forEach(page => {
            page.textBlocks
                .filter(block => block.type === 'paragraph')
                .forEach(block => {
                    paragraphs.push({
                        text: block.text,
                        page: page.pageNumber,
                        style: block.style,
                        formatting: block.formatting,
                        bbox: block.bbox
                    });
                });
        });
        
        return paragraphs;
    }

    /**
     * Detect footnotes and references
     */
    _detectFootnotes(textContent) {
        const footnotes = [];
        
        textContent.pages.forEach(page => {
            page.textBlocks.forEach(block => {
                // Check if text looks like a footnote
                if (this._looksLikeFootnote(block)) {
                    footnotes.push({
                        text: block.text,
                        page: page.pageNumber,
                        type: this._determinefootnoteType(block.text),
                        bbox: block.bbox
                    });
                }
            });
        });
        
        return footnotes;
    }

    /**
     * Check if a text block looks like a footnote
     */
    _looksLikeFootnote(block) {
        const text = block.text;
        const isSmallFont = block.style.fontSize < 10;
        const isBottomOfPage = block.bbox.y < 100; // Assuming page coordinates
        const hasFootnotePattern = this.patterns.footnotes.some(pattern => pattern.test(text));
        
        return (isSmallFont && isBottomOfPage) || hasFootnotePattern;
    }

    /**
     * Determine footnote type
     */
    _determineFootnoteType(text) {
        if (/^\d+/.test(text)) return 'numbered';
        if (/^\*+/.test(text)) return 'asterisk';
        if (/^[a-z]\)/.test(text)) return 'lettered';
        return 'general';
    }

    /**
     * Extract image references from PDF document
     */
    _extractImageReferences(pdfDocument) {
        const images = [];
        
        pdfDocument.pages.forEach(page => {
            if (page.images && page.images.length > 0) {
                page.images.forEach(image => {
                    images.push({
                        page: page.pageNumber,
                        bbox: image.bbox || { x: 0, y: 0, width: 100, height: 100 },
                        type: image.type || 'unknown',
                        caption: this._findImageCaption(page, image)
                    });
                });
            }
        });
        
        return images;
    }

    /**
     * Find caption for an image
     */
    _findImageCaption(page, image) {
        // Look for text blocks near the image that might be captions
        const captionKeywords = ['figure', 'fig', 'image', 'photo', 'diagram'];
        
        if (page.textBlocks) {
            const nearbyBlocks = page.textBlocks.filter(block => {
                const distance = Math.abs(block.bbox.y - (image.bbox?.y || 0));
                return distance < 50; // Within 50 units of the image
            });
            
            const captionBlock = nearbyBlocks.find(block => 
                captionKeywords.some(keyword => 
                    block.text.toLowerCase().includes(keyword)
                )
            );
            
            return captionBlock ? captionBlock.text : '';
        }
        
        return '';
    }

    /**
     * Generate table of contents from headers
     */
    _generateTableOfContents(textContent) {
        const toc = [];
        
        textContent.pages.forEach(page => {
            page.textBlocks
                .filter(block => block.type === 'header')
                .forEach(block => {
                    toc.push({
                        title: block.text,
                        level: block.level || this._determineHeaderLevel(block),
                        page: page.pageNumber
                    });
                });
        });
        
        return toc;
    }

    /**
     * Get analysis summary
     */
    getAnalysisSummary(analyzedContent) {
        return {
            documentType: analyzedContent.documentStructure?.documentType || 'unknown',
            sectionCount: analyzedContent.sections.length,
            headerCount: analyzedContent.headers.length,
            paragraphCount: analyzedContent.paragraphs.length,
            listCount: analyzedContent.lists.length,
            tableCount: analyzedContent.tables.length,
            imageCount: analyzedContent.images.length,
            footnoteCount: analyzedContent.footnotes.length,
            hasHierarchy: analyzedContent.contentHierarchy.length > 0,
            complexityScore: this._calculateComplexityScore(analyzedContent)
        };
    }

    /**
     * Calculate content complexity score
     */
    _calculateComplexityScore(analyzedContent) {
        let score = 0;
        
        // Base score from content types
        score += analyzedContent.sections.length * 2;
        score += analyzedContent.lists.length * 1;
        score += analyzedContent.tables.length * 3;
        score += analyzedContent.images.length * 2;
        score += analyzedContent.footnotes.length * 1;
        
        // Hierarchy complexity
        const maxLevel = Math.max(...analyzedContent.headers.map(h => h.level), 0);
        score += maxLevel * 2;
        
        // Normalize to 0-100 scale
        return Math.min(100, score);
    }
}

export default ContentAnalyzer;
