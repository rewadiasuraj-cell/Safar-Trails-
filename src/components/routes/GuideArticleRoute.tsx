import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { guidesData } from '../../data/guidesData';
import { TravelGuideArticleView } from '../TravelGuides/TravelGuideArticleView';
import { NotFoundPage } from '../NotFoundPage';
import { Package } from '../../types';

interface GuideArticleRouteProps {
  onStartAIPlan: (destinationName: string) => void;
  onOpenQuoteModal?: (summary?: string) => void;
}

/**
 * Looks a guide up by its URL slug and hands it to the article view.
 *
 * Same shape as DestinationDetailRoute: the view takes a TravelGuide object, the
 * router supplies a slug, and the data is bundled from content/ so there is no
 * fetch and no failure mode. An unknown slug renders the real 404.
 */
export const GuideArticleRoute: React.FC<GuideArticleRouteProps> = ({
  onStartAIPlan,
  onOpenQuoteModal,
}) => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const guide = guidesData.find((item) => item.slug === slug);

  if (!guide) return <NotFoundPage />;

  return (
    <TravelGuideArticleView
      guide={guide}
      onBack={() => navigate('/guides')}
      onSelectPackage={(pkg: Package) => navigate(`/tour-packages/${pkg.slug}`)}
      onStartAIPlan={onStartAIPlan}
      onOpenQuoteModal={onOpenQuoteModal ?? (() => undefined)}
    />
  );
};
