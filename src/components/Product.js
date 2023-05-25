import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

function Product({ product }) {
  return (
    <Card className='my-3 p-3 rounded-4'>
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant='top' className='rounded-4' style={{ minHeight: '217px' }} />
        </Link>
        <Card.Body>
            <Link to={`/product/${product._id}`}>
                <Card.Title as='div'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as='div'>
                <Rating 
                    value={product.rating} 
                    text={`${product.numReviews} reviews`} 
                />
            </Card.Text>    
            <Card.Text as='h3'>${product.price}</Card.Text>
        </Card.Body>
    </Card>
  )
}

Rating.defaultProps = {
    color: '#ff9966',
}

export default Product