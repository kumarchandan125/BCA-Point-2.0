// src/components/PDFViewer.jsx
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// pdf.js worker config (Vite friendly)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2); // zoom

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.6));

  const handlePrevPage = () =>
    setPageNumber((p) => (p > 1 ? p - 1 : p));
  const handleNextPage = () =>
    setPageNumber((p) => (p < numPages ? p + 1 : p));

  return (
    <div className="w-full h-full rounded-3xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs bg-slate-950/70">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 rounded-full border border-slate-700 hover:border-slate-500"
          >
            -
          </button>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 rounded-full border border-slate-700 hover:border-slate-500"
          >
            +
          </button>
          <span className="text-slate-400 ml-1">
            Zoom: {(scale * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={pageNumber <= 1}
            className="px-2 py-1 rounded-full border border-slate-700 disabled:opacity-40 hover:border-slate-500"
          >
            ◀
          </button>
          <span className="text-slate-300">
            Page {pageNumber}{" "}
            <span className="text-slate-500">/ {numPages || "–"}</span>
          </span>
          <button
            onClick={handleNextPage}
            disabled={!numPages || pageNumber >= numPages}
            className="px-2 py-1 rounded-full border border-slate-700 disabled:opacity-40 hover:border-slate-500"
          >
            ▶
          </button>
        </div>
      </div>

      {/* PDF area */}
      <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-900">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p className="text-xs text-slate-400">Loading PDF…</p>}
          error={<p className="text-xs text-red-400">Failed to load PDF.</p>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}

export default PDFViewer;
