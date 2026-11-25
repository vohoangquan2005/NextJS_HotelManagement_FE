"use client";

import { useState, type ReactNode } from "react";

interface ImageWithFallbackProps {
    src: string | null | undefined;
    alt: string;
    className?: string;
    fallback: ReactNode;
}

export default function ImageWithFallback({
    src,
    alt,
    className,
    fallback,
}: ImageWithFallbackProps) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    // Cloudinary serves the same public image over HTTPS. Older URLs may have
    // been saved as HTTP and are blocked as mixed content on an HTTPS page.
    const displaySrc = src?.trim().replace(
        /^http:\/\/res\.cloudinary\.com\//i,
        "https://res.cloudinary.com/",
    );

    if (!displaySrc || failedSrc === displaySrc) return <>{fallback}</>;

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={displaySrc}
            alt={alt}
            className={className}
            onError={() => setFailedSrc(displaySrc)}
        />
    );
}
