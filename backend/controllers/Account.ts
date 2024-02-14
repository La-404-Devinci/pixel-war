import type express from "express";

class AccountController {
    /**
     * Send a magic link to the user's email
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async sendMagicLink(req: express.Request, res: express.Response) {
        // TODO: Send a magic link containing the AUTHORIZATION token to the user's email
        /**
         * VALIDATION
         * * Validate the user email (must be a Devinci email)
         *
         * PROCESS
         * * Generate an AUTHORIZATION token
         * * Send the magic link to the user's email
         *
         * RESPONSE
         * * Send a success message
         * * Send an error message if the email is invalid
         */
    }

    /**
     * Log the user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async login(req: express.Request, res: express.Response) {
        // TODO: Log the user
        /**
         * VALIDATION
         * * Validate AUTHORIZATION token
         *
         * PROCESS
         * * Generate an AUTHENTICATION token
         *
         * RESPONSE
         * * Send the AUTHENTICATION token
         * * Send an error message if the AUTHORIZATION token is invalid
         * * Send an error message if the AUTHORIZATION token is expired
         */
    }

    // Admin routes
    /**
     * Mute/unmute a user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async muteUser(req: express.Request, res: express.Response) {
        // TODO: Mute/unmute a user
        /**
         * VALIDATION
         * * Check if the user is an admin
         * * Validate the user ID
         *
         * PROCESS
         * * Mute/unmute the user
         *
         * RESPONSE
         * * Send a success message
         * * Send an error message if the user ID is invalid
         */
    }

    /**
     * Ban/unban a user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async banUser(req: express.Request, res: express.Response) {
        // TODO: Ban/unban a user
        /**
         * VALIDATION
         * * Check if the user is an admin
         * * Validate the user ID
         *
         * PROCESS
         * * Ban/unban the user
         *
         * RESPONSE
         * * Send a success message
         * * Send an error message if the user ID is invalid
         */
    }
}

export default AccountController;
