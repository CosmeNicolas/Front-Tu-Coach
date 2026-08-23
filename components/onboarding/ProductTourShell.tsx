'use client';

import { ProductTourRunner } from './ProductTourRunner';

export function ProductTourShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductTourRunner />
      {children}
    </>
  );
}
