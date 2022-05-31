import {useEffect, useState} from "react";
import {tokenize} from '../utils'

export function AppBar({author, title}) {
    return (<div className="app-bar">
        <h2 className="title">
            {title}
        </h2>
        <h3 className="subtitle">
            By {author}
        </h3>
    </div>)
}

export function Book({pages}) {
    const [index, setIndex] = useState(0)
    const [page1, setCurrentPage1] = useState(null)
    const [page2, setCurrentPage2] = useState(null)

    function navNextPages() {
        setIndex(index + 2)
    }

    function navPreviousPages() {
        setIndex(index - 2)
        setCurrentPage1(pages[index])
        setCurrentPage2(pages[index + 1])
    }

    /**
     * Sets the current pages from the current set of double pages.
     * Triggered during first render and when double page index changes.
     */
    useEffect(() => {
        setCurrentPage1(pages[index])
        setCurrentPage2(pages[index + 1])
    }, [index, pages])

    /**
     * Render Prev & Next buttons, first page and second of the current double pages.
     * Will show and hide Prev & Next buttons depending on current state of pages
     */
    return (
        <div className="book">
            <div className="navigation">
                {index !== 0 && <button onClick={navPreviousPages}>Prev</button>}
                {index + 1 !== pages.length - 1 && (
                    <>
                        <span></span>
                        <button onClick={navNextPages}>Next</button>
                    </>
                )}
            </div>
            <div className="content">
                {page1 && <Page {...page1} className="page"/>}
                {page2 && <Page {...page2} className="page"/>}
            </div>

            <div className="hints">
                <h4>HELP</h4>
                <p>Click on a token to get token value.</p>
                <p>Click on token to get back to page content.</p>
            </div>
        </div>
    )
}

export function Page({content, tokens, pageIndex}) {
    const State = {RENDERING_TOKENS: 0, RENDERING_TOKEN_VIEW: 1}
    const [state, setState] = useState(State.RENDERING_TOKENS)
    const [currentToken, setCurrentToken] = useState(null)

    /**
     * Shows/hides current token view.
     */
    function toggleTokenView() {
        setState(state === State.RENDERING_TOKEN_VIEW ? State.RENDERING_TOKENS : State.RENDERING_TOKEN_VIEW)
    }

    /**
     * Sets the current token and toggles token view.
     */
    function renderToken(e) {
        setCurrentToken(tokens[e])
        toggleTokenView()
    }

    /**
     * Hides token view when navigating.
     */

    useEffect(() => {
        setState(State.RENDERING_TOKENS)
        setCurrentToken(null)
    }, [content, State.RENDERING_TOKENS])

    /**
     * Call our magic function to pre-process content and tokens. It returns tokens with formatting data.
     */
    const spans = tokenize(content, tokens);

    return (
        <div className="page">
            <p>PAGE {pageIndex + 1}</p>
            <div className="tokens">
                {
                    state === State.RENDERING_TOKENS &&
                    spans.map((token, i) => {
                        return (<Token onClick={() => renderToken(token.index)} key={i} {...token}/>)
                    })
                }
                {
                    state === State.RENDERING_TOKEN_VIEW &&
                    <span className="token" onClick={() => toggleTokenView()}>{currentToken.value}</span>
                }
            </div>
        </div>
    )
}

/**
 * Renders a token with surrounding punctuation and non-tokenize-able text so that when all tokens are rendered
 * they appear like actual content.
 */
export function Token({type, value, onClick}) {
    return (
        <>
            {
                type === 'token' ? <span onClick={onClick} className="token">{value}</span> : value.toString()
            }
        </>
    )
}
