import React, { memo } from 'react';
import { getCollectionBadgeClass } from '../collection-utils';

interface CollectionPercentageBadgeProps {
  percentage: number;
}

export const CollectionPercentageBadge = memo(function CollectionPercentageBadge({ percentage }: CollectionPercentageBadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 rounded ${getCollectionBadgeClass(percentage)}`}>
      {percentage.toFixed(1)}%
    </span>
  );
});
