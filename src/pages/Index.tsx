
import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import SocialLinks from '../components/SocialLinks';
import FeaturedProducts from '../components/FeaturedProducts';
import CollectionShowcase from '../components/CollectionShowcase';
import Newsletter from '../components/Newsletter';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <SocialLinks />
      <FeaturedProducts />
      <CollectionShowcase />
      <Newsletter />
    </Layout>
  );
};

export default Index;
