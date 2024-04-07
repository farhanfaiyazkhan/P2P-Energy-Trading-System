import React from "react";

const Home = () => {
  return (
    <div style={{ margin: '100px', padding: '20px' }}>
        <p style={{ textAlign: 'justify' }}>
          A (P2P) energy trading platform designed for facilitating the exchange of self-generated energy among users. The platform employs cutting-edge technologies for real-time data acquisition, monitoring, and control of energy production remotely. Trading activities are seamlessly conducted through a user-friendly web interface, leveraging the security and transparency provided by a private Ethereum blockchain and smart contracts. Energy monitoring and control functionalities are achieved through an Internet of Things (IoT) framework, utilizing ESP32 microcontrollers and field instrumentation devices interfaced with the energy source and load. The hardware setup includes essential components such as relays, current sensors, Wi-Fi routers, and ESP32 microcontrollers. Data transmission is facilitated using the MQTT protocol over a local network, with ESP32 serving as an MQTT client and a Node-Red IoT server acting as an MQTT broker. Integration with a web interface, developed using the React.JS library, is established through HTTP requests, allowing users to interact seamlessly with the platform.
        </p>
    </div>
  );
};

export default Home;
