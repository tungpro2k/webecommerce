import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Row,Col,Image, ListGroup,Button,Card, ListGroupItem, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails } from '../actions/productActions'

function ProductScreen({ match }) {

    let {id} = useParams()
    const navigate = useNavigate()
    const[qty,setQty] = useState(1)
    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    useEffect(()=>{
        dispatch(listProductDetails(id))
        console.log(qty)
    }, [dispatch,match])
    
    const addToCartHandler = () => {
        navigate({
            pathname: `/cart/${id}`,
            search: `?${createSearchParams({
                qty: `${qty}`
            })}`
        })
        // navigate(`/cart/${id}?qty=${qty}`)
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {loading ?
                <Loader />
                : error
                ? <Message variant='danger'>{error}</Message>
                :(
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#ebcc34'} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Desciption: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md ={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                <strong>{product.countInStock > 0 ? 'In stock':'Out of Stock'}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col xs='auto' className='my-1'>
                                                    <Form.Control as="select" value={qty} onChange={e => setQty(e.target.value)}>
                                                        {
                                                            [...Array(parseInt(product.countInStock)).keys()].map((x) => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    )}

                                    <ListGroup.Item>
                                        <div className="d-grid gap-2">
                                            <Button onClick={addToCartHandler} className='btn-block' variant="primary" disabled={product.countInStock == 0} type='button' size='' >ADD TO CART</Button>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                )
            }
            
        </div>
    )
}

export default ProductScreen
