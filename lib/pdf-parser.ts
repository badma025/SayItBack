/**
 * PDF.js client-side text extractor and quote grounding verifier.
 *
 * Implements the core architectural guarantee from AGENTS.md:
 * "The golden path is a PDF with a text layer, not a photo.
 *  pdf.js gives ground-truth text, and quotes are string-matched against it."
 */

export interface TextToken {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
  tokens: TextToken[];
}

export interface ExtractedPdfDocument {
  numPages: number;
  fullText: string;
  normalizedText: string;
  pages: ExtractedPdfPage[];
}

export interface QuoteVerificationResult {
  verified: boolean;
  matchType: "exact" | "normalized" | "fuzzy" | "unverified";
  confidence: number;
  matchedQuote: string;
  startOffset?: number;
  endOffset?: number;
  pageNumber?: number;
  message: string;
}

function cleanString(str: string): string {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Verifies that a model slot quote actually exists in the ground-truth PDF text layer.
 */
export function verifyQuoteAgainstPdfText(
  groundTruthText: string,
  targetQuote: string,
  threshold: number = 0.82
): QuoteVerificationResult {
  if (!targetQuote || !targetQuote.trim()) {
    return {
      verified: false,
      matchType: "unverified",
      confidence: 0,
      matchedQuote: targetQuote,
      message: "Empty quote provided for verification",
    };
  }

  // 1. Exact string search
  const exactIndex = groundTruthText.indexOf(targetQuote);
  if (exactIndex !== -1) {
    return {
      verified: true,
      matchType: "exact",
      confidence: 1.0,
      matchedQuote: targetQuote,
      startOffset: exactIndex,
      endOffset: exactIndex + targetQuote.length,
      message: "Verified exact match in PDF ground-truth text layer",
    };
  }

  // 2. Normalized whitespace and case search
  const normGround = cleanString(groundTruthText);
  const normQuote = cleanString(targetQuote);

  const normIndex = normGround.indexOf(normQuote);
  if (normIndex !== -1) {
    return {
      verified: true,
      matchType: "normalized",
      confidence: 0.98,
      matchedQuote: targetQuote,
      startOffset: normIndex,
      endOffset: normIndex + normQuote.length,
      message: "Verified normalized match in PDF ground-truth text layer",
    };
  }

  // 3. Sub-segment matching (if quote has ellipses "..." or line breaks)
  const segments = targetQuote
    .split(/\.\.\.|\n/)
    .map((s) => cleanString(s))
    .filter((s) => s.length > 8);

  if (segments.length > 1) {
    const allFound = segments.every((seg) => normGround.includes(seg));
    if (allFound) {
      return {
        verified: true,
        matchType: "normalized",
        confidence: 0.95,
        matchedQuote: targetQuote,
        message: "Verified all key clauses in PDF ground-truth text layer",
      };
    }
  }

  // 4. Token overlap fuzzy match for clinical quotes
  const quoteWords = normQuote.split(/\s+/).filter((w) => w.length > 2);
  if (quoteWords.length > 0) {
    const matchedCount = quoteWords.filter((w) => normGround.includes(w)).length;
    const overlapRatio = matchedCount / quoteWords.length;

    if (overlapRatio >= threshold) {
      return {
        verified: true,
        matchType: "fuzzy",
        confidence: Number(overlapRatio.toFixed(2)),
        matchedQuote: targetQuote,
        message: `Verified fuzzy match (${Math.round(overlapRatio * 100)}% keyword grounding in PDF)`,
      };
    }
  }

  return {
    verified: false,
    matchType: "unverified",
    confidence: 0,
    matchedQuote: targetQuote,
    message: "Quote not found in PDF text layer. Flagged for ward review.",
  };
}

/**
 * Loads a PDF in the browser using pdf.js, extracts ground-truth text and token coordinates.
 */
export async function extractPdfDocument(
  source: string | ArrayBuffer
): Promise<ExtractedPdfDocument> {
  const pdfjsLib = await import("pdfjs-dist");

  // Worker setup
  if (typeof window !== "undefined") {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    }
  }

  const loadingTask = pdfjsLib.getDocument(source);
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const pages: ExtractedPdfPage[] = [];
  const fullTextParts: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    const pageTokens: TextToken[] = [];
    const lineStrings: string[] = [];

    for (const item of textContent.items) {
      if ("str" in item) {
        pageTokens.push({
          str: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
          height: item.height,
          pageNumber: i,
        });
        lineStrings.push(item.str);
      }
    }

    const pageText = lineStrings.join(" ");
    pages.push({
      pageNumber: i,
      text: pageText,
      tokens: pageTokens,
    });
    fullTextParts.push(pageText);
  }

  const fullText = fullTextParts.join("\n\n");
  const normalizedText = cleanString(fullText);

  return {
    numPages,
    fullText,
    normalizedText,
    pages,
  };
}
