import { Document } from '@langchain/core/documents';

export type FileObject = {
  fileKey: string;
  fileName: string;
};

export interface PDFDocument extends Document {
  pageContent: string;
  metadata: {
    source: string;
    pdf: Record<string, any>;
    loc: {
      pageNumber: number;
      [key: string]: any;
    };
  };
}
