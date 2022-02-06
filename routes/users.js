const express = require('express');
const router = express.Router();
const { checkSchema,validationResult } = require('express-validator');
const controller=require("../controllers/controller.js");

module.exports=router.get("/",( req, res ) => { 
    res.status(200).json({message:"OK"});
});

module.exports=router.get("/:id",controller.getGPS); // роут с переданным id user

module.exports=router.post("/createUser",controller.createUser); // создание user

module.exports=router.post("/createGPSUser", // роут для создание gps по id user
    checkSchema({ // валидация переданных данных на корректность
        userId:{ //
            isInt:true
        },
        GPSLat:{
            custom: {
                options: value => {
                    const regexp = /^-?\d{1,2}\.\d{5,7}$/;
                    if(value > -90 && value < 90 && regexp.test(value)) return true;
                    return false;
                },
            },
        },
        GPSLon:{
            custom: {
                options: value => {
                    const regexp = /^-?\d{1,3}\.\d{5,7}$/;
                    if(value > -180 && value < 180 && regexp.test(value)) return true;
                return false;
                },
            },
        }
    }),
    ( req, res ) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) { // проверка на ошибки при валидации
            return res.status(400).json({ // отправляем клиенту ошибки 
                errors: errors.array()
            });
        }
        controller.createGPSUser(req,res);
});

