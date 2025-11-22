// Заглушка для @radix-ui/react-avatar
import * as React from "react";

export const Root = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={className} {...props} />
  )
);
Root.displayName = "AvatarRoot";

export const Image = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img ref={ref} className={className} {...props} />
  )
);
Image.displayName = "AvatarImage";

export const Fallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={className} {...props} />
  )
);
Fallback.displayName = "AvatarFallback";
