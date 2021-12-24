import React, {useState, useEffect} from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_PROFILE_UPDATE_RESET } from '../constants/userConstants'
import { OrderList } from '../actions/orderActions'


function ProfileScreen({history}) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    history = useNavigate()

    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user} = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin  
    
    const userProfileUpdate = useSelector(state => state.userProfileUpdate)
    const { success } = userProfileUpdate

    const orderList = useSelector(state => state.orderList)
    const { loading: loadingOrders, error:errorOrders, orders } = orderList

    useEffect(() => {
        if(!userInfo){
            history('/login')
        }else{
            if(!user || !user.name || success){
                dispatch({type:USER_PROFILE_UPDATE_RESET})
                dispatch(getUserDetails('profile'))
                dispatch(OrderList())
            }else{
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, history, userInfo, user, success])
    const submitHandler = (e) => {  
        e.preventDefault()
        if(password != confirmPassword){
            setMessage('Passwords do not match!')
        }else{
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password,
        }))
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader/>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name Adress</Form.Label>Name
                        <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email Adress</Form.Label>
                        <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group> 
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='passwordConfirm'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Order</h2>
                {loadingOrders ? (
                    <Loader/>
                ): errorOrders ? (
                    <Message variant='danger'>{errorOrders}</Message>
                ):(
                    <Table striped responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                            </tr>
                        </thead>
                        <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.CreateAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>{order.isPaid ? order.paidAt:(
                                            <i className='fas fa-times' style={{color:'red'}}></i>
                                        )}</td>
                                        <td>
                                            <LinkContainer to={`/orders/${order._id}`}>
                                                <Button className='btn-sm'>Detail</Button>
                                            </LinkContainer>
                                        </td>
                                        
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfileScreen
