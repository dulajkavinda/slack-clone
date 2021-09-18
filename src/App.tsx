import React, { useEffect, useState } from "react";
import "./App.css";
import { io, Socket } from "socket.io-client";

interface INamespace {
  img: string;
  endpoint: string;
}

interface IRoom {
  roomId: number;
  endpoint: string;
  roomTitle: string;
  privateRoom: string;
  history: Array<String>;
}

export default function App() {
  const [username, setUserName] = useState<String | null>("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Array<String>>([]);
  const [namespaces, setNamesapces] = useState<INamespace[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [currentNamespace, setCurrentNamespace] = useState<String>("/wiki");
  const [noOfUsers, setNoOfUsers] = useState<Number>(0);
  const [currentRoom, setCurrentRoom] = useState<String>("");

  const socket_main: Socket = io("http://localhost:8000");
  const socket_namespaces = io(`http://localhost:8000${currentNamespace}`);

  useEffect(() => {
    // let user = prompt("Enter the username: ");
    // setUserName(user);

    socket_main.on("nsList", (nsData) => {
      setNamesapces(nsData);
    });

    joinNs();

    socket_namespaces.on("messageToClient", (msg) => {
      setChat((prevState) => [...prevState, msg]);
    });
  }, [currentNamespace]);

  const joinRoom = (room: string) => {
    socket_namespaces.emit("joinRoom", room, (newNoOfMembers: number) => {});
    socket_namespaces.on("history", (history) => {
      setChat(history);
    });
    socket_namespaces.on("updateMembers", (newNoOfMembers) => {
      setNoOfUsers(newNoOfMembers);
    });
  };

  const joinNs = () => {
    socket_namespaces.on("nsRoomLoad", (nsRooms) => {
      setRooms(nsRooms);
      joinRoom(nsRooms[0].roomTitle);
      setCurrentRoom(nsRooms[0].roomTitle);
    });
  };

  const send = () => {
    const msg = {
      message: message,
      roomName: currentRoom,
    };
    socket_namespaces.emit("newMessageToServer", msg);
  };

  return (
    <div className="main">
      <div className="namespaces">
        {namespaces.map((namespace) => {
          return (
            <div
              className="namesapce"
              onClick={() => setCurrentNamespace(namespace.endpoint)}
            >
              <img src={namespace.img} width="95%" height="95%" />
            </div>
          );
        })}
      </div>
      <div className="rooms">
        <h2>Rooms</h2>
        <div>
          <ul>
            {rooms.map((room) => {
              return (
                <li
                  onClick={() => {
                    joinRoom(room.roomTitle);
                    setCurrentRoom(room.roomTitle);
                  }}
                  key={room.roomId}
                >
                  {room.roomTitle}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="chat">
        <div className="chats">
          <h3 style={{ marginLeft: "10px" }}>Current Room ({noOfUsers})</h3>
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
