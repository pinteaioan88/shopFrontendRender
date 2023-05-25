import React, { useEffect } from 'react'
import {Link, useParams} from 'react-router-dom'
import {
    Row,
    Col,
    ListGroup,
    Image,
    Card,
    Button,
} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {deliverOrder, getOrderDetails, payOrder} from '../actions/orderActions'
import {
    PayPalButtons,
    usePayPalScriptReducer
  } from '@paypal/react-paypal-js'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'
import { useNavigate } from 'react-router-dom'

function OrderScreen() {
    const dispatch = useDispatch()
    const { id } = useParams()
    const navigate = useNavigate()
    const orderId = id
    const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const orderPay = useSelector((state) => state.orderPay)
    const { loading:loadingPay, success:successPay } = orderPay

    const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading:loadingDeliver, success:successDeliver } = orderDeliver

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
        if (!order || order._id !== orderId || successPay || successDeliver) {
          dispatch({ type: ORDER_PAY_RESET })
          dispatch({ type: ORDER_DELIVER_RESET })
          dispatch(getOrderDetails(orderId))
        }
      }, [dispatch, navigate,userInfo, order, orderId,successDeliver, successPay])

      const createOrder = (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: order.totalPrice }
            }
          ]
        });
      };

      const successPaymentHandler = (data, actions) => {
        return actions.order.capture().then(details => {
          dispatch(payOrder(orderId, details))
        })
      }

      const deliverHandler = () => {
        dispatch(deliverOrder(order))
      }

    return loading
        ? <Loader/>
        : error
            ? <Message variant='danger'>{error}</Message>
            : <> 
            <h1>Order {order._id}</h1>
            <Row> 
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Adress: </strong> {order.shippingAdress.adress}, {order.shippingAdress.city}, {order.shippingAdress.postalCode}, {order.shippingAdress.country}
                            </p>
                            {order.isDelivered ? 
                            (<Message variant='success'>Delivered on {order.deliveredAt}</Message>) :
                            (<Message variant='danger'>Not Delivered</Message>)
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong> {order.paymentMethod}
                            </p>
                            {order.isPaid ? 
                            (<Message variant='success'>Paid on {order.paidAt}</Message>) :
                            (<Message variant='danger'>Not Paid</Message>)
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {   
                                order.orderItems.lenght === 0
                                    ? <Message>Order is empty</Message>
                                    : (
                                        <ListGroup variant='flush'>
                                            {
                                                order.orderItems.map((item, index) => (
                                                        <ListGroup.Item key={index}>
                                                            <Row>
                                                                <Col md={1}>
                                                                    <Image src={item.image} alt={item.name} fluid="fluid" rounded="rounded"/>
                                                                </Col>
                                                                <Col>
                                                                    <Link to={`/product/${item.product}`}>
                                                                        {item.name}
                                                                    </Link>
                                                                </Col>
                                                                <Col md={4}>
                                                                    {item.qty}
                                                                    x ${item.price}
                                                                    = ${item.qty * item.price}
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    ))
                                            }
                                        </ListGroup>
                                    )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>TVA 19%</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {isPending && <Loader />}
                                    {isRejected && (
                                        <Message variant="danger">SDK load error</Message>
                                    )}
                                    {isResolved && (
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                        Mark as delivered
                                    </Button>
                                </ListGroup.Item>
                            )} 
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
    </>
}

export default OrderScreen