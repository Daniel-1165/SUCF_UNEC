import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = "SUCF UNEC";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = "SUCF UNEC is a vibrant Christian community at the University of Nigeria, Enugu Campus, committed to spiritual growth and academic excellence.";
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || "SUCF, UNEC, SUCF UNEC, Fellowship, University of Nigeria ENUGU, Christian Students Nigeria, Spiritual Growth Campus, The Unique Fellowship";
    const metaImage = image || "https://sucf-unec.vercel.app/assets/logo.png";
    const metaUrl = url || "https://sucf-unec.vercel.app/";

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={metaUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />

            <link rel="canonical" href={metaUrl} />
        </Helmet>
    );
};

export default SEO;
