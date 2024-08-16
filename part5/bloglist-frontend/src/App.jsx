import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotifcation'
import SuccessNotification from './components/SuccessNotification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'


const App = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Error logging in:', exception.message)
      setErrorMessage('Username or password is incorrect')
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (newBlog, user) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog('')
      setSuccessMessage(`A new blog '${newBlog.title}' by author ${newBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 4000)
    } catch (error) {
      console.log('Error creating blog:', error.message)
      setErrorMessage('Failed to create blog', error.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
}  

  const updateBlog = async (blog, user) => {
    console.log('Updating blog:', blog)
  
    try {
      const returnedBlog = await blogService.update(blog.id, blog)
      setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
      setSuccessMessage(`Likes of Blog '${returnedBlog.title}' by author ${returnedBlog.author} updated`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 4000)
    } catch (error) {
      console.log('Error updating blog:', error.message)
      setErrorMessage('Failed to update blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id!== id))
      setSuccessMessage(`Blog deleted`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 4000)
    } catch (error) {
      console.log('Error deleting blog:', error.message)
      setErrorMessage('Failed to delete blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
  }


  const loginForm = () => (      
    <>
      <h2>log in to application</h2>
      <ErrorNotification message={errorMessage} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
  loginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }

  const loggedInView = () => (
    <div>
      <h2>blogs</h2>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      <p>{user.name} logged in
      <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='add new blog'>
        <BlogForm createBlog={addBlog} user={user}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>
      )}
       
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && loggedInView()}
    </div>
  )
   
}

export default App