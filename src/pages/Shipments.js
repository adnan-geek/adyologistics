import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit } from 'react-icons/fa'; // FontAwesome icons for View and Edit
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Shipments = () => {
  const [shipmentsData, setShipmentsData] = useState([]);
  const [operationMode, setOperationMode] = useState('add'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newShipment, setNewShipment] = useState({
    sender: '',
    receiver: '',
    status: '',
    shippingDate: '',
    expectedDelivery: '',
    location: '',
    trackingNumber: '',
    weight: '',
    dimensions: '',
    shippingCost: '',
    paymentStatus: '',
    deliveryType: '',
    contact: '',
    deliveryAttempts: '',
  });


   /********************************************************* */

   const fetchData = async () => {
    try {
      const response = await fetch('http://localhost/adyologistics/src/backend/scripts/shipments.php');
      const data = await response.json();
      setShipmentsData(data);
    } catch (error) {
      console.error('Error fetching shipments data:', error);
    }
  };
   /*********************************************************** */
  useEffect(() => {
   
    fetchData();
    
  }, []);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShipments = shipmentsData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleForm = () => setIsFormVisible(!isFormVisible);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShipment((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/adyologistics/src/backend/scripts/shipments.php', newShipment, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setNewShipment({
          sender: '',
          receiver: '',
          status: '',
          shippingDate: '',
          expectedDelivery: '',
          location: '',
          weight: '',
          dimensions: '',
          shippingCost: '',
          paymentStatus: '',
          deliveryType: '',
          contact: '',
          deliveryAttempts: '',
        });
        // setShipmentsData([...shipmentsData, newShipment]); // Add new shipment to local state
        fetchData();
        setIsFormVisible(false); // Hide the form after submission
      } else {
        console.log('Failed to add shipment:', response.data);
      }
    } catch (error) {
      console.error('Error occurred while adding shipment:', error);
    }
  };

  const handleViewClick = (shipment) => {
    setSelectedShipment(shipment);
    setIsSideMenuOpen(true);
  };

  const handleEditClick = (shipment) => {
    setNewShipment(shipment);
    setIsFormVisible(true);
    setOperationMode("edit");
    console.log(operationMode);
    
  };
  useEffect(() => {
    console.log('Operation mode:', operationMode);
}, [operationMode]); 

  const closeSideMenu = () => setIsSideMenuOpen(false);

  // Coordinates for Al Hoceima, Tangier, and Madrid
  const alHoceima = { lat: 35.25, lng: -5.25 }; // Example coordinates in Latitude and Longitude
  const tangier = { lat: 35.7741, lng: -5.8015 };
  const madrid = { lat: 40.4168, lng: -3.7038 };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shipments Dashboard</h1>
        <button
          onClick={toggleForm}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-indigo-300"
        >
          + Add Shipment
        </button>
      </div>

      {/* Form */}
      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add/Edit Shipment</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="sender"
                value={newShipment.sender}
                onChange={handleChange}
                placeholder="Sender"
                className="p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="receiver"
                value={newShipment.receiver}
                onChange={handleChange}
                placeholder="Receiver"
                className="p-3 border rounded-lg"
                required
              />
              <select
                name="status"
                value={newShipment.status}
                onChange={handleChange}
                className="p-3 border rounded-lg"
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
              <input
                type="date"
                name="shippingDate"
                value={newShipment.shippingDate}
                onChange={handleChange}
                className="p-3 border rounded-lg"
                required
              />
              <input
                type="date"
                name="expectedDelivery" 
                value={newShipment.expectedDelivery}
                onChange={handleChange}
                className="p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="location"
                value={newShipment.location}
                onChange={handleChange}
                placeholder="Location"
                className="p-3 border rounded-lg"
                required
              />
            
              <input
                type="number"
                name="weight"
                value={newShipment.weight}
                onChange={handleChange}
                placeholder="Weight (kg)"
                className="p-3 border rounded-lg"
                required
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden bg-white shadow-lg rounded-xl mb-8">
        <table className="table-auto w-full text-sm text-left text-gray-600">
          <thead className="bg-indigo-50">
            <tr className="text-gray-700">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Sender</th>
              <th className="px-6 py-4">Receiver</th>
              <th className="px-6 py-4">tracking Number</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Shipping Date</th>
              <th className="px-6 py-4">Expected Delivery</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentShipments.map((shipment) => (
              <tr
                key={shipment.id}
                className="border-b hover:bg-indigo-100 transition duration-300"
              >
                <td className="px-6 py-4">{shipment.id}</td>
                <td className="px-6 py-4">{shipment.sender}</td>
                <td className="px-6 py-4">{shipment.trackingNumber}</td>
                <td className="px-6 py-4">{shipment.receiver}</td>
                <td className="px-6 py-4">{shipment.status}</td>
                <td className="px-6 py-4">{shipment.shippingDate}</td>
                <td className="px-6 py-4">{shipment.expectedDelivery}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => handleViewClick(shipment)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye size={18} />
                  </button>
                  <button
                    onClick={() => handleEditClick(shipment)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <FaEdit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
        >
          Prev
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(shipmentsData.length / itemsPerPage)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-2"
        >
          Next
        </button>
      </div>

      {/* Side Menu with Map and Shipment Details */}
      {isSideMenuOpen && (
        <div className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg overflow-auto z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Shipment Details</h2>
            <button
              onClick={closeSideMenu}
              className="text-red-600 hover:text-red-800"
            >
              Close
            </button>
          </div>

          <div className="p-4">
            {selectedShipment ? (
              <div>
                <p><strong>Sender:</strong> {selectedShipment.sender}</p>
                <p><strong>Receiver:</strong> {selectedShipment.receiver}</p>
                <p><strong>Status:</strong> {selectedShipment.status}</p>
                <p><strong>Shipping Date:</strong> {selectedShipment.shippingDate}</p>
                <p><strong>Expected Delivery:</strong> {selectedShipment.expectedDelivery}</p>
                <p><strong>Location:</strong> {selectedShipment.location}</p>
                <p><strong>Tracking Number:</strong> {selectedShipment.trackingNumber}</p>
              </div>
            ) : (
              <p>No shipment selected</p>
            )}
          </div>

          {/* Map */}
          <div className="w-full h-64 relative">
            <MapContainer center={alHoceima} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Markers */}
              <Marker position={alHoceima}>
                <Popup>Al Hoceima</Popup>
              </Marker>
              <Marker position={tangier}>
                <Popup>Tangier</Popup>
              </Marker>
              <Marker position={madrid}>
                <Popup>Madrid</Popup>
              </Marker>
              {/* Polyline between locations */}
              <Polyline positions={[alHoceima, tangier, madrid]} color="blue" />
            </MapContainer>
          </div>
      
        </div>
      )}
    </div>
  );
};

export default Shipments;
