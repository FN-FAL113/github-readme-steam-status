const { StatusCodes } = require('http-status-codes')

/**
 * 
 * @param {Object} err error object
 * @param {Express.Request} req express request object
 * @param {Express.Response} res express response object
 * @param {Express.NextFunction} next express middleware function
 */
const errorHandler = async (err, req, res, next) => {
    let customError = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: 'Something went wrong, could be error on data retrieve...',
    }

    if(err?.message) {
        customError = {
            statusCode: err.statusCode,
            msg: err.message,
        }
    } else if(err?.response){
        customError = {
            statusCode: err.response.status,
            msg: err.response.statusText,
        }
    } else if (err?.request){
        customError = {
            statusCode: StatusCodes.CONTINUE,
            msg: 'Request was sent but received no response',
        }
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="560" height="200"> 
            <g>
                <rect x="0" y="0" width="500" height="200" fill="#1b2838" /> 
                <text x="10" y="24" font-size="18" fill="white">Error ${customError.statusCode}:</text>
                <text x="10" y="39" font-size="17" fill="red">${customError.msg}</text>
                <text x="10" y="55" font-size="16" fill="yellow">Please verify your steam id or report to github issue tracker</text>
            </g>  

            <style type="text/css">
                text { font-family: Arial, Helvetica, Verdana, sans-serif; }
            </style>
        </svg>
    `

    res.set('Content-Type', 'image/svg+xml')
    return res.status(customError.statusCode).send(svg)
}

module.exports = errorHandler