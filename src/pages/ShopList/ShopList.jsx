import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ShopAsideWrapper from 'components/ShopAside/ShopAsideWrapper';
import ProductList from './ProductList/ProductList';
import Pagination from './Pagination/Pagination';
import SkeletonShopList from './SkeletonShopList';
import { api } from 'config';
import useFetch from 'Hooks/useFetch';
import './ShopList.scss';

function ShopList() {
  const location = useLocation();
  const cateNum = location.search.split('=')[1]
    ? location.search.split('=')[1]
    : '0';

  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 6;
  const indexOfLast = currentPage * productPerPage;
  const indexOfFirst = indexOfLast - productPerPage;
  const getCurrentProducts = entireProducts => {
    const currentProducts = entireProducts.slice(indexOfFirst, indexOfLast);
    return currentProducts;
  };

  const { data: productsInfo, loading: isProductsLoading } = useFetch({
    url: `${api.products}?category_no=${cateNum}`,
    trigger: cateNum,
  });
  const { data: categoryInfo, loading: isCategoryLoading } = useFetch({
    url: api.categories,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [cateNum]);

  if (isProductsLoading || isCategoryLoading) {
    return <SkeletonShopList />;
  }

  return (
    <div className="shopList">
      <ShopAsideWrapper
        categories={categoryInfo.categories}
        cateNum={cateNum}
      />
      <main className="shopListContent">
        <header className="shopHeader">
          <h3 className="titleFont">SHOP</h3>
        </header>
        <ProductList
          products={productsInfo.products}
          getCurrentProducts={getCurrentProducts}
        />
        <Pagination
          productPerPage={productPerPage}
          totalProducts={productsInfo.products.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </main>
    </div>
  );
}

export default ShopList;
