import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationsData } from '../../data/destinationsData';
import { DestinationDetailView } from '../Destinations/DestinationDetailView';
import { NotFoundPage } from '../NotFoundPage';
import { Package } from '../../types';

interface DestinationDetailRouteProps {
  onStartAIPlan: (destinationName: string) => void;
  onOpenQuoteModal: (summary?: string, destinationName?: string) => void;
}

/**
 * Looks a destination up by its URL slug and hands it to the view.
 *
 * DestinationDetailView takes a Destination object, not a slug, so this is the
 * small piece that bridges the router to it. The data comes from content/ via
 * src/data/generated, so it is present in the bundle and resolves synchronously -
 * no fetch, no loading state, and nothing that can fail at runtime.
 *
 * An unknown slug renders the real 404 page rather than an empty shell, which
 * keeps it noindex and gives the visitor somewhere to go.
 */
export const DestinationDetailRoute: React.FC<DestinationDetailRouteProps> = ({
  onStartAIPlan,
  onOpenQuoteModal,
}) => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // The Andaman pages have been published under both spellings over time.
  const alias = slug === 'andaman-nicobar' ? 'andaman' : slug === 'andaman' ? 'andaman-nicobar' : slug;
  const destination = destinationsData.find((item) => item.slug === slug || item.slug === alias);

  if (!destination) return <NotFoundPage />;

  return (
    <DestinationDetailView
      destination={destination}
      onBack={() => navigate('/destinations')}
      onSelectPackage={(pkg: Package) => navigate(`/tour-packages/${pkg.slug}`)}
      onStartAIPlan={onStartAIPlan}
      onOpenQuoteModal={onOpenQuoteModal}
    />
  );
};
