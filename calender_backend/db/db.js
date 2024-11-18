import mysql from 'mysql2'
const connectionMysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'agendamento'
}).promise();


connectionMysql.connect((err)=>{
    if(err){
        console.error('Erro ao conectar ao banco de dados')
        return
    }else{
        console.log('Conectado ao banco de dados')
    }
})

export default connectionMysql