import { ScaledPosition } from "react-pdf-highlighter";

export interface MyObjectType {
  content: {
    text?: string;
    image?: Blob;
  };
  position: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    };
    rects: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    }>;
    pageNumber: number;
  };
  comment: {
    text: string;
    emoji: string;
  };
  id: string;
}
export interface MyHighlight {
  // content: {
  //   text?: string;
  //   image?: Blob;
  // };
  // position: {
  //   boundingRect: {
  //     x1: number;
  //     y1: number;
  //     x2: number;
  //     y2: number;
  //     width: number;
  //     height: number;
  //   };
  //   rects: Array<{
  //     x1: number;
  //     y1: number;
  //     x2: number;
  //     y2: number;
  //     width: number;
  //     height: number;
  //   }>;
  //   pageNumber: number;
  // };
  position: ScaledPosition;
  content: {
    text?: string | undefined;
    image?: string | undefined;
  };
}

export enum SidebarStatus {
  CAN_UPLOAD,
  LOADING,
  UPLOADED,
  SHARING_IN_PROGRESS,
  SHARING_SUCCESS,
}