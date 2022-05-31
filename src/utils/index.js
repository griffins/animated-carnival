/**
 * Returns tokens with meta-data for rendering. Tokens are of two types.
 *      1. Decoration: for punctuations and other non-tokenize-able text.
 *      2. Token: for tokens that are clickable.
 * Basically it creates extra tokens from the non-tokenize-able characters for when we are rendering we can get an
 * exact match for content
 */
export function tokenize(content, tokens) {
    //for tracking characters left between tokens
    let position = 0;
    const spans = [];
    for (let i in tokens) {
        const token = tokens[i];
        const [start, end] = token.position

        // If we have non-tokenize-able characters between current char position and current token add them now.
        if (start > position) {
            spans.push({type: "decoration", value: content.slice(position, start)})
        }

        // Add current token to list
        spans.push({type: "token", value: content.slice(start, end), index: i})

        //move our current position end of current token
        position = end
    }

    // If we still have non-tokenize-able characters after the last token add them now.
    if (position < content.length) {
        spans.push({type: "decoration", value: content.slice(position, content.length)})
    }
    return spans
}

/**
 * Returns a promise that consumes data from the books GraphQL endpoint
 * @returns {Promise<any>}
 */
export function fetchBook() {
    const END_POINT = 'https://fullstack-engineer-test-n4ouilzfna-uc.a.run.app/graphql';
    const query = `
        query BookQuery {
          book {
            author,
            title,
            pages {
                content,
                pageIndex,
                tokens {
                    position,
                    value
               }
            }
          }
        }`;
    return fetch(END_POINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({query})
    }).then(r => r.json()).then(r => r.data.book);
}