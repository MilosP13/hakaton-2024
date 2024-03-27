import React, { useEffect, useState } from 'react';
import RealEstateABI from '../../contracts/RealEstate.json';
import RealEstateFactoryABI from '../../contracts/RealEstateFactory.json';
import "./OneEstateModal.css";

const OneEstateModal = ({ web3, account, factoryAddress, oneEstate, onClose }) => {

  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://essentialhome.eu/inspirations/wp-content/uploads/2019/01/rimage-7-19.jpg',
    'https://cloudfront-us-east-1.images.arcpublishing.com/avalonbay/FEA6JVUH65HWXLYD7NCELWMO6Q.jpg',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/354187031.jpg?k=81f20f4f9cc0fa4729dcff5409d1d51d85165450019f160d5c74f63e82281650&o=&hp=1',
    'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ixPdSl7.SV8A/v1/-1x-1.jpg'
  ];

  const handlePrevClick = () => {
    setCurrentImage((prevImage) => (prevImage === 0 ? images.length - 1 : prevImage - 1));
  };

  const handleNextClick = () => {
    setCurrentImage((prevImage) => (prevImage === images.length - 1 ? 0 : prevImage + 1));
  };



  const [estateInfo, setEstateInfo] = useState({
    locationName: "",
    price: 0,
    lat: 0,
    lon: 0,
    registered: false,
    mortgageFree: false,
    sqft: 0,
    floor: "",
    heatingType: "",
    numberOfRooms: 0,
    owner: ""
  });

  useEffect(() => {
    const getEstateInfo = async () => {
      try {
        const estateContract = new web3.eth.Contract(RealEstateABI.abi, oneEstate);
        const locationName = await estateContract.methods.getLocationName().call();
        const price = parseInt(await estateContract.methods.getPrice().call()); 
        const lat = parseInt(await estateContract.methods.getLat().call()); 
        const lon = parseInt(await estateContract.methods.getLon().call()); 
        const registered = await estateContract.methods.isRegistered().call();
        const mortgageFree = await estateContract.methods.isMortgageFree().call();
        const sqft = parseInt(await estateContract.methods.getSqft().call()); 
        const floor = await estateContract.methods.getFloor().call();
        const heatingType = await estateContract.methods.getHeatingType().call();
        const numberOfRooms = parseInt(await estateContract.methods.getNumberOfRooms().call());
        const owner = await estateContract.methods.getBeneficiary().call();

        setEstateInfo({
          locationName,
          price,
          lat,
          lon,
          registered,
          mortgageFree,
          sqft,
          floor,
          heatingType,
          numberOfRooms,
          owner
        });
      } catch (error) {
        console.error('Error getting real estate info:', error);
      }
    };

    getEstateInfo();
  }, [oneEstate, web3.eth.Contract]);

  /// BUY
  const handleBuyClick = async () => {
    try {
      const contractInstance = new web3.eth.Contract(RealEstateABI.abi, oneEstate);
      const priceWei = web3.utils.toWei(estateInfo.price.toString(), 'ether'); 
    
      const transactionParameters = {
        to: oneEstate, 
        from: account, 
        value: web3.utils.toHex(estateInfo.price), 
        data: contractInstance.methods.buyRealEstate().encodeABI(), 
        gas: web3.utils.toHex(5000000), 
      };
    
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    
      console.log("Transaction Hash:", txHash);
      console.log("Buy request successfully sent.");
    } catch (error) {
      console.error("Error buying real estate: ", error);
    }
  };


  const handleShowOwner = () => {
   window.alert('Owner is: '+ estateInfo.owner);
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{estateInfo.locationName}, Belgrade</h2>

          {/* Placeholder for pictures */}
          <div className="picture-container">
          <button className="prev-btn" onClick={handlePrevClick}>{'<'}</button>
          <div className="slider" style={{ transform: `translateX(-${currentImage * 100}%)` }}>
            {images.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Real Estate ${index + 1}`} />
            ))}
          </div>
          <button className="next-btn" onClick={handleNextClick}>{'>'}</button>
        </div>

        <div className="info">
        <p className="info-paragraph">Sqft: {estateInfo.sqft}m2</p>
        <p className="info-paragraph">Floor: {estateInfo.floor}</p>
        <p className="info-paragraph">Heating Type: {estateInfo.heatingType}</p>
        <p className="info-paragraph">Number of Rooms: {estateInfo.numberOfRooms}</p>
        <p className="info-paragraph">Registered: {estateInfo.registered ? "Yes" : "No"}</p>
        <p className="info-paragraph">Mortgage: {estateInfo.mortgageFree ? "Yes" : "No"}</p>
        </div>

        <p className='price-paragraph'>Price: {estateInfo.price}17.000€</p>

        <div className="estate-button-container">
        <button className="estate-button-buy" onClick={handleBuyClick}>Buy</button>
        <button className="estate-button-show" onClick={handleShowOwner}>Show Owner</button>
        <button className="estate-button-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default OneEstateModal;
