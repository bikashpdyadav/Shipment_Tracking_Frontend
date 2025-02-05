import { configureStore } from "@reduxjs/toolkit";
import shipmentReducer from './shipmentSlice';

const appStore = configureStore({
    reducer: {
        shipment: shipmentReducer,
    },
});

export default appStore;