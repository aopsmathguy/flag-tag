import React, { useEffect, useState } from 'react';
import { c } from './common/constants.js';
import { inputs } from './sharedVars.js';
const Settings = ({defaultKeyBinds}) => {
    

    const [keyBinds, setKeyBinds] = useState(defaultKeyBinds);
    const [currentSetting, setCurrentSetting] = useState(null);
    useEffect(()=>{
        inputs.updateKeyToFunction(keyBinds);
    }, []);
    const handleKeyDown = e => {
        if (currentSetting) {
            keyBinds[currentSetting] = e.key;
            setCurrentSetting(null);
            // inputs.updateKeyToFunction(keyBinds);
            console.log("updated keybinds");
        }
    };
    

    return (
        <div className="Settings" onKeyDown={handleKeyDown} tabIndex="0">
            {Object.entries(keyBinds).map(([bind, key]) => (
                <div key={bind} className="keybind-row">
                    <div className="keybind-name">{bind}</div>
                    <button
                        className="keybind-button"
                        onClick={() => {
                            if (currentSetting == bind){
                                setCurrentSetting(null);
                            } else{
                                setCurrentSetting(bind);
                            }
                        }}
                    >
                        {bind == currentSetting ? <i>press a key</i> :key}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Settings;