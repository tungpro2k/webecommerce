import React, {useEffect} from 'react'
import { Link, useParams, useNavigate, createSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart,removeFromCart } from '../actions/cartActions'
import { cartReducer } from '../reducers/cartReducers'

function CartScreen(match, location, history) {
    let {id} = useParams()
    let params = new URLSearchParams(document.location.search);
    let qty = params.get("qty") ? params.get("qty") : 1
    const productId = id
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    useEffect(() => {
        if(productId){
            dispatch(addToCart(productId, qty))
        }
    },[dispatch, productId, qty])
    const removerFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const CheckoutHandler = () =>{
        navigate({
            pathname: `/login/`,
            search: `?${createSearchParams({
                redirect: "shipping"
            })}`
        })
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant='info'>
                        You cart is empty <Link to='/'>Go Back</Link>
                    </Message>
                ) : (
                    <ListGroup variant='fluid'>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>

                                    <Col md={2}>
                                        ${item.price}
                                    </Col>
                                    <Col md={3}>
                                        <Form.Control as="select" value={item.qty} onChange={e => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                            {
                                                [...Array(parseInt(item.countInStock)).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        <Button type='button' variant='light' onClick={() => removerFromCartHandler(item.product)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>

                                    </Col>
                                </Row>

                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                        {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </ListGroup.Item>
                </ListGroup>

                <ListGroup.Item>
                    <div className="d-grid gap-2">
                        <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={CheckoutHandler}>
                            PRCOCEED TO CHECKOUT
                        </Button>
                    </div>
                </ListGroup.Item>
            </Col>
        </Row>
    )
}

export default CartScreen
