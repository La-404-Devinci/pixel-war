import Token from "../models/Token";

/**
 * Generate a JWT token
 *
 * @param data The data to be encoded in the token
 * @param exp The expiration time of the token in seconds
 * @returns The generated JWT token
 */
const generateJwtToken = (data: Token, exp: number): string => {
    // TODO: Implement this function
};

/**
 * Check if a JWT token is valid
 *
 * @param token The token to be verified
 * @param targetEmail The email to be verified
 * @returns The decoded token
 */
const verifyJwtToken = (token: string, targetEmail): Token => {
    // TODO: Implement this function
};

/**
 * Generate an authorization token (valid for 15 minutes)
 *
 * @param devinciEmail The email of the user
 * @returns The generated authorization token
 */
const generateAuthorizationToken = (devinciEmail: string): string => {
    const authorizationExpiration = 60 * 15; // 15 minutes
    return generateJwtToken({ devinciEmail, type: "authorization" }, authorizationExpiration);
};

/**
 * Generate an authentication token (valid for 14 days)
 *
 * @param devinciEmail The email of the user
 * @returns The generated authentication token
 */
const generateAuthenticationToken = (devinciEmail: string): string => {
    const authenticationExpiration = 60 * 60 * 24 * 14; // 14 days
    return generateJwtToken({ devinciEmail, type: "authentication" }, authenticationExpiration);
};

/**
 * Check if a JWT token is valid
 *
 * @param token The token to be verified
 * @param targetEmail The email to be verified
 * @returns Whether the token is valid
 */
const verifyAuthorizationToken = (token: string, targetEmail: string): boolean => {
    const decodedToken = verifyJwtToken(token, targetEmail);
    return decodedToken.type === "authorization";
};

/**
 * Check if a JWT token is valid
 *
 * @param token The token to be verified
 * @param targetEmail The email to be verified
 * @returns Whether the token is valid
 */
const verifyAuthenticationToken = (token: string, targetEmail: string): boolean => {
    const decodedToken = verifyJwtToken(token, targetEmail);
    return decodedToken.type === "authentication";
};

export { generateAuthorizationToken, generateAuthenticationToken, verifyAuthorizationToken, verifyAuthenticationToken };
