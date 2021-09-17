import React, { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { io, Socket } from "socket.io-client";

interface IMessage {
  data: String;
}

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Array<IMessage>>([]);

  const socket: Socket = io("http://localhost:8000");
  const socket_admin: Socket = io("http://localhost:8000/admin");

  const send = () => {
    socket.emit("messageToServer", { data: message });
  };

  useEffect(() => {
    socket.on("messageFromServer", (data: IMessage) => {
      setChat([...chat, data]);
      console.log(data);
    });

    socket.on("joined", (data: IMessage) => {
      console.log(data);
    });

    socket_admin.on("welcome", (data: IMessage) => {
      console.log(data);
    });
  }, []);

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  return (
    <div className="App">
      <h1>welcome to chat</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
        />
        <Button onClick={send} variant="contained">
          send
        </Button>
      </div>

      <Demo>
        <List dense={false}>
          {chat.map((msg, index) => {
            return (
              <ListItem
                style={{
                  backgroundColor: index % 2 === 0 ? "lightgray" : "white",
                  borderRadius: "10px",
                }}
              >
                <ListItemText>{msg.data}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Demo>
    </div>
  );
}

export default Chat;
