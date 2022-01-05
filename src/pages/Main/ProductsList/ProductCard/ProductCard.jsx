import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.scss';

export default function ProductCard({ products }) {
  return (
    <div className="productCard">
      <Link to={`/productdetail/:${products.id}`}>
        <img
          className="productImg"
          src={products.image_url}
          alt={products.name}
        />
      </Link>

      <div className="productName">{products.name}</div>
      <div className="productDescription">{products.description}</div>
      <div className="tasting_note">{products.tasting_note}</div>
      <div className="productDate">로스팅 : {products.created_at}</div>
      <div className="productPrice">{products.price}원</div>
    </div>
  );
}