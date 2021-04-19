const responseNetwork = (responseHttp, error, statusCode,  message, data) => {
	let response = {};
	if(error) response.error = true;
	if(data) response.data = data;

	response.time_stamp = new Date().toISOString();
	response.status_code = statusCode;
	response.message = message;

	return responseHttp.status(statusCode).json(response);
}

module.exports = {
	responseNetwork,	
};