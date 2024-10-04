import React from 'react';

type PDFViewerProps = {
  url: string;
};

export default function PDFViewer({ url }: PDFViewerProps) {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${url}&embedded=true`}
      className='w-full h-full'
    />
  );
}
