import React, { useEffect, useState } from "react";
import "./App.css";
import { io, Socket } from "socket.io-client";

import Sidebar from "./components/Sidebar";

interface INamespace {
  img: string;
  endpoint: string;
}

export default function App() {
  const [username, setUserName] = useState<String | null>("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Array<String>>([]);
  const [namespaces, setNamesapces] = useState<INamespace[]>([]);

  const socket_main: Socket = io("http://localhost:8000");
  const socket_wiki: Socket = io("http://localhost:8000/wiki");
  const socket_mozilla: Socket = io("http://localhost:8000/mozilla");
  const socket_linux: Socket = io("http://localhost:8000/linux");

  useEffect(() => {
    // let user = prompt("Enter the username: ");
    // setUserName(user);

    socket_main.on("nsList", (nsData) => {
      setNamesapces(nsData);
    });
  }, []);

  const send = () => {
    setChat([...chat, message]);
    console.log("send");
  };

  return (
    <div className="main">
      <Sidebar namespaceList={namespaces} />
      <div className="rooms">
        <h2>Rooms</h2>
        <div>
          <ul>
            <li>#room1</li>
            <li>#room2</li>
            <li>#room3</li>
            <li>#room4</li>
          </ul>
        </div>
      </div>
      <div className="chat">
        <div className="chats">
          {chat.map((msg, index) => {
            return (
              <li key={index}>
                {username}: {msg}
              </li>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            style={{ width: "80%", height: "40px" }}
          />
          <button onClick={send} style={{ width: "18%" }}>
            send
          </button>
        </div>
      </div>
    </div>
  );
}
