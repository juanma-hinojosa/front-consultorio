import React, { useState } from 'react';
import Modal from 'react-modal';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url'; // 👈 import local worker

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
Modal.setAppElement('#root');

const PDFModal = ({ isOpen, onClose, pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!pdfUrl) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Visor de PDF"
      style={{
        content: {
          top: '5%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          padding: '15px',
          backgroundColor: '#1c1c1c',
          color: 'white',
          overflow: 'auto',
          borderRadius: '10px',
          border: 'none',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
        },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Archivo PDF</h3>
        <button onClick={onClose} style={{
          background: 'transparent',
          color: 'white',
          fontSize: '20px',
          border: 'none',
          cursor: 'pointer'
        }}>✖</button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button onClick={() => setScale(scale + 0.2)} style={btnStyle}>🔍 +</button>
        <button onClick={() => setScale(scale - 0.2)} style={btnStyle} disabled={scale <= 0.6}>🔍 −</button>
        <span style={{ marginLeft: '10px' }}>Zoom: {(scale * 100).toFixed(0)}%</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p>Cargando PDF...</p>}
          options={{ disableAutoFetch: true, disableStream: true }}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
    </Modal>
  );
};

const btnStyle = {
  background: '#444',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '0 5px'
};

export default PDFModal;
