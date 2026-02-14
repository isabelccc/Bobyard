// TODO: Import React
import React from "react"
import CommentList from "./components/CommentList"
import CommentForm from "./components/CommentForm";
import "./App.css"

// TODO: Import CommentList component from './components/CommentList'

// TODO: Import App.css for styling (optional, create if you want)

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

// TODO: Export App as default export
export default App;
