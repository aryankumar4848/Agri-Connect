import React, { useState } from "react";
import styled from "styled-components";
import ChatBot from "react-simple-chatbot";
 const steps = [
    {
      id: "Greet",
      message: "Hello, Welcome to our portal",
      trigger: "AskName",
    },
    {
      id: "AskName",
      message: "Please enter your name!",
      trigger: "GetName",
    },
    {
      id: "GetName",
      user: true,
      trigger: "WelcomeUser",
    },
    {
      id: "WelcomeUser",
      message: "Hi {previousValue}, Please select your issue",
      trigger: "SelectIssue",
    },
    {
      id: "SelectIssue",
      options: [
        { value: "Virus", label: "Virus", trigger: "VirusOptions" },
        { value: "Worm", label: "Worm", trigger: "WormOptions" },
      ],
    },

    // Virus Branch
    {
      id: "VirusOptions",
      message: "Choose the crop",
      trigger: "SelectCrop",
    },
    {
      id: "SelectCrop",
      options: [
        { value: "Paddy", label: "Paddy", trigger: "Virus_Paddy" },
        { value: "Wheat", label: "Wheat", trigger: "Virus_Wheat" },
        { value: "Corn", label: "Corn", trigger: "Virus_Corn" },
        { value: "Cotton", label: "Cotton", trigger: "Virus_Cotton" },
      ],
    },
    {
      id: "Virus_Paddy",
      message: "Use Monocrotophos 36%",
      trigger: "Thanks",
    },
    {
      id: "Virus_Wheat",
      message:
        "Use Thiamethoxam (12.6%) + Lambdacyhalothrin (9.5%)",
      trigger: "Thanks",
    },
    {
      id: "Virus_Corn",
      message: "Use Quinalphos 25 % EC.",
      trigger: "Thanks",
    },
    {
      id: "Virus_Cotton",
      message: "Use Fipronil 5 SC.",
      trigger: "Thanks",
    },

    // Worm Branch
    {
      id: "WormOptions",
      message: "Please select the type of worm",
      trigger: "SelectWorm",
    },
    {
      id: "SelectWorm",
      options: [
        {
          value: "Yellow Mottle worm",
          label: "Yellow Mottle worm",
          trigger: "Worm_YellowMottle",
        },
        {
          value: "Wire worm",
          label: "Wire worm",
          trigger: "Worm_Wire",
        },
      ],
    },
    {
      id: "Worm_YellowMottle",
      message:
        "• Plant more resistant varieties if available.\n• Plant early to avoid peak populations.\n• Remove weeds in and around the field.\n• Use insecticides carefully to avoid harming beneficial insects.",
      trigger: "Thanks",
    },
    {
      id: "Worm_Wire",
      message:
        "Crop rotation can help reduce wireworm populations.\nUse non-host crops like onions, lettuce, alfalfa, sunflowers, and buckwheat.",
      trigger: "Thanks",
    },

    // End
    {
      id: "Thanks",
      message: "Thank you!",
      end: true,
    },
  ];

const ChatBot1 = () => {
  const [open, setOpen] = useState(false);

 
  return (
    <>
      <ChatBotWrapper>
        <div className="bot">
          <div className="chatbot_box">
            <div className="chatbot_ul">
              <h2>Welcome To ChatBot Farmer :)</h2>
              <br />
              <h2>I'm EarthWorm!</h2>
            </div>
          </div>
          <div className="chatbot_image">
            <img
              src="/earthworm.png"
              alt="earthworm"
              className="earthworm-img"
            />
          </div>
        </div>
      </ChatBotWrapper>

      {/* Chat Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "30px",
          zIndex: 999,
          padding: "15px 20px",
          borderRadius: "50%",
          backgroundColor: "#25d366",
          color: "white",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        {open ? "✖" : "💬"}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="chatbot_wrapper"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "30px",
            zIndex: 998,
            width: "320px",
            maxHeight: "500px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <ChatBot steps={steps} />
        </div>
      )}
    </>
  );
};

const ChatBotWrapper = styled.div`
  background: #fcedda;

  .bot {
    position: relative;
    top: 8vh;
    padding: 10vh 0 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
  }

  .chatbot_image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chatbot_box {
    display: inline-flex;
    text-align: center;
  }

  .earthworm-img {
    width: 50%;
    height: auto;
  }
`;

export default ChatBot1;
