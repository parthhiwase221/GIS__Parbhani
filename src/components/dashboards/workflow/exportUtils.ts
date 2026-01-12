import { WorkflowStage } from "./types";

interface ExportData {
  stage: WorkflowStage;
  data: any[];
  totals: any;
  headers: string[];
  title: string;
  subtitle: string;
}

export function exportToExcel(exportData: ExportData) {
  const { data, totals, headers, title, subtitle } = exportData;

  // Create CSV content
  let csvContent = `${title}\n`;
  csvContent += `${subtitle}\n\n`;

  // Add headers
  csvContent += headers.join(",") + "\n";

  // Add data rows
  data.forEach((row) => {
    const rowValues = Object.values(row).map((value) => {
      // Handle values with commas by wrapping in quotes
      const stringValue = String(value);
      if (stringValue.includes(",")) {
        return `"${stringValue}"`;
      }
      return stringValue;
    });
    csvContent += rowValues.join(",") + "\n";
  });

  // Add totals row
  const totalsValues = Object.values(totals).map((value) => {
    const stringValue = String(value);
    if (stringValue.includes(",")) {
      return `"${stringValue}"`;
    }
    return stringValue;
  });
  csvContent += totalsValues.join(",") + "\n";

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${exportData.stage}_Division_Summary.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(exportData: ExportData) {
  const { data, totals, headers, title, subtitle } = exportData;

  // Create HTML content for PDF
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          font-size: 10px;
        }
        h1 {
          font-size: 18px;
          color: #1e40af;
          margin-bottom: 5px;
        }
        h2 {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 20px;
          font-weight: normal;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 6px 8px;
          text-align: left;
        }
        th {
          background: linear-gradient(to right, #dbeafe, #e0e7ff);
          font-weight: 600;
          color: #1e40af;
          font-size: 9px;
        }
        td {
          font-size: 9px;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        tr:hover {
          background-color: #f1f5f9;
        }
        .totals-row {
          background: linear-gradient(to right, #dbeafe, #e0e7ff) !important;
          font-weight: 600;
        }
        .footer {
          margin-top: 20px;
          font-size: 8px;
          color: #64748b;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <h2>${subtitle}</h2>
      <table>
        <thead>
          <tr>
            ${headers.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) =>
                `<tr>${Object.values(row)
                  .map((value) => `<td>${value}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
          <tr class="totals-row">
            ${Object.values(totals)
              .map((value) => `<td>${value}</td>`)
              .join("")}
          </tr>
        </tbody>
      </table>
      <div class="footer">
        Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
      </div>
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: "text/html" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${exportData.stage}_Division_Summary.pdf.html`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Note: For true PDF generation, you would need a library like jsPDF or pdfmake
  // This exports as HTML which can be opened and printed to PDF by the user
}
