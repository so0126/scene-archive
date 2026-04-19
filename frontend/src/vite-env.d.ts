/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

import type * as React from "react";

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty
      extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute
      extends React.JSX.ElementChildrenAttribute {}
    type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T>
      extends React.JSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

declare module "react/jsx-runtime" {
  export namespace JSX {
    type Element = React.JSX.Element;
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }

  export const Fragment: unique symbol;
  export function jsx(
    type: unknown,
    props: Record<string, unknown>,
    key?: string,
  ): React.JSX.Element;
  export function jsxs(
    type: unknown,
    props: Record<string, unknown>,
    key?: string,
  ): React.JSX.Element;
}
