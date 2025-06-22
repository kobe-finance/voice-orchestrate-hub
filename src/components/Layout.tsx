
import React, { ReactNode } from "react";
import { BaseLayout } from "./layouts/BaseLayout";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  leftContent?: ReactNode;
}

export const Layout = ({ 
  children,
  showHeader = false, 
  showFooter = false,
  leftContent 
}: LayoutProps) => {
  return (
    <BaseLayout 
      showHeader={showHeader} 
      showFooter={showFooter}
      leftContent={leftContent}
    >
      {children}
    </BaseLayout>
  );
}
