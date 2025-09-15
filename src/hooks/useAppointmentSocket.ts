// src/hooks/useAppointmentSocket.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAppointmentRequest, webSocketConnected } from "@/redux/reducers/appointment/actions";

import { baseURL } from "@/utils/url";


export function useAppointmentSocket() {
  const dispatch = useDispatch();

  // websocket listener
    useEffect(() => {
      const socket = new WebSocket(baseURL.replace("http", "ws") + "/ws/appointment");
  
      socket.onopen = () => {
        // dispatch(webSocketConnected());
        dispatch(fetchAppointmentRequest());
      };
  
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("WebSocket message received:", message);
  
          if (["appointment_created", "appointment_updated"].includes(message.type)) {
            dispatch(fetchAppointmentRequest());
          }
        } catch (err) {
          console.log("Raw WebSocket message:", event.data);
        }
      };
  
      return () => socket.close();
    }, [dispatch]);
}
