import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { saveShippingInfo } from '../../actions/cartActions'



const ShippingAddress = ({ match, history }) => {
    const [addresses, setAddresses] = useState([]);

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [country, setCountry] = useState('')

    console.log(address, 'aad')

    useEffect(() => {
        const fetchAddresses = async () => {
            console.log('id')
            const { data } = await axios.get('/api/v1/me/address');
            setAddresses(data.address);
            console.log(data.address)
        };
        fetchAddresses();
    }, []);

    console.log(addresses, 'addressses')

    const dispatch = useDispatch();
    const handleSelectAddress = async (id) => {
        const { data } = await axios.get(`/api/v1/me/address/${id}`);
        setAddress(data.address.address);
        setCity(data.address.city);
        setPostalCode(data.address.postalCode);
        setPhoneNo(data.address.phoneNo);
        setCountry(data.address.country);
        console.log(data);
        console.log(data.address.address);


    };

    const checkout = () => {
        console.log('aaadddd', address, phoneNo)
        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }))
        history.push('/confirm')
    }

    return (
        <Fragment>

            <MetaData title={'Shipping Info'} />

            <CheckoutSteps shipping />
            <div className="address-table">
                <div className="add-address-button">
                    <Link to="/new-address">
                        <button>Add New Address</button>
                    </Link>
                </div>
                <table class="table table-no-more">
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Phone No</th>
                            <th>Postal Code</th>
                            <th>Country</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {addresses.map((address, index) => (
                            <tr key={address._id}>
                                <td>{index + 1}</td>
                                <td>{address.address}</td>
                                <td>{address.city}</td>
                                <td>{address.phoneNo}</td>
                                <td>{address.postalCode}</td>
                                <td>{address.country}</td>
                                <td>
                                    <button onClick={() => handleSelectAddress(address._id)}>Select</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="add-address-button">
                    <button onClick={checkout}>Check Out</button>
                </div>
            </div>


        </Fragment>
    )
}

export default ShippingAddress