import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../common/Layout';
import LazyLoadingWrapper from '../../common/LazyLoading';

// 1. Load the component lazily
const RenderProduct = lazy(() => import('../../components/Product'));

// 2. Create a memoized version that won't re-render when parent state changes
const MemoizedProduct = memo(RenderProduct);

export default function Product() {
  return (
    <>
      <Helmet>
        <title>Product</title>
      </Helmet>

      <LayoutWrapper activePage="Insights">
        <LazyLoadingWrapper>
          <MemoizedProduct />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}
