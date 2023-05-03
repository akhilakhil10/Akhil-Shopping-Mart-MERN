import React, { Fragment, useEffect, useState } from 'react';
import Pagination from 'react-js-pagination'
import MenuIcon from '@mui/icons-material/Menu';
import MetaData from './layout/MetaData';
import Product from './product/Product';
import Loader from './layout/Loader';
import { Dropdown } from 'react-bootstrap';


import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import { useAlert } from 'react-alert'



const Home = ({ match }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 0]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(0);

    const categories = [
        'Mobiles',
        'Cameras',
        'Laptops',
        'Headphones',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Home',
    ];

    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(
        (state) => state.products
    );

    const [display, setDisplay] = useState(false);
    console.log('res', resPerPage)

    const keyword = match.params.keyword
    useEffect(() => {
        if (error) {
            return alert.error(error)
        }
        dispatch(getProducts(keyword, currentPage, price, category, rating));

    }, [dispatch, alert, error, keyword, currentPage, price, category, rating]);

    console.log(products);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = productsCount;
    if (keyword) {
        count = filteredProductsCount
    }

    const filteredProducts = rating
        ? products.filter((product) => product.rating >= rating)
        : products;

    function handleCategoryClick(cat) {
        setCategory(cat);
        setDisplay(!display);
    }

    function handleRatingClick(star) {
        setRating(star);
        setDisplay(false); // close the sidebar content
    };

    const handleFilterBtnClick = () => {
        const minPriceInput = document.querySelector('#min-price');
        const maxPriceInput = document.querySelector('#max-price');
        console.log(minPriceInput)
        const minPrice = parseInt(minPriceInput.value);
        const maxPrice = parseInt(maxPriceInput.value);

        console.log(minPriceInput.value)
        console.log(minPrice, 'min')

        if (!minPrice || !maxPrice || minPrice < 1 || maxPrice < 1) {
            return alert.error('Please enter a valid price range.');
        }
        setPrice([minPrice, maxPrice]);
        dispatch(getProducts(keyword, currentPage, [minPrice, maxPrice], category, rating));
        setDisplay(false);
    }
    
    const handleFilterBtnClicks = () => {
        const minePriceInput = document.querySelector('#mine-price');
        const maxePriceInput = document.querySelector('#maxe-price');
        console.log(minePriceInput)
        const minePrice = parseInt(minePriceInput.value);
        const maxePrice = parseInt(maxePriceInput.value);

        console.log(minePriceInput.value)
        console.log(minePrice, 'mine')

        if (!minePrice || !maxePrice || minePrice < 1 || maxePrice < 1) {
            return alert.error('Please enter a valid price range.');
        }
        setPrice([minePrice, maxePrice]);
        dispatch(getProducts(keyword, currentPage, [minePrice, maxePrice], category, rating));
        setDisplay(false);
    }

    console.log(currentPage);

    return (

        <Fragment>

            {loading ?
                <Loader />
                : (
                    <Fragment>
                        <MetaData title={'Buy Best Products Online'} />
                        <h1 id="products_heading">Latest Products</h1>
                        <section id="products" className="container mt-5">
                            <div className="row">
                                <Fragment>
                                    <div className="menuforhome">
                                        <div className="menu-icon" onClick={() => setDisplay(!display)}>
                                            <MenuIcon />
                                        </div>
                                        <div className="sidebar-content" style={{ display: display ? "block" : "none" }}>
                                            <div className="col-6 col-md-3 mt-3 mb-5">
                                                <div className="px-1 cat">
                                                    <h4 className="mb-3">Price Filter</h4>
                                                    <div className="price-filter">
                                                        <label htmlFor="min-price">Min price:</label>
                                                        <input type="number" id="min-price" name="min-price" />

                                                        <label htmlFor="max-price">Max price:</label>
                                                        <input type="number" id="max-price" name="max-price" />

                                                        <button id="filter-btn" onClick={handleFilterBtnClick}>Filter</button>
                                                    </div>

                                                    <hr className="my-3" />

                                                    <div className="mt-5">
                                                        <h4 className="mb-3">Categories</h4>

                                                        <Dropdown className="Dropdown">
                                                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" onToggle={(isOpen) => setCategory(isOpen ? category : '')}>

                                                                {category || 'Select category'}
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                {categories?.map((cat) => (
                                                                    <Dropdown.Item
                                                                        key={cat}
                                                                        onClick={() => handleCategoryClick(cat)}
                                                                    >
                                                                        {cat}
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                    <hr className="my-3" />
                                                    <div className="mt-5">
                                                        <h4 className="mb-3">Ratings</h4>
                                                        <select className="form-select" onChange={(e) => setRating(parseInt(e.target.value))}>
                                                            <option value="">Select rating</option>
                                                            {[5, 4, 3, 2, 1].map((star) => (
                                                                <option key={star} value={star}>
                                                                    <div className="mb-2 rat" onClick={()=>handleRatingClick(star)}>
                                                                        <div className="rating-outer" style={{ display: "inline-block" }}>
                                                                            <div
                                                                                className="rating-inner"
                                                                                style={{
                                                                                    width: `${star * 20}%`,
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="ml-2">{star} star and above</span>
                                                                    </div>
                                                                </option>
                                                            ))}
                                                        </select>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* </Fragment> */}
                                    {/* <Fragment> */}
                                    <div className="menudisplaylap">
                                        <div className="col-6 col-md-3 mt-3 mb-5">
                                            <div className="px-1 cat">
                                                <h4 className="mb-3">Price Filter</h4>
                                                <div className="price-filter">
                                                    <label htmlFor="min-price">Min price:</label>
                                                    <input type="number" id="mine-price" name="min-price" />

                                                    <label htmlFor="max-price">Max price:</label>
                                                    <input type="number" id="maxe-price" name="max-price" />

                                                    <button id="filter-btn" onClick={handleFilterBtnClicks}>Filter</button>
                                                </div>

                                                <hr className="my-3" />

                                                <div className="mt-5">
                                                    <h4 className="mb-3">Categories</h4>

                                                    <Dropdown className="Dropdown">
                                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" onToggle={(isOpen) => setCategory(isOpen ? category : '')}>

                                                            {category || 'Select category'}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            {categories?.map((cat) => (
                                                                <Dropdown.Item
                                                                    key={cat}
                                                                    onClick={() => handleCategoryClick(cat)}
                                                                >
                                                                    {cat}
                                                                </Dropdown.Item>
                                                            ))}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="mt-5">
                                                    <h4 className="mb-3">Ratings</h4>
                                                    <select className="form-select" onChange={(e) => setRating(parseInt(e.target.value))}>
                                                        <option value="">Select rating</option>
                                                        {[5, 4, 3, 2, 1].map((star) => (
                                                            <option key={star} value={star}>
                                                                <div className="mb-2 rat" onClick={() => setRating(star)}>
                                                                    <div className="rating-outer" style={{ display: "inline-block" }}>
                                                                        <div
                                                                            className="rating-inner"
                                                                            style={{
                                                                                width: `${star * 20}%`,
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="ml-2">{star} star and above</span>
                                                                </div>
                                                            </option>
                                                        ))}
                                                    </select>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-9 productdisplay">
                                        <div className="row">
                                            {filteredProducts && filteredProducts.map(product => (
                                                <Product key={product._id} product={product} col={4} />
                                            ))}
                                        </div>
                                    </div>

                                </Fragment>

                            </div>
                        </section >
                        {resPerPage <= count &&
                            (
                                <div className="d-flex justify-content-center mt-5">
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={resPerPage}
                                        totalItemsCount={productsCount}
                                        onChange={setCurrentPageNo}
                                        nextPageText={'Next'}
                                        prevPageText={'Prev'}
                                        firstPageText={'First'}
                                        lastPageText={'Last'}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        onError={(error) => console.log(error)}
                                    />
                                </div>
                            )
                        }


                    </Fragment >
                )}
        </Fragment >

    )
}

export default Home