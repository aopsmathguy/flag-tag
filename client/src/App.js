import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';

import { c } from './common/constants.js';
import { EVENTCODES, PacketSender, PacketHandler } from './common/packets.js';
import { Game } from './common/gamelogic/game.js';

import { ws, t, inputs, game } from './sharedVars.js';
import Settings from './Settings';
import Canvas from './Canvas';
import LoadingSpinner from './LoadingSpinner';

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showUI, setShowUI] = useState(true);
  const [connecting, setConnecting] = useState(true);

  //setup packetsender packethandler and packet listener functions
  useEffect(function(){
    console.log("mount");
    ws.addEventListener("open", (event) => {
      setConnecting(false);
    });
    ws.packetHandler.onMessage(EVENTCODES.PID, (data)=>{
      game.PID = data.PID;
    });
    ws.packetHandler.onMessage(EVENTCODES.GAME_INITIAL, (data)=>{
      game.current = Game.MessageManager.createGameInitialization(data);
    });
    ws.packetHandler.onMessage(EVENTCODES.ADD_PLAYER, (data)=>{
      Game.MessageManager.addPlayerInitialization(game.current, data);
    });
    ws.packetHandler.onMessage(EVENTCODES.REMOVE_PLAYER, (data)=>{
      Game.MessageManager.removePlayer(game.current, data);
    });
    ws.packetHandler.onMessage(EVENTCODES.UPDATE_STATES, (data)=>{
      Game.MessageManager.updatePhysics(game.current, data);
    });
    ws.packetHandler.onMessage(EVENTCODES.PONG, (data)=>{
      const ctime = data.ctime;
      const stime = data.stime;
      const now = Date.now()/1000;
      t.timeDiff = stime - (now + ctime)/2;
      t.ping = now - ctime;
      // t.ping = 0.4;
      console.log("ping: " + t.ping + ", timeDiff: " + t.timeDiff);
    });
    return ()=>{
      ws.packetHandler.removeAllMessageListeners();
    }
  }, []);
  //pingloop
  useEffect(function(){
    let timerId;

    function ping() {
      if (!connecting){
        ws.packetSender.send(EVENTCODES.PING, {
          ctime : Date.now()/1000
        });
      }
      timerId = setTimeout(ping, 1000);
    }
    ping();

    return () => {
      clearTimeout(timerId);
    }
  }, []);
  
  useEffect(function(){
    const keydown = (e)=>{
      if (e.repeat){
        return;
      }
      if (e.key == 'Escape'){
        e.preventDefault();
        setShowUI(!showUI);
      }
    };
    window.addEventListener('keydown', keydown);
    return ()=>{
      window.removeEventListener('keydown', keydown);
    }
  }, [showUI])
  const joinRoom = () => {
    if (username !== "" && room !== ""){
      setShowUI(false);
      ws.packetSender.send(EVENTCODES.JOIN, {
        username : username,
        roomcode : room
      });
    }
  };
  
  return (
    <div className="App">
      {connecting ? (
        <LoadingSpinner />
        ) : 
        <div className = "ui" style={{ display: showUI ? 'block' : 'none'}}>
          <h3>Join A Chat</h3>
          <input type="text"
            placeholder="Name"
            defaultValue={username}
            onChange={(event) => { setUsername(event.target.value); }}
          />
          <input type="text"
            placeholder="Room Code"
            defaultValue={room}
            onChange={(event) => { setRoom(event.target.value); }}
          />
          <button onClick={joinRoom}>Join</button>
          <Settings defaultKeyBinds = {{
            'UP': 'w',
            'DOWN': 's',
            'LEFT': 'a',
            'RIGHT': 'd'
          }}
          />
        </div>
      }
      <Canvas />
    </div>
  );
}
export default App;
