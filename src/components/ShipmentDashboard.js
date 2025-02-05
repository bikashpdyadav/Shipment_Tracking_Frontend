import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShipmentForm from './ShipmentForm';
import ShipmentMap from './ShipmentMap';

const ShipmentDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [route, setRoute] = useState([]);
  const [location, setLocation] = useState(null);
  const [editLocationDialogOpen, setEditLocationDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/shipments')
      .then((response) => {
        setShipments(response.data.shipments);
      })
      .catch((error) => {
        console.error('Error fetching shipments:', error);
      });
  }, []);

  const handleOpen = (shipment = null) => {
    setCurrentShipment(shipment);
    setOpen(true);
  };

  const handleClose = () => {
    setCurrentShipment(null);
    setOpen(false);
  };

  const handleTrack = (id) => {
    axios
      .get(`http://localhost:3001/shipment/${id}`)
      .then((response) => {
        console.log(response);
        const shipment = response.data.shipment;
        console.log(shipment);
        if (shipment.route && shipment.route.length >= 2) {
          setRoute([shipment.route[0], shipment.route[shipment.route.length - 1]]);
          setLocation(shipment.currentLocation);
        } else {
          console.error('Route data is incomplete or missing.');
        }
      })
      .catch((error) => {
        console.error('Error fetching shipment:', error);
      });

    setMapOpen(true);
  };

  const handleCloseMap = () => {
    setMapOpen(false);
    setCurrentShipment(null);
  };

  const handleEditLocation = (shipment) => {
    setNewLocation(shipment.currentLocation);
    setCurrentShipment(shipment);
    setEditLocationDialogOpen(true);
  };

  const handleLocationSubmit = () => {
    if (!newLocation) return;

    axios
      .post(`http://localhost:3001/shipment/${currentShipment._id}/update-location`, {
        currentLocation: newLocation,
      })
      .then((response) => {
        setShipments((prevShipments) =>
          prevShipments.map((shipment) =>
            shipment._id === currentShipment._id ? { ...shipment, currentLocation: newLocation } : shipment
          )
        );
        setEditLocationDialogOpen(false);
        alert('Shipment location updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating shipment location:', error);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-center text-4xl p-8">Shipment Tracker</h1>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="shipment table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Container ID</TableCell>
              <TableCell>Current Location</TableCell>
              <TableCell>ETA</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Track</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment._id}>
                <TableCell>{shipment.shipmentId}</TableCell>
                <TableCell>{shipment.containerId}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {shipment.currentLocation}
                    <IconButton onClick={() => handleEditLocation(shipment)} style={{ marginLeft: 8 }}>
                      <EditIcon />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell>{shipment.currentETA ? new Date(shipment.currentETA).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpen(shipment)}>
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleTrack(shipment._id)}>
                    Track
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ marginTop: '10px' }}>
        Add Shipment
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentShipment ? 'Edit Shipment' : 'Add New Shipment'}</DialogTitle>
        <DialogContent>
          <ShipmentForm initialData={currentShipment} onClose={handleClose} />
        </DialogContent>
      </Dialog>

      <Dialog open={mapOpen} onClose={handleCloseMap} maxWidth="md" fullWidth>
        <DialogTitle>Shipment Location</DialogTitle>
        <DialogContent>
          {mapOpen && <ShipmentMap route={route} location={location} />}
          <Button variant="contained" color="error" onClick={handleCloseMap} style={{ marginTop: '10px' }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={editLocationDialogOpen} onClose={() => setEditLocationDialogOpen(false)}>
        <DialogTitle>Edit Shipment Location</DialogTitle>
        <DialogContent>
          <TextField
            label="New Location"
            variant="outlined"
            fullWidth
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Button variant="contained" color="primary" onClick={handleLocationSubmit}>
            Update Location
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipmentDashboard;
