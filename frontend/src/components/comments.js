
import '../assets/css/comment.css';
import React from 'react'


const submitForm = ((ev, strapiId) => {
 ev.preventDefault();
 window.fetch(`${process.env.GATSBY_API_URL}/graphql`, {
     method: 'post',
     headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
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
 }).then(r => console.log ("REQUETE ENVOIE DU JSON >>>" + r)).then(() => window.location.reload())});

//.then(() => window.location.reload())

let  Comments = ({ comments, article }) => {


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
                            Soyez le premier à poster un commentaire !
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