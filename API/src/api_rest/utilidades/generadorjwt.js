import jwt from 'jsonwebtoken';
import { logger } from './logger.js';

export const GenerarJWT = (payload) => {
    return new Promise((resolve, reject) => 
    {
        jwt.sign(payload,process.env.SECRETO_JWT,
            {
                expiresIn: '2h'
            },(err, token) => 
            {
                if(err)
                {
                    logger(err);
                    reject({Error: true});
                }
                else{
                    resolve(token);
                }
            }
        );
    });
};