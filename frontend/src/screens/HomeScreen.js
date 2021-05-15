import React, { useEffect } from "react";
import {Col, Row} from "react-bootstrap";
import Product from "../components/Product";
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from "../actions/productAction";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = ({ match }) => {
    const dispatch = useDispatch();
    const keyword = match.params.keyword;
    const pageNumber = match.params.pageNumber || 1;

    const productList =  useSelector(state => state.productList);
    const { loading, error, products, page, pages } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber])


    return (
        <>
            <h1>Latest Products</h1>
            {
                loading ? <Loader /> : error
                    ? <Message variant='danger'>{error}</Message> : (
                        <>
                            {!keyword && <ProductCarousel /> }
                            <Row>
                                {products.map(product => (
                                    <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                                        <Product product={product} />
                                    </Col>
                                ))}
                            </Row>
                            <Paginate page={page} pages={pages} keyword={keyword ? keyword : ''}  />
                        </>
                    )
            }

        </>
    )
}

export default HomeScreen