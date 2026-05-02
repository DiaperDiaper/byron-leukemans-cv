import { mkdirSync, writeFileSync } from "node:fs";

const outputPath = "assets/Byron-Leukemans-Academic-CV.pdf";
const pageWidth = 612;
const pageHeight = 792;
const margin = 58;
const bottomMargin = 58;
const bodyWidth = pageWidth - margin * 2;

const cv = [
  {
    heading: "Profile",
    lines: [
      "Second-year BCom Information Management 2A student at the University of Johannesburg.",
      "Focused on data science, information management, coding, business information systems, and clear communication.",
      "Top achiever in Information Management for first year 2025 with 10 first-year module distinctions."
    ]
  },
  {
    heading: "Education",
    lines: [
      "2026-Present  BCom Information Management 2A, University of Johannesburg.",
      "2025          First-year BCom Information Management record: all 10 module distinctions.",
      "Student number: 225091426."
    ]
  },
  {
    heading: "Distinctions",
    lines: [
      "Business Management 1A and 1B.",
      "Information Management 1A and 1B.",
      "Search Engine Optimisation; Information Portals.",
      "Economics 1A and 1B.",
      "Public Management and Governance 1A and 1B."
    ]
  },
  {
    heading: "Research Projects",
    lines: [
      "Information Portals 1A: Implementing an Information Portal in the Growing Business Sector. Keywords: information portals, content access, security, business growth, decision-making, integration.",
      "Information Management 1B: VeriCore Technologies biometric identity-verification business plan. Keywords: data protection, biometric verification, POPIA compliance, fraud prevention, secure identity.",
      "Public Management and Governance 1A: Separation of Powers and Its Practice in South Africa. Keywords: constitution, executive, judiciary, legislature, checks and balances.",
      "Public Management and Governance 1B: Sustainable Development and the Green Economy in South Africa. Keywords: green economy, renewable energy, policy strategy, sustainable development, economic growth."
    ]
  },
  {
    heading: "UJ Awards",
    lines: [
      "Top Achiever: Information Management, first year 2025.",
      "Advanced Information Literacy; Building Blocks of Information Literacy.",
      "Artificial Intelligence in the 4IR (SLP); Digital Citizenship; African Insights.",
      "Financial Literacy - Be Money Wise (SLP); Introduction to the Sustainable Development Goals.",
      "Ms Excel, Ms Teams, and Ms Word for the Workplace; Presentation for the Workplace.",
      "Understanding and Responding to GBV."
    ]
  },
  {
    heading: "Skills and Focus Areas",
    lines: [
      "Data science; information management; coding; business information systems.",
      "Research writing; analytical thinking; presentation skills; strong communication.",
      "Interests include digital portals, data protection, search engine optimisation, and secure identity systems."
    ]
  },
  {
    heading: "Contact",
    lines: [
      "Personal email: byronleukemans@gmail.com.",
      "Student email: 225091426@student.uj.ac.za.",
      "Phone: +27 76 736 5841.",
      "GitHub: https://github.com/DiaperDiaper."
    ]
  }
];

function escapePdf(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
}

const pages = [];
let commands = [];
let y = 724;
let pageNumber = 1;

function addPage() {
  if (commands.length) {
    addFooter();
    pages.push(commands.join("\n"));
  }

  commands = [];
  y = 724;
  addHeader(pageNumber === 1);
  pageNumber += 1;
}

function text(x, yPos, size, font, value, color = "0.05 0.06 0.08") {
  commands.push(`BT ${color} rg /${font} ${size} Tf ${x} ${yPos} Td (${escapePdf(value)}) Tj ET`);
}

function rule(x, yPos, w, h, color) {
  commands.push(`q ${color} rg ${x} ${yPos} ${w} ${h} re f Q`);
}

function ensureSpace(required) {
  if (y - required < bottomMargin) addPage();
}

function addHeader(isFirst) {
  if (isFirst) {
    text(margin, y, 26, "F2", "Byron Leukemans");
    y -= 26;
    text(margin, y, 10, "F1", "BCom Information Management 2A Student | University of Johannesburg", "0.22 0.24 0.28");
    y -= 16;
    text(margin, y, 10, "F1", "byronleukemans@gmail.com | 225091426@student.uj.ac.za | +27 76 736 5841", "0.22 0.24 0.28");
    y -= 18;
    rule(margin, y, bodyWidth, 2, "0.00 0.44 0.89");
    y -= 30;
  } else {
    text(margin, y, 12, "F2", "Byron Leukemans - Academic CV", "0.12 0.13 0.15");
    y -= 14;
    rule(margin, y, bodyWidth, 1, "0.80 0.82 0.85");
    y -= 28;
  }
}

function addFooter() {
  rule(margin, 42, bodyWidth, 1, "0.85 0.86 0.88");
  text(margin, 28, 8, "F1", `Page ${pages.length + 1}`, "0.42 0.44 0.48");
}

function addSection(section) {
  ensureSpace(82);
  text(margin, y, 13, "F2", section.heading, "0.00 0.44 0.89");
  y -= 18;

  for (const line of section.lines) {
    const wrapped = wrap(line, 86);
    for (const part of wrapped) {
      ensureSpace(15);
      text(margin, y, 10.5, "F1", part, "0.12 0.13 0.15");
      y -= 14;
    }
    y -= 4;
  }

  y -= 12;
}

addPage();
for (const section of cv) addSection(section);
addFooter();
pages.push(commands.join("\n"));

function buildPdf(pageStreams) {
  const objects = [null];
  const reserve = () => {
    objects.push("");
    return objects.length - 1;
  };
  const add = (body) => {
    objects.push(body);
    return objects.length - 1;
  };

  const catalogId = reserve();
  const pagesId = reserve();
  const fontRegularId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBoldId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds = [];

  for (const stream of pageStreams) {
    const length = Buffer.byteLength(stream, "utf8");
    const contentId = add(`<< /Length ${length} >>\nstream\n${stream}\nendstream`);
    const pageId = add(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  }

  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = Buffer.byteLength(pdf, "utf8");
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return pdf;
}

mkdirSync("assets", { recursive: true });
writeFileSync(outputPath, buildPdf(pages), "binary");
console.log(`Created ${outputPath}`);
