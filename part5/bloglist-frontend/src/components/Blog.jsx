import React, { useState } from 'react';

const Blog = ({ blog, updateBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  }

  const handleLike = (event) => {
    event.preventDefault()
    const updatedBlog = {...blog, likes: blog.likes + 1}
    updateBlog(updatedBlog, user)
  }

  return (
    <div style={blogStyle}>
      <p>{blog.title} by {blog.author}
        <button onClick={toggleDetails}> {showDetails ? 'Hide' : 'View'}</button>
      </p>
      
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>Likes: {blog.likes} 
            <button onClick={handleLike}> Like</button>
          </p>
          <p>{user.name}</p>
        </div>
      )}
    </div>
  )
}

export default Blog