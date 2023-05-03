import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { getProductDetails } from '../../actions/productActions';

const Product = ({ product, col }) => {
    const dispatch = useDispatch();
  

    return (
        <div className={`col-sm-12 col-md-6 col-lg-${col} my-4 productcard`}>
            <div className="card p-3 rounded product displayformob">
                <img
                    className="card-img-top mx-auto cardimg"
                    src={product.images[0] && product.images[0].url}
                    alt={product.name} />

                <div className="card-title">
                    <h5 >
                        <Link to={`/products/${product._id}`} onClick={() => dispatch(getProductDetails(product._id))}>{product.name}</Link>
                    </h5>
                </div>
                <div className="ratings mt-auto">
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(product.rating / 5) * 100}%` }}></div>
                    </div>
                    <span id="no_of_reviews">({product.numofReviews} Reviews)</span>
                </div>
                <div className="orpr">
                    <div className="pri">
                        <p className="card-text mr-2 per " style={{ marginBottom: '0rem', marginTop: '0.3rem' }}>- </p>
                        <p className="card-text mr-2 per " style={{ marginBottom: '0rem', marginTop: '0.3rem' }}>% </p>
                        <p className="card-text mr-2 per " style={{ marginBottom: '0rem', marginTop: '0.3rem' }}>{Math.floor(((product.originalprice - product.price) / product.originalprice) * 100)}</p>
                        <p className="card-text mr-4 sp" style={{ marginBottom: '0rem', marginTop: '5px' }}>₹{product.price}</p></div>
                    <p className="card-text or" style={{ fontSize: '1rem' }}>MRP ₹{product.originalprice}</p>
                </div>
                <Link to={`/products/${product._id}`} onClick={() => dispatch(getProductDetails(product._id))} id="view_btn" className="btn btn-block">View Details</Link>
            </div>
        </div>
    )
}

export default Product