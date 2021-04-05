import React from 'react';
import '../assets/css/comment.css';

const Comments = ({ comments }) => {
        console.log(comments)
        return (
            <div>
                <hr />
                <div className="comment-list">
                    {comments.length ? (
                        comments.map((comment) => (
                         <div className="comment-block">
                            <h3>Ecrit par : {comment.author}</h3>
                                 <h4> le {comment.created_at}</h4>
                                 <p>{comment.message}</p>
                         </div>
                                                 ))
                    ) : (
                        <h5 className="no-comments-alert">
                            No comments on this post yet. Be the first!
                        </h5>
                    )}
                </div>
            </div>
        );
};

export default Comments;