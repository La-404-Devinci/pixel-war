import type Account from "models/Account";

declare global {
    namespace Express {
        export interface Request {
            account: Account;
        }
    }
}
