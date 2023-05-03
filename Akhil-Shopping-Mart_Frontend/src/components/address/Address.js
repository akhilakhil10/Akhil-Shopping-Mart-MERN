import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Address = () => {
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const fetchAddresses = async () => {
            const { data } = await axios.get('/api/v1/me/address');
            setAddresses(data.address);
        };
        fetchAddresses();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`/api/v1/me/address/${id}`);
        setAddresses(addresses.filter((address) => address._id !== id));
    };
    // const id=addresses.address._id
    return (
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
                                <Link to={`/updateAddress/${address._id}`}>
                                    <button>Edit</button>
                                </Link>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(address._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Address;
