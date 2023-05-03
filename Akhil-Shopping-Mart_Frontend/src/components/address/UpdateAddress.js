import React, { Fragment, useState, useEffect } from 'react';
import { countries } from 'countries-list';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAddress } from '../../actions/userActions';
import MetaData from '../layout/MetaData';
import axios from'axios'

const UpdateAddress = ({ match, history }) => {
  const countriesList = Object.values(countries);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [country, setCountry] = useState('');
  const dispatch = useDispatch();
  const { address: userAddress } = useSelector((state) => state.user);

  const id=match.params.id
  useEffect(() => {
    const fetchAddress = async () => {
      const { data } = await axios.get(`/api/v1/me/address/${id}`);
      setAddress(data.address.address);
      setCity(data.address.city);
      setPostalCode(data.address.postalCode);
      setPhoneNo(data.address.phoneNo);
      setCountry(data.address.country);
      console.log(data)
        };
   
    fetchAddress();
  }, [id]);

  

  const submitHandler = (e) => {
    e.preventDefault();

    console.log('address',address,'city',city,'phoneno',phoneNo)
    dispatch(updateUserAddress({ id , address, city, phoneNo, postalCode, country }));
    history.push('/address');
  };



    return (
        <Fragment>
            <MetaData title={'Address Info'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Update Address</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postalCode_field">Postal Code</label>
                            <input
                                type="text"
                                id="postalCode_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNo_field">Phone Number</label>
                            <input
                                type="phone"
                                id="phoneNo_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                <option value="">Select Country</option>
                                {countriesList.map((country) => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"


                            className="btn btn-block py-3"
                        >
                            UPDATE ADDRESS
                        </button>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default UpdateAddress
