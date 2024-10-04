import { Document } from '@langchain/core/documents';
import { chats } from './schema';

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

export type Chat = typeof chats.$inferSelect;
