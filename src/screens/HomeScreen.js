import React, { useEffect } from 'react'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector} from 'react-redux'
import { listProducts } from '../actions/productActions'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'


function HomeScreen() {
  const dispatch = useDispatch()
  const params = useParams()

  const keyword = params.keyword
  const pageNumber = params.pageNumber || 1

  const productList = useSelector(state => state.productList)
  const { loading, error, products, page, pages } = productList
 
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      {!keyword && <ProductCarousel />}
        <h1>Latest Products</h1>
        {loading 
            ? (<Loader />)
            : error ? (<Message variant='danger'>{error}</Message>) 
            : (
              <>
              <Row>
                  {products.map(product => (
                      <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='align-items-stretch d-flex'>
                          <Product product={product} />
                      </Col>
                  ))}
              </Row>
              <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
              </>
            )}
    </>
  )
}

export default HomeScreen