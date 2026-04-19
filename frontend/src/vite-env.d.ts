/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "react/jsx-runtime" {
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  export const Fragment: any;
  export function jsx(
    type: unknown,
    props: Record<string, unknown>,
    key?: string,
  ): any;
  export function jsxs(
    type: unknown,
    props: Record<string, unknown>,
    key?: string,
  ): any;
}
