// src/utils/error.js (or your correct path)

export const errorHandler = (statusCode, message) => {
    // Log when this utility is called to create an error object
    console.log(`[Util] errorHandler: Creating error object - Status: ${statusCode}, Message: "${message}"`);

    const error = new Error(); // Creates a new standard Error object
    error.statusCode = statusCode; // Custom property for HTTP status
    error.message = message;       // Overwrites the default Error.message

    // The stack trace will be automatically generated when 'new Error()' is called.
    // You can log it here if you want to see where errorHandler was invoked from immediately.
    // console.log(`[Util] errorHandler: Error object created. Stack trace at point of creation:\n${error.stack}`);

    return error; // Return the custom error object
};