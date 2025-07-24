/**
 * Text Extractor - Handles text content extraction from PDF documents
 * Based on CPdfTextChunk, CPDFTextAdvancer, and text processing classes from PDFLibTool.dll.c
 */

/**
 * Text Content structure for extracted text
 */
class TextContent {
    constructor() {
        this.pages = [];           // Array of PageTextContent
        this.documentText = '';    // Full document text
        this.metadata = {};        // Text extraction metadata
        this.statistics = {        // Text statistics
            totalCharacters: 0,
            totalWords: 0,
            totalLines: 0,
            totalParagraphs: 0
        };
    }
}

/**
 * Page Text Content structure
 */
class PageTextContent {
    constructor(pageNumber) {
        this.pageNumber = pageNumber;
        this.text = '';
        this.textBlocks = [];      // Array of TextBlock objects
        this.lines = [];          // Array of text lines
        this.words = [];          // Array of word objects with positions
        this.characters = [];     // Array of character objects with positions
    }
}

/**
 * Text Block structure (inspired by CPdfTextChunk)
 */
class TextBlock {
    constructor() {
        this.text = '';
        this.type = 'paragraph';   // 'paragraph', 'header', 'list', 'table', etc.
        this.level = 0;           // Hierarchy level (for headers, lists)
        this.bbox = { x: 0, y: 0, width: 0, height: 0 }; // Bounding box
        this.style = {            // Text styling
            fontSize: 12,
            fontFamily: 'Times-Roman',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#000000',
            alignment: 'left'
        };
        this.formatting = {       // Additional formatting
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false
        };
    }
}

/**
 * Word object with position and styling
 */
class WordObject {
    constructor(text, x, y, width, height) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fontSize = 12;
        this.fontFamily = 'Times-Roman';
        this.spaceAfter = false;
    }
}

/**
 * Text Extractor class (inspired by CPDFTextAdvancer, CPdfPageContentProcessor)
 */
class TextExtractor {
    constructor() {
        this.extractionOptions = {
            preserveFormatting: true,
            extractPositions: true,
            analyzeParagraphs: true,
            detectHeaders: true,
            detectLists: true,
            detectTables: false,
            minFontSizeForHeader: 14,
            paragraphSpacing: 12
        };
    }

    /**
     * Extract text content from parsed PDF document
     * Main extraction method inspired by text processing in PDFLibTool.dll.c
     */
    async extractText(pdfDocument) {
        try {
            const textContent = new TextContent();
            textContent.metadata = {
                extractionDate: new Date().toISOString(),
                documentInfo: pdfDocument.info,
                pageCount: pdfDocument.getPageCount()
            };

            // Process each page
            for (let i = 0; i < pdfDocument.getPageCount(); i++) {
                const page = pdfDocument.getPage(i);
                const pageTextContent = await this._extractPageText(page);
                textContent.pages.push(pageTextContent);
            }

            // Combine all page text
            textContent.documentText = textContent.pages
                .map(page => page.text)
                .join('\n\n');

            // Calculate statistics
            textContent.statistics = this._calculateTextStatistics(textContent);

            return textContent;

        } catch (error) {
            throw new Error(`Text extraction failed: ${error.message}`);
        }
    }

    /**
     * Extract text from a single page (inspired by CPdfPageContentProcessor)
     */
    async _extractPageText(page) {
        const pageTextContent = new PageTextContent(page.pageNumber);

        if (!page.textElements || page.textElements.length === 0) {
            return pageTextContent;
        }

        // Sort text elements by position (top to bottom, left to right)
        const sortedElements = this._sortTextElementsByPosition(page.textElements);

        // Group elements into text blocks
        const textBlocks = this._groupElementsIntoBlocks(sortedElements);

        // Process each text block
        textBlocks.forEach(block => {
            const processedBlock = this._processTextBlock(block);
            pageTextContent.textBlocks.push(processedBlock);
        });

        // Extract lines and words with positions
        pageTextContent.lines = this._extractLines(sortedElements);
        pageTextContent.words = this._extractWords(sortedElements);
        pageTextContent.characters = this._extractCharacters(sortedElements);

        // Combine all text for the page
        pageTextContent.text = pageTextContent.textBlocks
            .map(block => block.text)
            .join('\n');

        return pageTextContent;
    }

    /**
     * Sort text elements by position (reading order)
     */
    _sortTextElementsByPosition(textElements) {
        return textElements.slice().sort((a, b) => {
            // Sort by Y coordinate first (top to bottom), then X coordinate (left to right)
            const yDiff = b.y - a.y; // Reversed because PDF coordinates start from bottom
            if (Math.abs(yDiff) > 5) { // Allow for slight variations in baseline
                return yDiff;
            }
            return a.x - b.x;
        });
    }

