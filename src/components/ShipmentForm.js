import React, { useState } from 'react';
import axios from 'axios';

const ShipmentForm = ({ onClose, initialData = null }) => {
    console.log(initialData)
    const [shipment, setShipment] = useState({
        shipmentId: initialData?.shipmentId || '',
        containerId: initialData?.containerId || '',
        route: initialData?.route || [],
        currentLocation: initialData?.currentLocation || '',
        currentETA: initialData?.currentETA || '',
        status: initialData?.status || 'Pending',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const method = initialData ? 'patch' : 'post';
        
        const url = initialData
            ? `http://localhost:3001/shipment/${initialData._id}`
            : 'http://localhost:3001/shipment';
        console.log(shipment)
        try {
            axios[method](url, shipment)
                .then((response) => {
                    console.log('Shipment successfully submitted:', response.data);
                    onClose();
                })
                .catch((error) => {
                    console.error('Error submitting shipment:', error);
                });
        }
        catch (err) {
            console.log(err.message);
        }

    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
                {initialData ? 'Edit Shipment' : 'Add Shipment'}
            </h2>

            <div className="mb-4">
                <label
                    htmlFor="shipmentId"
                    className="block text-sm font-medium text-gray-700"
                >
                    Shipment ID
                </label>
                <input
                    id="shipmentId"
                    name="shipmentId"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={shipment.shipmentId}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="containerId"
                    className="block text-sm font-medium text-gray-700"
                >
                    Container ID
                </label>
                <input
                    id="containerId"
                    name="containerId"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={shipment.containerId}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="route"
                    className="block text-sm font-medium text-gray-700"
                >
                    Route (comma-separated)
                </label>
                <input
                    id="route"
                    name="route"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={shipment.route.join(', ')}
                    onChange={(e) =>
                        handleChange({
                            target: { name: 'route', value: e.target.value.split(', ') },
                        })
                    }
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="currentLocation"
                    className="block text-sm font-medium text-gray-700"
                >
                    Current Location
                </label>
                <input
                    id="currentLocation"
                    name="currentLocation"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={shipment.currentLocation}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="currentETA"
                    className="block text-sm font-medium text-gray-700"
                >
                    Current ETA
                </label>
                <input
                    id="currentETA"
                    name="currentETA"
                    type="datetime-local"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={shipment.currentETA}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                >
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={shipment.status}
                    onChange={handleChange}
                >
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 mr-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 ml-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    {initialData ? 'Update Shipment' : 'Add Shipment'}
                </button>
            </div>
        </div>
    );
};

export default ShipmentForm;
