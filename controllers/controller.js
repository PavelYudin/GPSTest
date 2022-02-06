const User=require("../models/User");//импортируем класс User

exports.createUser = ( req,res ) => {  
    if( !req.body ) return res.sendStatus(400);  //если тело запроса пустое
    let { nickName } = req.body; // деструктуризация объекта
    if( !nickName.trim().length ) return res.sendStatus(400); //если пусстое переданное значение
    User.addUser(nickName) //добавляем user
        .then( () => res.status(200).json({message:"ok"})) // добавление прошло успешно
        .catch( err => res.status(400).json({error:err.message})); // добавление с ошибкой прошло
};

exports.createGPSUser = ( req,res ) => {  
    if( !req.body ) return res.sendStatus(400);  // если тело запроса пустое
    let { userId, GPSLat, GPSLon } = req.body; // деструктуризация объекта
    User.addGPSUser(userId,GPSLat,GPSLon) // добавление по id user gps координат
        .then( result => res.status(200).json({message:"ok"})) // добавление прошло успешно
        .catch( err => res.status(400).json({error:err.message})); // добавление с ошибкой прошло
};

exports.getGPS = ( req,res ) => {
    const regexp=/\d{4}\.\d{2}\.\d{2}/; /* регулярное выражение с легкой проверкой даты,
                                        т.к. если дата не корректна(к примеру - больше чем 12 месяцев), то ошибка будет при запросе*/

    const STATIC_FINAL_DATE="3000.01.01"; // константа для определения конечной даты, если в запросе будет отсутствовать 
    const STATIC_START_DATE="1970.01.01"; // константа для определения начальной даты, если в запросе будет отсутствовать
    const userId=req.params["id"]; // присваиваем переданный id в переменную
    let {startDate,finalDate}=req.query; // деструктуризация объекта
    
    /* если ничего в запросе не было передано присваиваем константу */
    finalDate=finalDate || STATIC_FINAL_DATE; 
    startDate=startDate || STATIC_START_DATE;

    if( !isNaN(userId) ){ // если передано число
        if( regexp.test(startDate) && regexp.test(finalDate) ){ // если даты корректны

            // переводим в секунды 
            const startDateMSec=Date.parse(startDate);
            const finalDateMsec=Date.parse(finalDate);

            if( finalDateMsec >= startDateMSec ) {// если интервал дат задан верно
                User.getGPS(userId,startDate,finalDate) // получение gps координат по id user и временному отрезку
                .then( result =>  {
                    const objGPS={ //инициализируем объект для ответа клиенту
                        userId,
                        arrGPS:[]
                    };

                    if( result.rows.length ){ //если записи имеются, добавляем координаты в объект для ответа
                        objGPS.arrGPS=result.rows.map( obj => { 
                            return {GPSLat:obj.gpslat,GPSLon:obj.gpslon,date:obj._date.toString()} 
                        });
                    }
                    res.status(200).json({ objGPS }) // отсылаем клиенту данные
                })
                .catch( err => res.status(400).json({ error:err.message })); // запрос к БД с ошибкой прошел
            } else {
                res.status(400).json({ error:"Неверно переданы даты" });
            }
        }
    } else {
        res.status(400).json({ error:"Неверно передан идентификатор пользователя" });
    }
}







