import { Block } from '@/shared/blocks';

/**
 * Generates HTML content for a user's page based on their layout
 * @param username The username for the page
 * @param layout The layout blocks to render
 * @returns HTML string of the complete page
 */
export function generateHtml(username: string, layout: Block[]): string {
    // Base HTML template with styling
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${username} | Links</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      max-width: 500px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .name-block {
      font-size: 24px;
      font-weight: 700;
      text-align: center;
    }
    .bio-block {
      margin-bottom: 16px;
    }
    .bio-content p {
      margin: 0 0 12px;
    }
    .bio-content ul, .bio-content ol {
      margin: 0 0 12px;
      padding-left: 24px;
    }
    .bio-content blockquote {
      margin: 0 0 12px;
      padding-left: 16px;
      border-left: 4px solid #ddd;
    }
    .link-block {
      display: block;
      padding: 12px 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      text-decoration: none;
      color: #333;
      font-weight: 500;
      text-align: center;
      transition: background-color 0.2s;
    }
    .link-block:hover {
      background-color: #e5e5e5;
    }
  </style>
</head>
<body>
  <div class="container">
    ${renderBlocks(layout)}
  </div>
</body>
</html>`;

    return html;
}

/**
 * Renders blocks to HTML
 * @param blocks The blocks to render
 * @returns HTML string of rendered blocks
 */
function renderBlocks(blocks: Block[]): string {
    return blocks.map(block => {
        switch (block.type) {
            case 'name':
                return `<div class="name-block">${block.props.text}</div>`;
            case 'bio':
                return `<div class="bio-block"><div class="bio-content">${block.props.text}</div></div>`;
            case 'link':
                return `<a href="${block.props.url}" target="_blank" rel="noopener noreferrer" class="link-block">${block.props.label}</a>`;
            default:
                return '';
        }
    }).join('\n    ');
}

/**
 * Triggers download of HTML content as a file
 * @param username The username for the filename
 * @param htmlContent The HTML content to download
 */
export function downloadHtml(username: string, htmlContent: string): void {
    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}-links.html`;

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}