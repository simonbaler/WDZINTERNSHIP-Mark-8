declare namespace JSX {
  interface IntrinsicElements {
    // Minimal typing for <model-viewer> element used by Google Model Viewer
    'model-viewer': any;
  }
}

declare module '@google/model-viewer' {
  const modelViewer: any;
  export default modelViewer;
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string;
          'poster'?: string;
          'alt'?: string;
          'ar'?: boolean;
          'ar-modes'?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'environment-image'?: string;
          'shadow-intensity'?: string;
          'exposure'?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}