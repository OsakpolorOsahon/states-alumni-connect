
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  pathname?: string;
  type?: string;
}

const SEO = ({ 
  title = "SMMOWCUB – Senior Members of the Man O' War Club",
  description = "Official portal for Senior Members of the Man O' War Club, University of Benin alumni network. Connect with fellow statesmen and build lasting professional relationships.",
  image = "/icons/icon-512.png",
  pathname = "",
  type = "website"
}: SEOProps) => {
  const siteUrl = "https://your-domain.com"; // Replace with actual domain
  const fullUrl = `${siteUrl}${pathname}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SMMOWCUB" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="SMMOWCUB" />
      <meta name="keywords" content="SMMOWCUB, Man O War Club, UNIBEN, University of Benin, Alumni, Statesmen" />
    </Helmet>
  );
};

export default SEO;