    /**
     * Group text elements into logical blocks (inspired by CPageContentAnalizer2)
     */
    _groupElementsIntoBlocks(textElements) {
        const blocks = [];
        let currentBlock = null;
        const lineHeightThreshold = 20; // Threshold for determining line breaks
        const paragraphSpacing = this.extractionOptions.paragraphSpacing;

        textElements.forEach(element => {
            const shouldStartNewBlock = !currentBlock || 
                Math.abs(currentBlock.lastY - element.y) > lineHeightThreshold;

            if (shouldStartNewBlock) {
                // Start new block
                currentBlock = {
                    elements: [element],
                    minX: element.x,
                    maxX: element.x + element.width,
                    minY: Math.min(element.y, element.y),
                    maxY: Math.max(element.y + element.height, element.y + element.height),
                    lastY: element.y,
                    avgFontSize: element.fontSize,
                    avgLineHeight: element.height
                };
                blocks.push(currentBlock);
            } else {
                // Add to current block
                currentBlock.elements.push(element);
                currentBlock.minX = Math.min(currentBlock.minX, element.x);
                currentBlock.maxX = Math.max(currentBlock.maxX, element.x + element.width);
                currentBlock.minY = Math.min(currentBlock.minY, element.y);
                currentBlock.maxY = Math.max(currentBlock.maxY, element.y + element.height);
                currentBlock.lastY = element.y;
                
                // Update averages
                const totalElements = currentBlock.elements.length;
                currentBlock.avgFontSize = (currentBlock.avgFontSize * (totalElements - 1) + element.fontSize) / totalElements;
                currentBlock.avgLineHeight = (currentBlock.avgLineHeight * (totalElements - 1) + element.height) / totalElements;
            }
        });

        return blocks;
    }

    /**
     * Process a text block to determine its type and styling
     */
    _processTextBlock(elementBlock) {
        const textBlock = new TextBlock();
        
        // Combine text from all elements
        textBlock.text = elementBlock.elements
            .map(element => element.text)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Set bounding box
        textBlock.bbox = {
            x: elementBlock.minX,
            y: elementBlock.minY,
            width: elementBlock.maxX - elementBlock.minX,
            height: elementBlock.maxY - elementBlock.minY
        };

        // Determine block type and styling
        this._analyzeBlockType(textBlock, elementBlock);
        this._analyzeBlockStyling(textBlock, elementBlock);

        return textBlock;
    }

    /**
     * Analyze and determine block type (header, paragraph, list, etc.)
     */
    _analyzeBlockType(textBlock, elementBlock) {
        const firstElement = elementBlock.elements[0];
        const text = textBlock.text;

        // Check for headers (larger font size, short text, position)
        if (this.extractionOptions.detectHeaders) {
            if (firstElement.fontSize >= this.extractionOptions.minFontSizeForHeader ||
                firstElement.fontStyle === 'bold' ||
                text.length < 80) {
                textBlock.type = 'header';
                textBlock.level = this._determineHeaderLevel(firstElement.fontSize);
                return;
            }
        }

        // Check for lists
        if (this.extractionOptions.detectLists) {
            if (this._isListItem(text)) {
                textBlock.type = 'list';
                textBlock.level = this._determineListLevel(elementBlock.minX);
                return;
            }
        }

        // Default to paragraph
        textBlock.type = 'paragraph';
    }

    /**
     * Analyze block styling based on text elements
     */
    _analyzeBlockStyling(textBlock, elementBlock) {
        const firstElement = elementBlock.elements[0];

        // Set style properties
        textBlock.style = {
            fontSize: Math.round(elementBlock.avgFontSize),
            fontFamily: firstElement.fontName || 'Times-Roman',
            fontWeight: firstElement.fontStyle?.includes('bold') ? 'bold' : 'normal',
            fontStyle: firstElement.fontStyle?.includes('italic') ? 'italic' : 'normal',
            color: firstElement.color || '#000000',
            alignment: this._determineAlignment(elementBlock)
        };

        // Set formatting flags
        textBlock.formatting = {
            bold: firstElement.fontStyle?.includes('bold') || false,
            italic: firstElement.fontStyle?.includes('italic') || false,
            underline: firstElement.fontStyle?.includes('underline') || false,
            strikethrough: firstElement.fontStyle?.includes('strikethrough') || false
        };
    }

    /**
     * Determine header level based on font size
     */
    _determineHeaderLevel(fontSize) {
        if (fontSize >= 20) return 1;
        if (fontSize >= 18) return 2;
        if (fontSize >= 16) return 3;
        if (fontSize >= 14) return 4;
        return 5;
    }

