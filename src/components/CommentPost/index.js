import React, { useState, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';
import { useForm } from 'react-hook-form';
import styles from './styles.module.css';
import CommentBox from '../CommentBox';
import CommentForm from './CommentForm';

function CommentPost() {
  const [commentContent, setCommentContent] = useState([]);
  const [replyToComment, setReplyToComment] = useState(null);
  const [editReply, setEditReply] = useState(null);
  const [editData, setEditData] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

    // Load data from local storage on component mount
    useEffect(() => {
      const storedData = localStorage.getItem('commentContent');
      if (storedData) {
        setCommentContent(JSON.parse(storedData));
      }
    }, []);
  
    // Save data to local storage whenever commentContent changes
    useEffect(() => {
      if(commentContent?.length > 0){
        localStorage.setItem('commentContent', JSON.stringify(commentContent));
      }
    }, [commentContent]);

  const onSubmit = (data) => {
    let content = {
      id: editData?.id || replyToComment?.id || uuidv4(),
      ...(replyToComment ? {
        ...replyToComment,
        replyData: [
          ...(replyToComment?.replyData || []),
          { id: uuidv4(), ...data }
        ]
      } : { ...editData, ...data })
    };

    if (editData) {
      if(editReply){
        setCommentContent((prevComments) =>
        prevComments.map((comment) =>
          comment.replyData && comment.replyData.length > 0
            ? {
                ...comment,
                replyData: comment.replyData.map((reply) =>
                  reply.id === editData.id ? { ...reply, ...content } : reply
                ),
              }
            : comment
        )
      );
      setEditReply(null);
      } else {
        setCommentContent((prevComments) =>
          prevComments.map((comment) =>
            comment.id === editData.id ? content : comment
          )
        );
      }

      setEditData(null);
    }
    else if(replyToComment){
      setCommentContent((prevComments) =>
        prevComments.map((comment) =>
          comment.id === replyToComment.id ? content : comment
        )
      );
    }
    else {
      setCommentContent((prevComments) => [...prevComments, content]);
    }

    setReplyToComment(null);
    setValue('name', '');
    setValue('comment', '');
  };

  const handleEdit = (comment) => {
    setValue('name', comment.name);
    setValue('comment', comment.comment);

    if (comment.commentType === 'reply') {
      setEditReply(comment);
      setEditData(comment);
    } else {
      setEditData(comment);
    }
  };

  const handleDelete = (id) => {
    setCommentContent((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === id) {
          return null;
        } else if (comment.replyData && comment.replyData.length > 0) {
          const updatedReplyData = comment.replyData.filter(
            (reply) => reply.id !== id
          );
  
          return updatedReplyData.length > 0
            ? { ...comment, replyData: updatedReplyData }
            : { ...comment, replyData: null };
        } else {
          return comment;
        }
      }).filter(Boolean)
    );
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.main_heading}>Comment Section</div>
      <div className={styles.container}>
        <CommentForm
          onSubmit={onSubmit} 
          buttonText="POST" 
          handleSubmit={handleSubmit}
          register={register}
        />
      </div>
  
      {commentContent?.map((content) => (
        <div key={content.id}>
          <CommentBox
            content={content}
            setReplyToComment={setReplyToComment}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />

          {(replyToComment?.id === content.id) && (
            <div className={styles.container} style={{ marginLeft: '100px' }}>
              <CommentForm
                onSubmit={onSubmit}
                buttonText="POST REPLY"
                handleSubmit={handleSubmit}
                register={register}
              />
            </div>
          )}

          {content.replyData?.map((reply) => (
            <div key={reply?.id}>
              {(editReply?.id === reply?.id) && (
                <div className={styles.container} style={{ marginLeft: '100px' }}>
                  <CommentForm
                    onSubmit={onSubmit}
                    buttonText="POST REPLY"
                    handleSubmit={handleSubmit}
                    register={register}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default CommentPost
