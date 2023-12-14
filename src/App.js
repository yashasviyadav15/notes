import React from "react"
import Navbar from "./components/Navbar"
import Main from "./components/Main"
import LinkForm from "./components/LinkForm"
export default function App() {
    const [darkMode, setDarkMode] = React.useState(true)
    
    function toggleDarkMode() {
        setDarkMode(prevMode => !prevMode)
    }
    
    return (
        <div className="container">
            <Navbar 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode}
            />
            <Main darkMode={darkMode} />
            <h1>Link Form</h1>
                <LinkForm />
        </div>
    )
}