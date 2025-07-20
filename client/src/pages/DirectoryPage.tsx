import React from 'react';
import SEO from '@/components/SEO';
import PublicDirectorySection from '@/components/PublicDirectorySection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const DirectoryPage = () => {
  return (
    <>
      <SEO
        title="Member Directory - SMMOWCUB"
        description="Connect with our distinguished network of statesmen from the Man O' War Club, University of Benin. View member profiles organized by council hierarchy and stateship year."
        keywords="SMMOWCUB directory, statesmen network, Man O' War Club members, UNIBEN alumni"
      />
      <Navigation />
      <main className="min-h-screen">
        <div className="pt-20">
          <PublicDirectorySection />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DirectoryPage;