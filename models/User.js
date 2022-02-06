const { Pool } = require('pg');

const pool = new Pool({ // создаем объект для подключения к БД
  user: 'postgres',
  host: 'localhost',
  database: 'testdb2',
  password: 'p232kv20',
  port: 5433,
});

class User{

  static addUser(nickName){ // метод для добавления user
    const sqlAddUser="insert into users(nickName) values($1);";
    return pool.query(sqlAddUser,[nickName]);
  }

  static addGPSUser(userId,GPSLat,GPSLon){ // метод для добавления gps координат по id user, с проверкой существования его
    const sqlAddGPS="insert into gps(userId,GPSLat,GPSLon) values((select id from users where id=$1),$2,$3);"
    return pool.query(sqlAddGPS,[userId,GPSLat,GPSLon]);
  }

  static getGPS(userId,startDate,finalDate){ // метод для получения gps координат по id user и по датам
    const sqlGetGPS=`select gpslat, gpslon,_date, userid from gps 
                      where userid = $1 
                      and _date >=  $2 and _date <= $3 order by _date`;
    return pool.query(sqlGetGPS,[userId, startDate, finalDate]);
    
  }
}
module.exports= User;