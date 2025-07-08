import * as StatusCodes from "./http-status-codes";
/**
 * Default error message
 */
export const DEFAULT_ERROR_MESSAGE = "an error occurred";

/**
 * List of error codes that are considered “normal” and will not trigger a log
 */
export const NORMAL_ERROR_CODES = [
	StatusCodes.BAD_REQUEST,
	StatusCodes.UNAUTHORIZED,
	StatusCodes.FORBIDDEN,
	StatusCodes.NOT_FOUND,
	StatusCodes.CONFLICT,
	StatusCodes.UNPROCESSABLE_CONTENT,
];
