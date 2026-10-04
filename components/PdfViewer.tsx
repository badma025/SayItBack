"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { extractPdfDocument, type ExtractedPdfDocument } from "../lib/pdf-parser";

interface PdfViewerProps {
  pdfUrl?: string;
  onTextExtracted?: (extracted: ExtractedPdfDocument) => void;
  highlightQuery?: string;
}

export function PdfViewer({
  pdfUrl = "/kwame-discharge-letter.pdf",
  onTextExtracted,
  highlightQuery,
}: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.15);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [extractedDoc, setExtractedDoc] = useState<ExtractedPdfDocument | null>(null);

  // Load PDF and extract ground-truth text layer
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);

        const pdfjsLib = await import("pdfjs-dist");
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
        }

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const doc = await loadingTask.promise;

        if (isCancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);

        // Also extract ground-truth text layer
        const extracted = await extractPdfDocument(pdfUrl);
        if (!isCancelled) {
          setExtractedDoc(extracted);
          if (onTextExtracted) {
            onTextExtracted(extracted);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Failed to load PDF with pdf.js:", err);
          setError(err?.message || "Failed to load PDF document");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl, onTextExtracted]);

  // Render current page to canvas
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Error rendering PDF page on canvas:", err);
      }
    },
    [pdfDoc, scale]
  );

  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg border border-gray-300 overflow-hidden shadow-sm">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#005EB8]" />
          <span className="font-bold text-gray-800">Ground-Truth PDF (pdf.js)</span>
          {extractedDoc && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Text layer extracted ({extractedDoc.fullText.length} chars)</span>
            </span>
          )}
        </div>

        {/* Page & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || loading}
              className="p-1 text-gray-600 hover:text-black disabled:opacity-30 disabled:hover:text-gray-600"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-gray-700 text-xs">
              {currentPage} / {numPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages || loading}
              className="p-1 text-gray-600 hover:text-black disabled:opacity-30 disabled:hover:text-gray-600"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-1">
            <button
              onClick={() => setScale((s) => Math.max(0.7, s - 0.15))}
              className="p-1 text-gray-600 hover:text-black"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] text-gray-600 font-mono">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2.0, s + 0.15))}
              className="p-1 text-gray-600 hover:text-black"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={pdfUrl}
            download="Kwame_Mensah_Discharge_Summary.pdf"
            className="inline-flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded text-xs transition-colors"
            title="Download PDF file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download</span>
          </a>
        </div>
      </div>

      {/* PDF Canvas Container */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start min-h-[460px] bg-slate-200/70">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 text-gray-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#005EB8] mb-2" />
            <p className="text-xs font-medium">Rendering PDF via pdf.js text engine...</p>
          </div>
        )}

        {error && (
          <div className="p-6 max-w-md bg-white rounded border border-red-200 text-red-700 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>PDF Render Error</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        <div className={`relative shadow-md bg-white ${loading ? "hidden" : "block"}`}>
          <canvas ref={canvasRef} className="block mx-auto max-w-full h-auto" />
        </div>
      </div>

      {/* Footer verification notice */}
      <div className="bg-slate-50 border-t border-gray-200 px-3 py-1.5 text-[11px] text-gray-600 flex items-center justify-between">
        <span>Golden Path: PDF with genuine text layer (non-circular quote verification)</span>
        <span className="font-mono text-gray-500">St Thomas&apos; eDischarge (PRSB)</span>
      </div>
    </div>
  );
}
