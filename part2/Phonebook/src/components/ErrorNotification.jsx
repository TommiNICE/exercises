import React from 'react'

const ErrorNotification = ({ message }) => {

    if (!message) {
        console.log('message is null')
        return null
    }
    return (
        <div className="error-notification">
            {message}
        </div>
    )
}

export default ErrorNotification