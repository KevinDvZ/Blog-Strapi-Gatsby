
import '../assets/css/comment.css';
import React from 'react'
const fetch = require('whatwg-fetch');

let comments = [];
const apiUrl = process.env.API_URL;


const submitForm = ((ev, strapiId) => {
 ev.preventDefault();
 fetch(`${process.env.GATSBY_API_URL}`, {
        method: 'post',
        headers: {
         Accept: 'application/json',
        },
        body: JSON.stringify({
                "query": `mutation ($input: createCommentInput!){createComment(input: $input){comment{message, author, article{id}}}}`,
                "variables": {
                        "input": {
                                "data": {
                                 "article": strapiId,
                                 "author": ev.target.author.value,
                                 "message": ev.target.message.value,


                                }
                        }
                },
        }),
}).then(() => window.location.reload())});


const Comments = ({ article }) => {

    fetch(
         apiUrl + "/comments?article=" +
        article.strapiId
    )
        .then(res => res.json())
        .then(data => {
            console.log(data)
            comments = data});

        return (
            <div>
                <hr />
                <div className="comment-list">
                    {comments.length ? (
                        comments.map((comment) => (
                         <div className="comment-block">
                            <h4 className="comment-author">Ecrit par : {comment.author}</h4>
                                 <h4 className="comment-date"> le {comment.created_at}</h4>
                                 <p className="comment-content">{comment.message}</p>
                         </div>
                                                 ))
                    ) : (
                        <h5 className="no-comments-alert">
                            No comments on this post yet. Be the first!
                        </h5>
                    )}
                </div>

                    <form className="comment-form" onSubmit={ev => submitForm(ev, article.strapiId)}>
                            <h4 className="comment-post">Laissez un commentaire</h4>
                            <input
                             type="text"
                             placeholder="Votre pseudo/nom"
                             name="author"
                            />
                            <textarea
                             type="text"
                             placeholder="Votre commentaire"
                             rows="4"
                             name="message"
                            />
                            <div>
                                    <button className="button submit-button" type="submit">Envoyer</button>
                            </div>
                    </form>

            </div>
        );
};

export default Comments;