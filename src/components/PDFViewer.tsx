import React from 'react';

type PDFViewerProps = {
  url: string;
};

export default function PDFViewer({ url }: PDFViewerProps) {
  return <iframe src={url} className='w-full h-full' title='PDF Viewer' />;
}
