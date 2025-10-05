const fs = require('fs');
const path = require('path');

// Simple HTML to Word conversion script
// This creates HTML files that can be opened in Word and saved as .docx

function createWordDocument(markdownFile, outputFile) {
  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync(markdownFile, 'utf8');
    
    // Convert markdown to HTML (basic conversion)
    let htmlContent = markdownContent
      // Convert headers
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      
      // Convert bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Convert code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      
      // Convert lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      
      // Convert line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap in HTML structure
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>EcommerceWithAds Documentation</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            margin: 1in;
            color: #333;
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            margin-top: 24pt;
            margin-bottom: 12pt;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 6pt;
        }
        h2 {
            font-size: 16pt;
            font-weight: bold;
            margin-top: 18pt;
            margin-bottom: 10pt;
            color: #34495e;
        }
        h3 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 14pt;
            margin-bottom: 8pt;
            color: #2c3e50;
        }
        h4 {
            font-size: 13pt;
            font-weight: bold;
            margin-top: 12pt;
            margin-bottom: 6pt;
            color: #34495e;
        }
        h5 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 10pt;
            margin-bottom: 4pt;
            color: #2c3e50;
        }
        h6 {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 8pt;
            margin-bottom: 4pt;
            color: #34495e;
        }
        p {
            margin-bottom: 12pt;
            text-align: justify;
        }
        li {
            margin-bottom: 4pt;
        }
        code {
            background-color: #f4f4f4;
            padding: 2pt 4pt;
            border-radius: 3pt;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
        }
        pre {
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            padding: 12pt;
            border-radius: 5pt;
            overflow-x: auto;
            margin: 12pt 0;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        strong {
            font-weight: bold;
        }
        em {
            font-style: italic;
        }
        .page-break {
            page-break-before: always;
        }
        @media print {
            body {
                margin: 0.5in;
            }
        }
    </style>
</head>
<body>
    <p>${htmlContent}</p>
</body>
</html>`;
    
    // Write the HTML file
    fs.writeFileSync(outputFile, fullHtml, 'utf8');
    
    console.log(`✅ Created Word document: ${outputFile}`);
    console.log(`📝 Instructions:`);
    console.log(`   1. Open ${outputFile} in Microsoft Word`);
    console.log(`   2. Save As -> Word Document (.docx)`);
    console.log(`   3. The document is ready for submission`);
    
  } catch (error) {
    console.error(`❌ Error creating Word document: ${error.message}`);
  }
}

// Create English Word document
console.log('📄 Creating English Word document...');
createWordDocument('THESIS_DOCUMENTATION_EN.md', 'THESIS_DOCUMENTATION_EN.html');

// Create Greek Word document
console.log('📄 Creating Greek Word document...');
createWordDocument('THESIS_DOCUMENTATION_GR.md', 'THESIS_DOCUMENTATION_GR.html');

console.log('🎉 All Word documents created successfully!');
console.log('');
console.log('📋 Next Steps:');
console.log('   1. Open the HTML files in Microsoft Word');
console.log('   2. Save them as .docx files');
console.log('   3. The documents are ready for your thesis submission');
