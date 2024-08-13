import React from 'react'

const SuccessNotification = ({ message }) => {

    if (!message) {
        console.log('message is null')
        return null
    }
    return (
        <div className="success">
            {message}
        </div>
    )
}

export default SuccessNotification