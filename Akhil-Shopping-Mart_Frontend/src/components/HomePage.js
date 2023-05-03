import React, { Fragment, useEffect, useState } from 'react';
import Pagination from 'react-js-pagination'
import MetaData from './layout/MetaData';
import { Link } from 'react-router-dom'
import Product from './product/Product';
import Loader from './layout/Loader';
import { Dropdown, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import { useAlert } from 'react-alert'
import { getProductDetails } from '../actions/productActions';

const HomePage = ({ match }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([0, 0]);
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, products, error, resPerPage } = useSelector(
    (state) => state.products
  );

  const keyword = match.params.keyword

  useEffect(() => {
    if (error) {
      return alert.error(error)
    }
    dispatch(getProducts(keyword, currentPage, price, category, rating));
  }, [dispatch, alert, error, keyword, currentPage, price, category, rating]);

  return (
    <Fragment>
      {loading ?
        <Loader />
        : (
          <Fragment>
            <MetaData title={'Buy Best Products Online'} />
            <h1 id="products_heading">Latest Products</h1>
            <section id="products" className="container mt-5">
              <div style={{ display: 'flex', overflowX: 'auto' }}>
                {products && products.map(product => (
                  <div key={product._id} style={{ marginRight: '10px' }}>
                    <div className="card" style={{ width: '18rem' }}>
                      <div className="card p-3 rounded">
                        <img
                          className="card-img-top mx-auto"
                          src={product.images[0] && product.images[0].url}
                          alt={product.name} />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">
                            <Link to={`/products/${product._id}`} onClick={() => dispatch(getProductDetails(product._id))}>{product.name}</Link>
                          </h5>
                          <div className="ratings mt-auto">
                            <div className="rating-outer">
                              <div className="rating-inner" style={{ width: `${(product.rating / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product.numofReviews} Reviews)</span>
                          </div>
                          <div className="orpr">
                            <div className="pri">
                              <p className="card-text mr-2 per " style={{ marginBottom: '0rem', marginTop: '0.3rem', fontSize: '1rem' }}>-% {Math.floor(((product.originalprice - product.price) / product.originalprice) * 100)}</p>
                              <p className="card-text mr-4" style={{ marginBottom: '0rem' }}>₹{product.price}</p></div>
                            <p className="card-text or" style={{ fontSize: '1rem' }}>MRP ₹{product.originalprice}</p>
                          </div>
                          <Link to={`/products/${product._id}`} onClick={() => dispatch(getProductDetails(product._id))} id="view_btn" className="btn btn-block">View Details</Link>


                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </section>
          </Fragment>
        )}
    </Fragment>
  )
}

export default HomePage;
