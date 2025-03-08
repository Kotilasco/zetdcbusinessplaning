// components/DonutSkeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DonutSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton height={200} width={200} circle={true} className="mx-auto" />
      <div className="flex justify-center">
        <div className="space-y-2">
          <Skeleton height={20} width={100} />
          <Skeleton height={20} width={100} />
          <Skeleton height={20} width={100} />
          <Skeleton height={20} width={100} />
        </div>
      </div>
    </div>
  );
};

export default DonutSkeleton;