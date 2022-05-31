import {useEffect, useState} from "react";
import {AppBar, Book} from './components'
import {fetchBook} from "./utils";


function App() {
    const [book, setBook] = useState(null)
    useEffect(() => {
        fetchBook().then(book => setBook(book));
    }, [])
    return (
        <>
            {
                book &&
                <div className="container">
                    <AppBar {...book}/>
                    <Book {...book}/>
                </div>
            }
        </>
    )
}

export default App;
