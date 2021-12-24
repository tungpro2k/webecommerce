import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Row,Col,Image, ListGroup,Button,Card, ListGroupItem, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_REVIEWS_RESET } from '../constants/productConstants'

function ProductScreen({ match }) {

    let {id} = useParams()
    const navigate = useNavigate()
    const[qty,setQty] = useState(1)
    const[rating,setRating] = useState(0)
    const[comment,setComment] = useState('')

    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    const productReview = useSelector(state => state.productReview)
    const { loading:loadingProductReview,
        error:errorProductReviews,
        success:successProductReviews
     } = productReview

    useEffect(()=>{
        if(successProductReviews){
            setRating(0)
            setComment('')
            dispatch({type:PRODUCT_REVIEWS_RESET})
        }

        dispatch(listProductDetails(id))
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

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(createProductReview(
            id,{
                rating,
                comment
            }
            ))
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {loading ?
                <Loader />
                : error
                ? <Message variant='danger'>{error}</Message>
                :(
                    <div>
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
                        <Row>
                            <Col md={6}>
                                <h4>Review</h4>
                                {product.reviews?.length === 0 && <Message variant='info'>No Reviews</Message>}

                                <ListGroup variant='flush'>
                                    {product.reviews?.map((review) => (
                                        <ListGroup.Item key = {review._id}>
                                            <strong>{review.name}</strong>
                                            <Rating value={review.rating} color='#f5c842'>{review.name}</Rating>
                                            <p>{review.createAt.substring(0,10)}</p>
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item>
                                        <h4>WRITE REVIEW</h4>
                                        {loadingProductReview && <Loader/>}
                                        {successProductReviews && <Message variant='success'>Review Submitted</Message>}
                                        {errorProductReviews && <Message variant='danger'>{errorProductReviews}</Message>}
                                        {userInfo ? (
                                            <Form onSubmit={submitHandler}>
                                                <Form.Group controlId='rating'>
                                                    <Form.Label>Rating</Form.Label>
                                                    <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                                                        <option value=''>Select...</option>
                                                        <option value='1'> 1 - Bad </option>
                                                        <option value='2'> 2 - Not Good </option>
                                                        <option value='3'> 3 - Normal </option>
                                                        <option value='4'> 4 - Good </option>
                                                        <option value='5'> 5 - Very Nice </option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId='comment'>
                                                    <Form.Label>Review</Form.Label>
                                                    <Form.Control as='textarea' row='5' value={comment} onChange={(e) => setComment(e.target.value)}>

                                                    </Form.Control>
                                                </Form.Group>
                                                <Button disabled={loadingProductReview} type='submit' variant='primary'>
                                                    Submit
                                                </Button>
                                            </Form>
                                        ): (
                                            <Message variant='info'>Please <Link to='/login'>Login</Link> to write review.</Message>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </div>
                )
            }
            
        </div>
    )
}

export default ProductScreen