    /**
     * Check if text is a list item
     */
    _isListItem(text) {
        const listPatterns = [
            /^[\u2022\u25E6\u2043\u2219•·‣⁃]\s/, // Bullet points
            /^\d+\.\s/,                          // Numbered list
            /^[a-zA-Z]\.\s/,                     // Lettered list
            /^[ivxlcdm]+\.\s/i,                  // Roman numerals
            /^-\s/,                              // Dash
            /^\*\s/                              // Asterisk
        ];
        
        return listPatterns.some(pattern => pattern.test(text));
    }

    /**
     * Determine list level based on indentation
     */
    _determineListLevel(xPosition) {
        const baseIndent = 50; // Base left margin
        const indentStep = 25; // Indentation step for each level
        
        return Math.max(0, Math.floor((xPosition - baseIndent) / indentStep));
    }

    /**
     * Determine text alignment based on element positions
     */
    _determineAlignment(elementBlock) {
        const pageWidth = 612; // Default page width
        const centerThreshold = 50;
        const rightThreshold = 100;
        
        const avgX = elementBlock.elements.reduce((sum, el) => sum + el.x, 0) / elementBlock.elements.length;
        const centerX = pageWidth / 2;
        
        if (Math.abs(avgX - centerX) < centerThreshold) {
            return 'center';
        } else if (avgX > pageWidth - rightThreshold) {
            return 'right';
        }
        
        return 'left';
    }

    /**
     * Extract lines with positions
     */
    _extractLines(textElements) {
        const lines = [];
        const lineThreshold = 5; // Y-coordinate threshold for same line
        
        let currentLine = null;
        
        textElements.forEach(element => {
            if (!currentLine || Math.abs(currentLine.y - element.y) > lineThreshold) {
                // Start new line
                currentLine = {
                    text: element.text,
                    x: element.x,
                    y: element.y,
                    width: element.width,
                    height: element.height,
                    elements: [element]
                };
                lines.push(currentLine);
            } else {
                // Add to current line
                currentLine.text += ' ' + element.text;
                currentLine.width = Math.max(currentLine.width, element.x + element.width - currentLine.x);
                currentLine.elements.push(element);
            }
        });
        
        return lines;
    }

    /**
     * Extract words with positions
     */
    _extractWords(textElements) {
        const words = [];
        
        textElements.forEach(element => {
            const elementWords = element.text.split(/\s+/);
            const wordWidth = element.width / elementWords.length;
            
            elementWords.forEach((word, index) => {
                if (word.trim()) {
                    const wordObj = new WordObject(
                        word,
                        element.x + (index * wordWidth),
                        element.y,
                        wordWidth,
                        element.height
                    );
                    wordObj.fontSize = element.fontSize;
                    wordObj.fontFamily = element.fontName;
                    words.push(wordObj);
                }
            });
        });
        
        return words;
    }

    /**
     * Extract characters with positions (for advanced formatting)
     */
    _extractCharacters(textElements) {
        const characters = [];
        
        textElements.forEach(element => {
            const charWidth = element.width / element.text.length;
            
            for (let i = 0; i < element.text.length; i++) {
                characters.push({
                    char: element.text[i],
                    x: element.x + (i * charWidth),
                    y: element.y,
                    width: charWidth,
                    height: element.height,
                    fontSize: element.fontSize,
                    fontFamily: element.fontName
                });
            }
        });
        
        return characters;
    }

    /**
     * Calculate text statistics
     */
    _calculateTextStatistics(textContent) {
        const text = textContent.documentText;
        
        return {
            totalCharacters: text.length,
            totalWords: text.split(/\s+/).filter(word => word.length > 0).length,
            totalLines: textContent.pages.reduce((sum, page) => sum + page.lines.length, 0),
            totalParagraphs: textContent.pages.reduce((sum, page) => 
                sum + page.textBlocks.filter(block => block.type === 'paragraph').length, 0
            )
        };
    }

    /**
     * Get extraction summary
     */
    getExtractionSummary(textContent) {
        return {
            statistics: textContent.statistics,
            pageCount: textContent.pages.length,
            hasFormatting: textContent.pages.some(page => 
                page.textBlocks.some(block => 
                    block.formatting.bold || 
                    block.formatting.italic || 
                    block.type !== 'paragraph'
                )
            ),
            headerCount: textContent.pages.reduce((sum, page) => 
                sum + page.textBlocks.filter(block => block.type === 'header').length, 0
            ),
            listCount: textContent.pages.reduce((sum, page) => 
                sum + page.textBlocks.filter(block => block.type === 'list').length, 0
            )
        };
    }
}

export default TextExtractor;
