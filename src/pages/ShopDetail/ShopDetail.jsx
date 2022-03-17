import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ShopAsideWrapper from 'components/ShopAside/ShopAsideWrapper';
import OrderModal from 'components/Modal/OrderModalForm/OrderModal';
import ProductImageArea from './ProductImageList/ProductImageArea';
import ProductInfo from './ProductInfo/ProductInfo';
import SkeletonShopDetail from './SkeletonShopDetail';
import { api } from 'config';
import useFetch from 'Hooks/useFetch';
import './ShopDetail.scss';

function ShopDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [floatModal, setFloatModal] = useState(false);
  const [orderedUserInfo, setOrderedUserInfo] = useState({});

  const { data: productDetail, loading: isProductLoading } = useFetch({
    url: `${api.detail}/${id}`,
  });
  const { data: categories, loading: isCategoryLoading } = useFetch({
    url: api.categories,
  });

  const handleQuantity = e => {
    const { className } = e.target;
    if (className === 'fas fa-plus') setQuantity(quantity => quantity + 1);
    if (className === 'fas fa-minus') {
      if (quantity === 1) return;
      setQuantity(quantity => quantity - 1);
    }
  };

  const productOrderForm = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify({
      product_id: id,
      quantity,
    }),
  };

  const submitOrderForm = () => {
    fetch(api.order, { method: 'POST', ...productOrderForm })
      .then(res => res.json())
      .then(data => {
        const { user_name: userName, user_point: point } = data.result;
        setOrderedUserInfo({
          userName: userName,
          point: point,
        });
      });
  };

  const handleOrderButton = e => {
    submitOrderForm();
    setFloatModal(true);
  };

  const closeModal = () => {
    setFloatModal(false);
  };

  if (isCategoryLoading || isProductLoading) return <SkeletonShopDetail />;

  return (
    <div className="ShopDetail">
      <ShopAsideWrapper categories={categories} cateNum="0" />
      <main className="shopDetailMain">
        <ProductImageArea
          images={productDetail.image_url}
          productName={productDetail.name}
        />
        <ProductInfo
          {...productDetail}
          quantity={quantity}
          handleQuantity={handleQuantity}
          submitOrder={handleOrderButton}
        />
      </main>
      {floatModal && (
        <OrderModal
          closeModal={closeModal}
          quantity={quantity}
          {...productDetail}
          {...orderedUserInfo}
        />
      )}
    </div>
  );
}

export default ShopDetail;
