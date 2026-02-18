// TODO: Import React
import React from "react"
import CommentList from "./components/CommentList"

import "./App.css"

function App(){
    return(
        <div className="App">
            <header className="App-header">
                <h1>Comment System</h1>
            </header>
            <CommentList/>
           

        </div>
    );
}

export default App;
