export const decodeError = async (error
) => {

    if(error.response){
        const {status} = error.response;
        let errorMessage = 'An Error occured';

    switch (status) {
        case 400:
            errorMessage = "Bad request. Please check the input data.";
            break;
        case 401:
            errorMessage = "Unauthorized. Invalid username or password.";
            break;
        case 403:
            errorMessage = "Forbidden. You don't have permission to access this resource.";
            break;
        case 404:
            errorMessage = "Not found. The endpoint or resource is not available.";
            break;
        case 500:
            errorMessage = "Internal server error. Please try again later.";
            break;
        default:
            errorMessage = `Unexpected error: ${status}`;
    }
    return errorMessage;
    }
}