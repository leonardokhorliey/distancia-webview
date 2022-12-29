

const Notifier = ({isError, message}) => {

    return <div id="toast" style={{backgroundColor: `${isError ? 'rgb(223, 184, 181)': 'rgb(105, 180, 174)'}`, borderColor: `${isError ? 'rgb(119, 36, 34)': 'rgb(13, 94, 13)'}`}}>
        {
            isError ? <h6>Process Failed</h6> : <h6>Processing ...</h6>
        }
        <p>{message}</p>

    </div>
}

Notifier.defaultProps = {
    isError: false,
    message: ''
}

export default Notifier;