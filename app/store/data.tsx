
type Store = {
  companyName: string;
  supportedFormats: Array<string>,
  pdfToOtherFormats: Array<string>,
  pricePlans:Array<{
    plan:string,
    price:number,
    perks:Array<string>
  }>
  documentFormats: Array<string>
  routes: Array<{
    route:string,
    href:string
  }>
};

export const store: Store = {
  companyName: 'FilesConverto',
  routes: [
    { route: 'Convert', href: '/Convert' },
    // { route: 'Compress', href: '/compress' },
    // { route: 'Pricing', href: '/PremiumPrices' },
    { route: 'Help', href: '/Help' }
  ],
  pricePlans:[{plan:'Standard',price:7.50,perks:[]}],
  supportedFormats:[
    'PDF',
    'JPG',
    'MP4',
    'MP3',
    'PNG',
    'DOCX',
    'GIF',
    'AVI'
  ],
  documentFormats:[
    "PDF",
    "DOC",
    "DOCX",
    "RTF",
    "TXT",
    "ODT",
    "PPT",
    "PPTX",
    "XLS",
    "XLSX",
    "CSV",
    "MD"
  ],
  pdfToOtherFormats: [
    "PDF to DXF",
    "PDF to DOC",
    "PDF to DOCX",
    "PDF to HTML",
    "PDF to PDF",
    "PDF to RTF",
    "PDF to TXT",
    "PDF to AZW3",
    "PDF to EPUB",
    "PDF to LRF",
    "PDF to MOBI",
    "PDF to OEB",
    "PDF to PDB",
    "PDF to AVIF",
    "PDF to BMP",
    "PDF to EPS",
    "PDF to GIF",
    "PDF to ICO",
    "PDF to JPG",
    "PDF to ODD",
    "PDF to PNG",
    "PDF to PS",
    "PDF to PSD",
    "PDF to TIFF",
    "PDF to WEBP",
    "PDF to PPT",
    "PDF to PPTX",
    "PDF to XLS",
    "PDF to XLSX",
    "PDF to EMF",
    "PDF to SVG",
    "PDF to WMF"
  ]
};

